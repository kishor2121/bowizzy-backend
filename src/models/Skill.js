const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class Skill extends Model {
  static get tableName() {
    return "skills";
  }

  static get idColumn() {
    return "skill_id";
  }
}

module.exports = Skill;