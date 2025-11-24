const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class Education extends Model {
  static get tableName() {
    return "education_details";
  }

  static get idColumn() {
    return "education_id";
  }
}

module.exports = Education;
