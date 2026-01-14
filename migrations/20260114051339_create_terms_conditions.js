exports.up = function (knex) {
  return knex.schema.createTable("terms_conditions", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("description").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("terms_conditions");
};
