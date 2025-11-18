exports.up = function (knex) {
  return knex.schema.createTable("personal_details", function (table) {
    table.increments("personal_id").primary();

    table.integer("user_id").unsigned().references("user_id").inTable("users").onDelete("CASCADE");

    table.string("profile_photo_url");

    table.string("first_name");
    table.string("middle_name");
    table.string("last_name");

    table.string("email");
    table.string("mobile_number");

    table.date("date_of_birth");
    table.string("gender");

    table.specificType("languages_known", "TEXT[]");

    table.string("address");
    table.string("country");
    table.string("state");
    table.string("city");
    table.string("pincode");

    table.string("nationality");
    table.string("passport_number");

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("personal_details");
};
