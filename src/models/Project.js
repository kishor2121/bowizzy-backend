const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class Project extends Model {
  static get tableName() {
    return "projects";
  }

  static get idColumn() {
    return "project_id";
  }
}

module.exports = Project;
