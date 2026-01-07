const { Model } = require("objection");
const knex = require("../db/knex");

Model.knex(knex);

class Pricing extends Model {
  static get tableName() {
    return "pricing";
  }
}

module.exports = Pricing;
