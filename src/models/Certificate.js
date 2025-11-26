const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class Certificate extends Model {
  static get tableName() {
    return "certificates";
  }

  static get idColumn() {
    return "certificate_id";
  }
}

module.exports = Certificate;
