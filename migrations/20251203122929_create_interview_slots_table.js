exports.up = async function (knex) {
  // Create shared ENUM type
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interview_status_enum') THEN
        CREATE TYPE interview_status_enum AS ENUM ('open','confirmed','cancelled','completed','expired');
      END IF;
    END$$;
  `);

  // Sequence for interview code suffix
  await knex.raw(`CREATE SEQUENCE IF NOT EXISTS interview_code_seq START 1;`);

  // Create table
  await knex.schema.createTable("interview_slots", function (table) {
    table.increments("interview_slot_id").primary();

    table.text("interview_code").notNullable().unique(); // final code
    table.text("interview_code_prefix").notNullable();   // app sends prefix

    table.integer("candidate_id").unsigned().notNullable()
      .references("user_id").inTable("users").onDelete("CASCADE");

    table.text("job_role");
    table.text("interview_mode");
    table.text("experience");
    table.specificType("skills", "text[]");
    table.text("resume_url");

    table.specificType("interview_status", "interview_status_enum")
      .notNullable()
      .defaultTo("open");

    table.timestamp("start_time_utc", { useTz: true }).notNullable();
    table.timestamp("end_time_utc", { useTz: true }).notNullable();

    table.text("priority").notNullable().defaultTo("normal");
    table.timestamp("priority_updated", { useTz: true })
      .notNullable().defaultTo(knex.raw("now()"));

    table.timestamp("created_at", { useTz: true })
      .notNullable().defaultTo(knex.raw("now()"));
    table.timestamp("updated_at", { useTz: true })
      .notNullable().defaultTo(knex.raw("now()"));

    table.check("start_time_utc < end_time_utc");
  });

  // Generated range column (keeps helpful range for app-level overlap checks)
  await knex.raw(`
    ALTER TABLE interview_slots
    ADD COLUMN ts_range tstzrange
    GENERATED ALWAYS AS (tstzrange(start_time_utc, end_time_utc, '[)'))
    STORED;
  `);

  // NOTE: DB-level exclusion constraint that prevented overlapping slots for the same candidate
  // has been intentionally removed. Overlap checks should be enforced at the application level.

  // Indexes
  await knex.raw(`
    CREATE INDEX idx_interview_slots_candidate_start
      ON interview_slots (candidate_id, start_time_utc);
  `);

  await knex.raw(`
    CREATE INDEX idx_interview_slots_start_open
      ON interview_slots (start_time_utc)
      WHERE interview_status = 'open';
  `);

  // Trigger function to generate final interview_code
  await knex.raw(`
    CREATE OR REPLACE FUNCTION set_interview_code_from_prefix()
    RETURNS trigger AS $$
    DECLARE
      seq bigint;
      prefix text;
    BEGIN
      prefix := NEW.interview_code_prefix;

      IF prefix IS NULL OR prefix = '' THEN
        RAISE EXCEPTION 'interview_code_prefix must be provided';
      END IF;

      IF NEW.interview_code IS NOT NULL AND NEW.interview_code <> '' THEN
        RETURN NEW;
      END IF;

      seq := nextval('interview_code_seq');

      NEW.interview_code := prefix || '#' || lpad(seq::text, 5, '0');

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Trigger
  await knex.raw(`
    CREATE TRIGGER trg_set_interview_code
    BEFORE INSERT ON interview_slots
    FOR EACH ROW
    EXECUTE FUNCTION set_interview_code_from_prefix();
  `);
};

exports.down = async function (knex) {
  // Attempt to drop trigger/function (IF EXISTS used)
  await knex.raw(`DROP TRIGGER IF EXISTS trg_set_interview_code ON interview_slots;`);
  await knex.raw(`DROP FUNCTION IF EXISTS set_interview_code_from_prefix();`);

  await knex.raw(`DROP INDEX IF EXISTS idx_interview_slots_start_open;`);
  await knex.raw(`DROP INDEX IF EXISTS idx_interview_slots_candidate_start;`);

  // If you previously had a DB constraint it would be dropped here; kept for safety with IF EXISTS
  await knex.raw(`ALTER TABLE IF EXISTS interview_slots DROP CONSTRAINT IF EXISTS no_overlap_slots_candidate;`);

  await knex.raw(`ALTER TABLE IF EXISTS interview_slots DROP COLUMN IF EXISTS ts_range;`);

  await knex.schema.dropTableIfExists("interview_slots");

  await knex.raw(`DROP SEQUENCE IF EXISTS interview_code_seq;`);

  await knex.raw(`DROP TYPE IF EXISTS interview_status_enum;`);
};
