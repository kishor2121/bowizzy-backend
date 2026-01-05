const { Model } = require("objection");

class UserPayment extends Model {
  static get tableName() {
    return "user_payments";
  }

  static get idColumn() {
    return "payment_id";
  }
}

module.exports = UserPayment;
