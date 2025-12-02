exports.up = async function (knex) {
  // Ensure btree_gist exists
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS btree_gist;`);

  // Ensure ENUM exists
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interview_status_enum') THEN
        CREATE TYPE interview_status_enum AS ENUM ('open','confirmed','cancelled','completed','expired');
      END IF;
    END$$;
  `);

  await knex.schema.createTable("interview_schedules", function (table) {
    table.increments("interview_schedule_id").primary();

    table.integer("interview_slot_id").unsigned().notNullable()
      .references("interview_slot_id").inTable("interview_slots").onDelete("RESTRICT");

    table.integer("candidate_id").unsigned().notNullable()
      .references("user_id").inTable("users").onDelete("CASCADE");

    table.integer("interviewer_id").unsigned().notNullable()
      .references("user_id").inTable("users").onDelete("CASCADE");

    table.specificType("interview_status", "interview_status_enum")
      .notNullable().defaultTo("confirmed");

    table.timestamp("start_time_utc", { useTz: true }).notNullable();
    table.timestamp("end_time_utc", { useTz: true }).notNullable();

    table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.raw("now()"));
    table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.raw("now()"));

    table.check("start_time_utc < end_time_utc");
  });

  // ts_range for schedules
  await knex.raw(`
    ALTER TABLE interview_schedules
    ADD COLUMN ts_range tstzrange
    GENERATED ALWAYS AS (tstzrange(start_time_utc, end_time_utc, '[)'))
    STORED;
  `);

  // Prevent overlapping schedules

  await knex.raw(`
    ALTER TABLE interview_schedules
    ADD CONSTRAINT no_overlap_schedule_candidate
    EXCLUDE USING GIST (
      candidate_id WITH =,
      ts_range WITH &&
    );
  `);

  await knex.raw(`
    ALTER TABLE interview_schedules
    ADD CONSTRAINT no_overlap_schedule_interviewer
    EXCLUDE USING GIST (
      interviewer_id WITH =,
      ts_range WITH &&
    );
  `);

  // Indexes
  await knex.raw(`
    CREATE INDEX idx_interview_schedules_candidate_start
      ON interview_schedules (candidate_id, start_time_utc);
  `);

  await knex.raw(`
    CREATE INDEX idx_interview_schedules_interviewer_start
      ON interview_schedules (interviewer_id, start_time_utc);
  `);
};

exports.down = async function (knex) {
  await knex.raw(`DROP INDEX IF EXISTS idx_interview_schedules_interviewer_start;`);
  await knex.raw(`DROP INDEX IF EXISTS idx_interview_schedules_candidate_start;`);

  await knex.raw(`ALTER TABLE IF EXISTS interview_schedules DROP CONSTRAINT IF EXISTS no_overlap_schedule_interviewer;`);
  await knex.raw(`ALTER TABLE IF EXISTS interview_schedules DROP CONSTRAINT IF EXISTS no_overlap_schedule_candidate;`);
  await knex.raw(`ALTER TABLE IF EXISTS interview_schedules DROP COLUMN IF EXISTS ts_range;`);

  await knex.schema.dropTableIfExists("interview_schedules");
};
