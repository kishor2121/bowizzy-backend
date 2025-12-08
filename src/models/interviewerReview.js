const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class Certificate extends Model {
  static get tableName() {
    return "interviewer_reviews";
  }

  static get idColumn() {
    return "interviewer_review_id";
  }
}

module.exports = Certificate;
