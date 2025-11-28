exports.up = function(knex) {
  return knex.schema.createTable("interview_booking", function (table) {
    table.increments("interview_booking_id").primary();

    table.integer("candidate_id").unsigned().references("user_id").inTable("users").onDelete("CASCADE");
    table.integer("interviewer_id").unsigned().references("user_id").inTable("users").onDelete("CASCADE");

    table.integer("interview_slot_id").unsigned().references("interview_slot_id").inTable("interview_slot").onDelete("CASCADE");

    table.enum("interview_status", ["open", "confirmed", "cancelled", "completed", "expired"]).defaultTo('open');

    table.timestamp("start_time_utc", { useTz: true }).notNullable();
    table.timestamp("end_time_utc", { useTz: true }).notNullable();

    table.timestamps(true, true);
  });
};


exports.down = function(knex) {
  return knex.schema.dropTable("interview_booking");
};