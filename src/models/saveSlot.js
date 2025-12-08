const { Model } = require("objection");
const db = require("../db/knex");

Model.knex(db);

class SaveSlot extends Model {
  static get tableName() {
    return "saved_slots";
  }

  static get idColumn() {
    return "saved_slot_id";
  }
}

module.exports = SaveSlot;
