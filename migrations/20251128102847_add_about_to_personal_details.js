exports.up = function (knex) {
  return knex.schema.table("personal_details", function (table) {
    table.text("about"); 
  });
};

exports.down = function (knex) {
  return knex.schema.table("personal_details", function (table) {
    table.dropColumn("about");
  });
};
