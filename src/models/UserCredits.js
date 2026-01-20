const { Model } = require("objection");

class UserCredits extends Model {
  static get tableName() {
    return "user_credits";
  }

  static get idColumn() {
    return "id";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./User"),
        join: {
          from: "user_credits.user_id",
          to: "users.user_id"
        }
      }
    };
  }
}

module.exports = UserCredits;
