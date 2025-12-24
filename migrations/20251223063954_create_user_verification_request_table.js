exports.up = async function (knex) {
  await knex.schema.createTable("user_verification_requests", function (table) {
    table.increments("id").primary();

    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table.enu("verification_status", ["PENDING", "APPROVED", "REJECTED"])
      .notNullable()
      .defaultTo("PENDING");

    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("user_verification_requests");
};
