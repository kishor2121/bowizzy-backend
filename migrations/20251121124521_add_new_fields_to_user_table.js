exports.up = function(knex) {
  return knex.schema.alterTable('users', function (table) {
    table.string('first_name').notNullable();
    table.string('middle_name');
    table.string('last_name').notNullable();
    table.string('phone_number').unique().notNullable();
    table.string('linkedin_url').notNullable();
    table.enum('gender', ['male', 'female', 'non-binary', 'prefer not to say']).notNullable();
  });
};


exports.down = function(knex) {
  return knex.schema.alterTable('users', function (table){
    table.dropColumns("first_name");
    table.dropColumns("middle_name");
    table.dropColumns("last_name");
    table.dropColumns("phone_number");
    table.dropColumns("linkedin_url");
    table.dropColumns("gender");
  });
};

