exports.up = function (knex) {
  return knex.schema.createTable("user_subscriptions", function (table) {
    table.increments("subscription_id").primary();
    
    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table.enum("plan_type", ["free", "plus", "premium"]).defaultTo("free");

    table.date("start_date").defaultTo(knex.fn.now());
    table.date("end_date").nullable();

    table.enum("status", ["active", "expired"]).defaultTo("active");

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user_subscriptions");
};