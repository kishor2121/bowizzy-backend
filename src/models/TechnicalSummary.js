const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class TechnicalSummary extends Model {
  static get tableName() {
    return "technical_summary";
  }

  static get idColumn() {
    return "summary_id";
  }
}

module.exports = TechnicalSummary;
