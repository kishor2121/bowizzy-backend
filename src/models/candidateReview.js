const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class Certificate extends Model {
  static get tableName() {
    return "candidate_reviews";
  }

  static get idColumn() {
    return "candidate_review_id";
  }
}

module.exports = Certificate;
