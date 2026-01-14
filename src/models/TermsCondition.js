const { Model } = require("objection");

class TermsCondition extends Model {
  static get tableName() {
    return "terms_conditions";
  }

  static get idColumn() {
    return "id";
  }
}

module.exports = TermsCondition;
