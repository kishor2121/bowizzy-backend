const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class JobRole extends Model {
  static get tableName() {
    return "job_roles";
  }

  static get idColumn() {
    return "id";
  }
}

module.exports = JobRole