const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class InterviewSchedule extends Model {
  static get tableName() {
    return "interview_schedules";
  }

  static get idColumn() {
    return "interview_schedules_id";
  }
}


module.exports = InterviewSchedule;