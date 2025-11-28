exports.up = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.boolean('is_verified').notNullable().defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.dropColumn('is_verified');
  });
};

