const db = require("../db/knex");

// CREATE WORK EXPERIENCE (Bulk insert)
exports.create = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { job_role, experiences } = req.body;

    // Check user exists
    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(experiences)) {
      return res.status(400).json({ message: "experiences must be an array" });
    }

    // Insert all experiences (job_role in EVERY ROW)
    const rows = experiences.map((exp) => ({
      ...exp,
      user_id,
      job_role: job_role   // store job role in every experience
    }));

    const inserted = await db("work_experience")
      .insert(rows)
      .returning("*");

    res.status(201).json(inserted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating work experience" });
  }
};

// GET ALL for USER
exports.getByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const list = await db("work_experience")
      .where({ user_id })
      .orderBy("experience_id", "asc");

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching work experience" });
  }
};

// GET ONE
exports.getById = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const record = await db("work_experience")
      .where({ user_id, experience_id: id })
      .first();

    if (!record) return res.status(404).json({ message: "Not found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching work experience" });
  }
};

// UPDATE ONE EXPERIENCE
exports.update = async (req, res) => {
  try {
    const { user_id, id } = req.params;
    const data = req.body;

    const [updated] = await db("work_experience")
      .where({ user_id, experience_id: id })
      .update({ ...data, updated_at: db.fn.now() }, "*");

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating work experience" });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const deleted = await db("work_experience")
      .where({ user_id, experience_id: id })
      .del();

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting work experience" });
  }
};
