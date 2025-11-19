exports.up = function (knex) {
  return knex.schema.createTable("skills", function (table) {
    table.increments("skill_id").primary();

    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("skill_name").notNullable();
    table.string("skill_level"); 

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("skills");
};
