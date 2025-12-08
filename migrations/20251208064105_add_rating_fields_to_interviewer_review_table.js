exports.up = async function (knex) {
  await knex.schema.alterTable("interviewer_reviews", function (table) {
    table.enu("professionalism_conduct_rating", [1, 2, 3, 4, 5]);
    table.enu("clarity_of_questions_rating", [1, 2, 3, 4, 5]);
    table.enu("knowledge_of_role_rating", [1, 2, 3, 4, 5]);
    table.enu("engagement_during_interview_rating", [1, 2, 3, 4, 5]);
    table.enu("timeliness_organization_rating", [1, 2, 3, 4, 5]);
    table.enu("overall_experience_rating", [1, 2, 3, 4, 5]);
});
};

exports.down = async function (knex) {
  await knex.schema.alterTable("interviewer_reviews", function (table) {
    table.dropColumn("professionalism_conduct_rating");
    table.dropColumn("clarity_of_questions_rating");
    table.dropColumn("knowledge_of_role_rating");
    table.dropColumn("engagement_during_interview_rating");
    table.dropColumn("timeliness_organization_rating");
    table.dropColumn("overall_experience_rating");
  });
};
