const WorkExperience = require("../models/WorkExperience");
const User = require("../models/User");
const db = require("../db/knex");

exports.create = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { job_role, experiences } = req.body;

    const userExists = await User.query().findById(user_id);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(experiences)) {
      return res.status(400).json({ message: "experiences must be an array" });
    }

    const payload = experiences.map(exp => ({
      ...exp,
      user_id,
      job_role
    }));

    const records = await WorkExperience.query().insert(payload);

    res.status(201).json(records);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating work experience" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const list = await WorkExperience
      .query()
      .where({ user_id })
      .orderBy("experience_id", "asc");

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching work experience" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const record = await WorkExperience
      .query()
      .findOne({
        user_id,
        experience_id: id
      });

    if (!record) return res.status(404).json({ message: "Not found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching work experience" });
  }
};

exports.update = async (req, res) => {
  try {
    const { user_id, id } = req.params;
    const data = req.body;

    const userExists = await User.query().findById(user_id);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const updatedRowCount = await WorkExperience
      .query()
      .patch(data)
      .where({
        user_id,
        experience_id: id
      });

    if (updatedRowCount === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const updated = await WorkExperience
      .query()
      .findOne({
        user_id,
        experience_id: id
      });

    return res.status(200).json(updated);

  } catch (err) {
    return res.status(500).json({ message: "Error updating work experience" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const deleted = await WorkExperience
      .query()
      .delete()
      .where({
        user_id,
        experience_id: id
      });

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting work experience" });
  }
};
