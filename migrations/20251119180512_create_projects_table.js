exports.up = function (knex) {
  return knex.schema.createTable("projects", function (table) {
    table.increments("project_id").primary();

    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("project_title").notNullable();
    table.string("project_type");
    table.date("start_date");
    table.date("end_date");
    table.boolean("currently_working").defaultTo(false);
    table.text("description");
    table.text("roles_responsibilities");

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("projects");
};
