exports.up = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table
      .string('is_interviewer_verified')
      .defaultTo('false')
      .alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table
      .boolean('is_interviewer_verified')
      .defaultTo(false)
      .alter();
  });
};
