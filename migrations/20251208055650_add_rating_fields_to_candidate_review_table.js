exports.up = async function (knex) {
  await knex.schema.alterTable("candidate_reviews", function (table) {
    table.enu("communication_skills_rating", [1, 2, 3, 4, 5]);
    table.enu("technical_knowledge_rating", [1, 2, 3, 4, 5]);
    table.enu("problem_solving_analytical_skills_rating", [1, 2, 3, 4, 5]);
    table.enu("relevant_experience_skills_rating", [1, 2, 3, 4, 5]);
    table.enu("adaptability_learning_ability_rating", [1, 2, 3, 4, 5]);
    table.enu("cultural_team_fit_rating", [1, 2, 3, 4, 5]);
    table.enu("overall_impression_rating", [1, 2, 3, 4, 5]);
});
};

exports.down = async function (knex) {
  await knex.schema.alterTable("candidate_reviews", function (table) {
    table.dropColumn("communication_skills_rating");
    table.dropColumn("technical_knowledge_rating");
    table.dropColumn("problem_solving_analytical_skills_rating");
    table.dropColumn("relevant_experience_skills_rating");
    table.dropColumn("adaptability_learning_ability_rating");
    table.dropColumn("cultural_team_fit_rating");
    table.dropColumn("overall_impression_rating");
  });
};
