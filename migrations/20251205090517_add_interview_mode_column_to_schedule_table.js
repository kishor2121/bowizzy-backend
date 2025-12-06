exports.up = async function (knex) {
  await knex.schema.alterTable("interview_schedules", function (table) {
    table.string("interview_mode");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("interview_schedules", function (table) {
    table.dropColumn("interview_mode");
  });
};
