exports.up = async function (knex) {
  await knex.schema.alterTable("interviewer_reviews", function (table) {
    table
      .integer("candidate_id")
      .unsigned()
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("interviewer_reviews", function (table) {
    table.dropColumn("candidate_id");
  });
};
