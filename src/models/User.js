const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "user_id";
  }
}

module.exports = User;
