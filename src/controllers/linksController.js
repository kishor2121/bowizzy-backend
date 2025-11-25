const Link = require("../models/Link");
const db = require("../db/knex");

exports.create = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { links } = req.body;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(links))
      return res.status(400).json({ message: "links must be an array" });

    const rows = links.map((l) => ({
      ...l,
      user_id,
    }));

    const inserted = await Link.query().insert(rows).returning("*");

    res.status(201).json(inserted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating links" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const list = await Link.query()
      .where({ user_id })
      .orderBy("link_id", "asc");

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching links" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { user_id, link_id } = req.params;

    const record = await Link.query()
      .where({ user_id, link_id })
      .first();

    if (!record)
      return res.status(404).json({ message: "Not found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching link" });
  }
};

exports.update = async (req, res) => {
  try {
    const { user_id, link_id } = req.params;
    const data = req.body;

    // Returns the no of rows that has been updated
    const updatedRowCount = await Link.query()
      .where({ user_id, link_id })
      .update({ ...data, updated_at: db.fn.now() });

    if (!updatedRowCount)
      return res.status(404).json({ message: "Not found" });

    const updated = await Link
    .query()
    .findOne({ user_id, link_id });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating link" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, link_id } = req.params;

    const deleted = await Link.query()
      .where({ user_id, link_id })
      .del();

    if (!deleted)
      return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting link" });
  }
};
