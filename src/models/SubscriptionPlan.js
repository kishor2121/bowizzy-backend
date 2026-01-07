const { Model } = require("objection");
const knex = require("../db/knex");

Model.knex(knex);

class SubscriptionPlan extends Model {
  static get tableName() {
    return "subscription_plans";
  }

  static get jsonAttributes() {
    return ["features"];
  }
}

module.exports = SubscriptionPlan;
