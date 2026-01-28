exports.up = function (knex) {
  return knex.schema.table("user_payments", function (table) {
    table
      .integer("interview_slot_id")
      .unsigned()
      .nullable()
      .references("interview_slot_id")
      .inTable("interview_slots")
      .onDelete("SET NULL");
  });
};

exports.down = function (knex) {
  return knex.schema.table("user_payments", function (table) {
    table.dropColumn("interview_slot_id");
  });
};
