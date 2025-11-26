const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class PersonalDetails extends Model {
  static get tableName() {
    return "personal_details";
  }

  static get idColumn() {
    return "personal_id";
  }
}

module.exports = PersonalDetails;
