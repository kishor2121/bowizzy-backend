exports.up = async function (knex) {
  await knex.schema.alterTable("candidate_reviews", function (table) {
    table.renameColumn("id", "candidate_review_id");
  });

  await knex.schema.alterTable("candidate_reviews", function (table) {
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
  await knex.schema.alterTable("candidate_reviews", function (table) {
    table.dropColumn("candidate_id");
  });

  await knex.schema.alterTable("candidate_reviews", function (table) {
    table.renameColumn("candidate_review_id", "id");
  });
};
