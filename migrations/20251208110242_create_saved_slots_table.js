exports.up = async function (knex) {
  await knex.schema.createTable("saved_slots", function (table) {
    table.increments("saved_slot_id").primary();

    table
      .integer("interview_slot_id")
      .unsigned()
      .notNullable()
      .references("interview_slot_id")
      .inTable("interview_slots")
      .onDelete("CASCADE");

    table
      .integer("interviewer_id")
      .unsigned()
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table.enu("interview_priority", ["normal", "high"]);

    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("saved_slots");
};
