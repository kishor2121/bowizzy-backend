const WorkExperience = require("../models/WorkExperience");
const db = require("../db/knex");

exports.create = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { job_role, experiences } = req.body;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(experiences)) {
      return res.status(400).json({ message: "experiences must be an array" });
    }

    const rows = experiences.map((exp) => ({
      ...exp,
      user_id,
      job_role: job_role  
    }));

    const inserted = await WorkExperience
      .query()
      .insert(rows)
      .returning("*");

    res.status(201).json(inserted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating work experience" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;

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

    const record = await WorkExperience
      .query()
      .where({ user_id, experience_id: id })
      .first();

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

    const record = await WorkExperience.query()
      .where({ user_id, experience_id: id })
      .first();

    if (!record) {
      return res.status(404).json({ message: "Work experience record not found for this user" });
    }

    const updated = await WorkExperience.query()
      .patchAndFetchById(id, { ...data, updated_at: db.fn.now() });

    return res.status(200).json(updated);

  } catch (err) {
    return res.status(500).json({ message: "Error updating work experience" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const deleted = await WorkExperience
      .query()
      .where({ user_id, experience_id: id })
      .del();

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting work experience" });
  }
};
