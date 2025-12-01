const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class UserSubscription extends Model {
  static get tableName() {
    return "user_subscriptions";
  }

  static get idColumn() {
    return "subscription_id";
  }
}

module.exports = UserSubscription;