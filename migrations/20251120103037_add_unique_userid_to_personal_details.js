exports.up = function (knex) {
  return knex.schema.alterTable("personal_details", function (table) {
    table.unique("user_id");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("personal_details", function (table) {
    table.dropUnique("user_id");
  });
};
