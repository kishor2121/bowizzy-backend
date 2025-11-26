exports.up = function (knex) {
  return knex.schema.alterTable("work_experience", function (table) {
    table.string("start_date").alter();
    table.string("end_date").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("work_experience", function (table) {
    table.date("start_date").alter();
    table.date("end_date").alter();
  });
};
