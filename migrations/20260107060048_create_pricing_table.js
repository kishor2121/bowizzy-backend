exports.up = function (knex) {
  return knex.schema.createTable("pricing", function (table) {
    table.increments("id").primary();

    table.string("bowizzy_plan_type").notNullable();

    table.integer("amount").notNullable();

    table.boolean("is_active").defaultTo(true);

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("pricing");
};
