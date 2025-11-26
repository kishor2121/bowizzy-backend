const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class ResumeTemplate extends Model {
  static get tableName() {
    return "resume_templates";
  }

  static get idColumn() {
    return "resume_template_id";
  }
}

module.exports = ResumeTemplate;
