exports.up = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.string("first_name");       
    table.string("middle_name");     
    table.string("last_name");        
    table.string("phone_number").unique();  
    table.string("linkedin_url");      
    table.enum("gender", ["male", "female", "non-binary", "prefer not to say"]);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.dropColumn("first_name");
    table.dropColumn("middle_name");
    table.dropColumn("last_name");
    table.dropColumn("phone_number");
    table.dropColumn("linkedin_url");
    table.dropColumn("gender");
  });
};
