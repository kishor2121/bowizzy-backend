exports.up = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.text("current_token");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.dropColumn("current_token");
  });
};
