exports.up = function (knex) {
  return knex.schema.table('interview_slots', function (table) {
    table.integer('credits_deducted').defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.table('interview_slots', function (table) {
    table.dropColumn('credits_deducted');
  });
};
