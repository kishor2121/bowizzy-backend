exports.up = function (knex) {
  return knex.schema.table("user_subscriptions", function (table) {
    table.json("selected_templates").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table("user_subscriptions", function (table) {
    table.dropColumn("selected_templates");
  });
};
