const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class Link extends Model {
  static get tableName() {
    return "links";
  }

  static get idColumn() {
    return "link_id";
  }
}

module.exports = Link;
