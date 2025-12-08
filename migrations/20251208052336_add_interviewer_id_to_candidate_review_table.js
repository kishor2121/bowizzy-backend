exports.up = async function (knex) {
  await knex.schema.alterTable("candidate_reviews", function (table) {
    table
      .integer("interviewer_id")
      .unsigned()
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("candidate_reviews", function (table) {
    table.dropColumn("interviewer_id");
  });
};
