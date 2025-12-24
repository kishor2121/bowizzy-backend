const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class UserVerificationRequest extends Model {
  static get tableName() {
    return "user_verification_requests";
  }

  static get idColumn() {
    return "id";
  }
}

module.exports = UserVerificationRequest;
