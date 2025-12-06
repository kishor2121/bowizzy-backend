exports.up = function (knex) {
  return knex.schema.createTable("bank_details", function (table) {
    table.increments("bank_id").primary();

    table
      .integer("user_id")
      .unsigned()
      .notNullable() 
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("bank_name").notNullable();
    table.string("account_holder_name").notNullable();
    table.string("account_number").notNullable();
    table.string("ifsc_code").notNullable();

    table
      .enu("account_type", ["Savings Account", "Current Account"])
      .notNullable();

    table.string("branch_name").notNullable();
    table.string("document_url");

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("bank_details");
};
