exports.up = function (knex) {
  return knex.schema.createTable("user_payments", function (table) {
    table.increments("payment_id").primary();

    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("razorpay_order_id");
    table.string("razorpay_payment_id");
    table.string("razorpay_signature");

    table.integer("amount"); 
    table.string("currency").defaultTo("INR");

    table.enum("status", ["created", "success", "failed"]).defaultTo("created");

    table.string("plan_type"); 

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user_payments");
};
