const Education = require("../models/Education");
const db = require("../db/knex");

exports.create = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const data = req.body;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    if (Array.isArray(data)) {
      const payload = data.map(item => ({ ...item, user_id }));
      const records = await Education
        .query()
        .insert(payload)
        .returning("*");
      return res.status(201).json(records);
    }

    data.user_id = user_id;
    const [record] = await Education
      .query()
      .insert(data)
      .returning("*");

    return res.status(201).json(record);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating education_details" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const record = await Education
      .query()
      .where({ user_id, education_id: id })
      .first();

    if (!record) return res.status(404).json({ message: "Not found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching education_details" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const list = await Education.query().where({ user_id });

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching list" });
  }
};

exports.update = async (req, res) => {
  try {
    const { user_id, id } = req.params;
    const data = req.body;

    const record = await Education.query()
      .where({ user_id, education_id: id })
      .first();

    if (!record) {
      return res.status(404).json({ message: "Education record not found for this user" });
    }

    const updated = await Education.query()
      .patchAndFetchById(id, { ...data, updated_at: db.fn.now() });

    return res.status(200).json(updated);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating education_details" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const deleted = await Education
      .query()
      .where({ user_id, education_id: id })
      .del();

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting education" });
  }
};
