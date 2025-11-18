exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('user_id').primary();
    table.string('email').unique().notNullable();
    table.text('password_hash').notNullable();
    table.enum('user_type', ['regular', 'interviewer', 'admin']).notNullable();
    table.boolean('is_interviewer_verified').defaultTo(false);
    table.timestamps(true, true); // created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
