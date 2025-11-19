exports.up = function (knex) {
  return knex.schema.createTable("work_experience", function (table) {
    table.increments("experience_id").primary();

    table
      .integer("user_id")
      .unsigned()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("job_role");           

    table.string("company_name");
    table.string("job_title");          
    table.string("employment_type");    
    table.string("location");
    table.string("work_mode");        

    table.date("start_date");
    table.date("end_date");
    table.boolean("currently_working_here").defaultTo(false);

    table.text("description");

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("work_experience");
};
