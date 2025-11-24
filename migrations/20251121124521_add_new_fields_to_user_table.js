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
    table.dropColumn("first_name");
    table.dropColumn("middle_name");
    table.dropColumn("last_name");
    table.dropColumn("phone_number");
    table.dropColumn("linkedin_url");
    table.dropColumn("gender");
  });
};

