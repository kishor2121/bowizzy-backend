const Skill = require("../models/Skill");
const User = require("../models/User");
const db = require("../db/knex");

exports.create = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { skills } = req.body;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(skills))
      return res.status(400).json({ message: "skills must be an array" });

    const rows = skills.map(s => ({
      ...s,
      user_id
    }));

    const inserted = await Skill.query().insert(rows);

    res.status(201).json(inserted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating skills" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    const list = await Skill
      .query()
      .where({ user_id })
      .orderBy("skill_id", "asc");

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching skills" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { user_id, skill_id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    const record = await Skill
      .query()
      .findOne({ user_id, skill_id });

    if (!record)
      return res.status(404).json({ message: "Not found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching skill" });
  }
};

exports.update = async (req, res) => {
  try {
    const { user_id, skill_id } = req.params;
    const data = req.body;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    const updatedRowCount = await Skill
      .query()
      .patch(data)
      .where({ user_id, skill_id });

    if (updatedRowCount === 0)
      return res.status(404).json({ message: "Not found" });

    const updated = await Skill
      .query()
      .findOne({ user_id, skill_id });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating skill" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, skill_id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    const deleted = await Skill
      .query()
      .delete()
      .where({ user_id, skill_id });

    if (!deleted)
      return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting skill" });
  }
};
