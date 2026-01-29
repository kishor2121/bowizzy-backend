exports.up = async function (knex) {
  return knex.schema.alterTable("interview_slots", function (table) {
    table.decimal("paid_amount", 10, 2).nullable();
  });
};

exports.down = async function (knex) {
  return knex.schema.alterTable("interview_slots", function (table) {
    table.dropColumn("paid_amount");
  });
};
