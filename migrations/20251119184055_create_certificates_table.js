exports.up = function (knex) {
  return knex.schema.createTable("certificates", function (table) {
    table.increments("certificate_id").primary();

    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("certificate_type");
    table.string("certificate_title");
    table.string("domain");
    table.string("certificate_provided_by");
    table.date("date");
    table.text("description");

    table.string("file_url");       
    table.string("file_type");      

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("certificates");
};
