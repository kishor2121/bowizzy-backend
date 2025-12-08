exports.up = async function (knex) {
  await knex.schema.createTable("interviewer_reviews", function (table) {
    table.increments("interviewer_review_id").primary();

    table
      .integer("interviewer_id")
      .unsigned()
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .integer("interview_schedule_id")
      .unsigned()
      .notNullable()
      .references("interview_schedule_id")
      .inTable("interview_schedules")
      .onDelete("CASCADE");

    table.text("professionalism_conduct");       
    table.text("clarity_of_questions");          
    table.text("knowledge_of_role");             
    table.text("engagement_during_interview");   
    table.text("timeliness_organization");       
    table.text("overall_experience");            
    table.text("final_comments");                

    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("interviewer_reviews");
};
