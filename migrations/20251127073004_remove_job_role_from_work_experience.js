exports.up = function (knex) {
  return knex.schema.alterTable("work_experience", function (table) {
    table.dropColumn("job_role");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("work_experience", function (table) {
    table.string("job_role"); 
  });
};
