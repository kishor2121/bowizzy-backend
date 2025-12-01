exports.up = function (knex) {
  return knex.schema.createTable("technical_summary", function (table) {
    table.increments("summary_id").primary();

    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table.text("summary"); 

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("technical_summary");
};
