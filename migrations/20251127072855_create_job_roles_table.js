exports.up = function (knex) {
  return knex.schema.createTable("job_roles", function (table) {
    table.increments("id").primary();

    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("job_role").notNullable();

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("job_roles");
};
