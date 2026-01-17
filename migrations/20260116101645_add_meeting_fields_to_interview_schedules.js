exports.up = function (knex) {
  return knex.schema.alterTable("interview_schedules", function (table) {
    table.text("meeting_link");
    table.string("meeting_type");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("interview_schedules", function (table) {
    table.dropColumn("meeting_link");
    table.dropColumn("meeting_type");
  });
};
