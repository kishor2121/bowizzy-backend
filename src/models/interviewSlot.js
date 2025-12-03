const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class InterviewSlot extends Model {
  static get tableName() {
    return "interview_slots";
  }

  static get idColumn() {
    return "interview_slot_id";
  }
}


module.exports = InterviewSlot;