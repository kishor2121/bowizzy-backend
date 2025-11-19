const db = require("../db/knex");

exports.create = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { skills } = req.body;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(skills))
      return res.status(400).json({ message: "skills must be an array" });

    const rows = skills.map((s) => ({
      ...s,
      user_id,
    }));

    const inserted = await db("skills").insert(rows).returning("*");

    res.status(201).json(inserted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating skills" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const list = await db("skills")
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

    const record = await db("skills")
      .where({ user_id, skill_id })
      .first();

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

    const [updated] = await db("skills")
      .where({ user_id, skill_id })
      .update({ ...data, updated_at: db.fn.now() }, "*");

    if (!updated)
      return res.status(404).json({ message: "Not found" });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating skill" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, skill_id } = req.params;

    const deleted = await db("skills")
      .where({ user_id, skill_id })
      .del();

    if (!deleted)
      return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting skill" });
  }
};
