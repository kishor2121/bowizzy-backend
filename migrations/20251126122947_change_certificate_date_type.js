exports.up = function (knex) {
  return knex.schema.alterTable("certificates", function (table) {
    table.string("date").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("certificates", function (table) {
    table.date("date").alter();
  });
};
