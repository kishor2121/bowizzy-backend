const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "user_id";
  }

  static get relationMappings() {
    const PersonalDetails = require("./PersonalDetails");
    const Skill = require("./Skill");
    const Education = require("./Education");
    const WorkExperience = require("./WorkExperience");

    return {
      personal_details: {
        relation: Model.HasOneRelation,
        modelClass: PersonalDetails,
        join: {
          from: "users.user_id",
          to: "personal_details.user_id",
        },
      },
      skills: {
        relation: Model.HasManyRelation,
        modelClass: Skill,
        join: {
          from: "users.user_id",
          to: "skills.user_id",
        },
      },
      education_details: {
        relation: Model.HasManyRelation,
        modelClass: Education,
        join: {
          from: "users.user_id",
          to: "education_details.user_id",
        },
      },
      work_experience: {
        relation: Model.HasManyRelation,
        modelClass: WorkExperience,
        join: {
          from: "users.user_id",
          to: "work_experience.user_id",
        },
      },
      job_roles: {
        relation: Model.HasManyRelation,
        modelClass: require("./JobRole"),
        join: {
          from: "users.user_id",
          to: "job_roles.user_id",
        },
      },
    };
  }
}

module.exports = User;
