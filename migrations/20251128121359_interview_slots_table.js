exports.up = function(knex) {
  return knex.schema.createTable("interview_slot", function (table) {
    table.increments("interview_slot_id").primary();

    table.integer("user_id").unsigned().references("user_id").inTable("users").onDelete("CASCADE");

    table.string("interview_id");
    table.string("job_role");
    table.string("interview_mode");
    table.string("experience");
    table.integer("resume_id").unsigned().references("resume_template_id").inTable("resume_templates").onDelete("CASCADE");;
    table.string("resume_url");
    table.enum("interview_status", ["open", "confirmed", "cancelled", "completed", "expired"]).defaultTo('open');
    table.specificType("skills", "TEXT[]");
    table.string("raw_date_string");
    table.string("raw_time_string");

    table.timestamp("start_time_utc", { useTz: true }).notNullable();
    table.timestamp("end_time_utc", { useTz: true }).notNullable();

    table.timestamps(true, true);
  });
};


exports.down = function(knex) {
  return knex.schema.dropTable("interview_slot");
};