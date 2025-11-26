exports.up = function (knex) {
  return knex.schema.alterTable("education_details", function (table) {
    table.string("start_year").alter();
    table.string("end_year").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("education_details", function (table) {
    table.integer("start_year").alter();
    table.integer("end_year").alter();
  });
};
