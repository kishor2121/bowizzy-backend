exports.up = function (knex) {
  return knex.schema.table("personal_details", function (table) {
    table.string("linkedin_url");
  });
};

exports.down = function (knex) {
  return knex.schema.table("personal_details", function (table) {
    table.dropColumn("linkedin_url");
  });
};
