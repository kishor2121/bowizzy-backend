const db = require("../db/knex");

exports.create = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { projects } = req.body;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(projects)) {
      return res.status(400).json({ message: "projects must be an array" });
    }

    const rows = projects.map((p) => ({
      ...p,
      user_id,
    }));

    const inserted = await db("projects")
      .insert(rows)
      .returning("*");

    res.status(201).json(inserted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating projects" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const list = await db("projects")
      .where({ user_id })
      .orderBy("project_id", "asc");

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const record = await db("projects")
      .where({ user_id, project_id: id })
      .first();

    if (!record) return res.status(404).json({ message: "Not found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching project" });
  }
};

exports.update = async (req, res) => {
  try {
    const { user_id, id } = req.params;
    const data = req.body;

    const [updated] = await db("projects")
      .where({ user_id, project_id: id })
      .update({ ...data, updated_at: db.fn.now() }, "*");

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating project" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const deleted = await db("projects")
      .where({ user_id, project_id: id })
      .del();

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting project" });
  }
};
