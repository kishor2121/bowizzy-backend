exports.up = function (knex) {
  return knex.schema.alterTable("personal_details", function (table) {
    table.string("date_of_birth").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("personal_details", function (table) {
    table.date("date_of_birth").alter();
  });
};
