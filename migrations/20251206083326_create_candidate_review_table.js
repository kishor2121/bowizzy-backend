exports.up = async function (knex) {
  await knex.schema.createTable("candidate_reviews", function (table) {
    table.increments("id").primary();

    table
      .integer("interview_schedule_id")
      .unsigned()
      .notNullable()
      .references("interview_schedule_id")
      .inTable("interview_schedules")
      .onDelete("CASCADE");

    table.text("communication_skills");               
    table.text("technical_knowledge");                
    table.text("problem_solving_analytical_skills");  
    table.text("relevant_experience_skills");         
    table.text("adaptability_learning_ability");      
    table.text("cultural_team_fit");                  
    table.text("overall_impression");                 
    table.text("final_comments");                     

    table
      .enu("final_recommendation", [
        "highly_recommend",
        "recommend",
        "neutral",
        "not_recommend",
      ]);

    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("candidate_reviews");
};
