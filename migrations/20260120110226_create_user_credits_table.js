exports.up = function (knex) {
  return knex.schema.createTable('user_credits', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('credits').defaultTo(0);
    table.timestamps(true, true);

    table
      .foreign('user_id')
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('user_credits');
};
