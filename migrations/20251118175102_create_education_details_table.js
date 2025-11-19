exports.up = function (knex) {
  return knex.schema.createTable("education_details", function (table) {
    table.increments("education_id").primary();

    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .enu("education_type", ["sslc", "puc", "higher", "other"])
      .notNullable();

    table.string("institution_name");
    table.string("board_type");
    table.string("subject_stream");

    table.string("degree");
    table.string("field_of_study");
    table.string("university_name");

    table.integer("start_year");
    table.integer("end_year");
    table.boolean("currently_pursuing").defaultTo(false);

    table.string("result_format");
    table.string("result");

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("education_details");
};
