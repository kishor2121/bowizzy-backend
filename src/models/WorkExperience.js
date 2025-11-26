const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class WorkExperience extends Model {
  static get tableName() {
    return "work_experience";
  }

  static get idColumn() {
    return "experience_id";
  }
}

module.exports = WorkExperience;
