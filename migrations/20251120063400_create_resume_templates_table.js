exports.up = function (knex) {
  return knex.schema.createTable("resume_templates", function (table) {
    table.increments("resume_template_id").primary();

    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("template_name");
    table.string("template_id"); 
    table.string("thumbnail_url");
    table.string("template_file_url");

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("resume_templates");
};
