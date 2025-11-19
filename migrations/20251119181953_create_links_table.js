exports.up = function (knex) {
  return knex.schema.createTable("links", function (table) {
    table.increments("link_id").primary();

    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("link_type"); 
    table.string("url").notNullable();
    table.text("description");

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("links");
};
