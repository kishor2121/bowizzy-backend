const Link = require("../models/Link");
const User = require("../models/User");
const db = require("../db/knex");

exports.create = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { links } = req.body;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(links))
      return res.status(400).json({ message: "links must be an array" });

    const rows = links.map(l => ({
      ...l,
      user_id
    }));

    const inserted = await Link.query().insert(rows);

    res.status(201).json(inserted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating links" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    const list = await Link
      .query()
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

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    const record = await Link
      .query()
      .findOne({ user_id, link_id });

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

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    const updatedRowCount = await Link
      .query()
      .patch(data)
      .where({ user_id, link_id });

    if (updatedRowCount === 0)
      return res.status(404).json({ message: "Not found" });

    const updated = await Link
      .query()
      .findOne({ user_id, link_id });

    return res.status(200).json(updated);

  } catch (err) {
    return res.status(500).json({ message: "Error updating link" });
  }
};


exports.remove = async (req, res) => {
  try {
    const { user_id, link_id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    const deleted = await Link
      .query()
      .delete()
      .where({ user_id, link_id });

    if (!deleted)
      return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting link" });
  }
};
