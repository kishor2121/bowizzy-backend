const Project = require("../models/Project");
const db = require("../db/knex");

exports.create = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { projects } = req.body;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(projects)) {
      return res.status(400).json({ message: "projects must be an array" });
    }

    const rows = projects.map(p => ({ ...p, user_id }));

    const inserted = await Project.query().insert(rows);

    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ message: "Error creating projects" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const list = await Project
      .query()
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

    const record = await Project
      .query()
      .findOne({ user_id, project_id: id });

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

    const record = await Project.query()
      .where({ user_id, project_id: id })
      .first();

    if (!record) {
      return res.status(404).json({ message: "Project record not found for this user" });
    }

    const updated = await Project.query()
      .patchAndFetchById(id, { ...data, updated_at: db.fn.now() });

    return res.status(200).json(updated);

  } catch (err) {
    console.error("Error updating project:", err);
    return res.status(500).json({ message: "Error updating project" });
  }
};


exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Project
      .query()
      .deleteById(id);

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting project" });
  }
};
