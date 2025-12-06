const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class BankDetails extends Model {
  static get tableName() {
    return "bank_details";
  }

  static get idColumn() {
    return "bank_id";
  }
}


module.exports = BankDetails;