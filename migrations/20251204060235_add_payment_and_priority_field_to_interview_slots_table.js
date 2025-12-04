exports.up = async function (knex) {
  return knex.schema.alterTable("interview_slots", function (table) {
    table.boolean("is_payment_done").notNullable().defaultTo(false);
  });
};

exports.down = async function (knex) {
  return knex.schema.alterTable("interview_slots", function (table) {
    table.dropColumn("is_payment_done");
  });
};
