const Project = require("../models/Project");
const User = require("../models/User");

exports.create = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { projects } = req.body;

    const userExists = await User.query().findById(user_id);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(projects)) {
      return res.status(400).json({ message: "projects must be an array" });
    }

    const rows = projects.map(p => ({ ...p, user_id }));

    const inserted = await Project.query().insert(rows);

    res.status(201).json(inserted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating projects" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists) return res.status(404).json({ message: "User not found" });

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

    const userExists = await User.query().findById(user_id);
    if (!userExists) return res.status(404).json({ message: "User not found" });

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

    const userExists = await User.query().findById(user_id);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const updatedRowCount = await Project
      .query()
      .patch(data)
      .where({
        user_id,
        project_id: id
      });

    if (updatedRowCount === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const updated = await Project
      .query()
      .findOne({ user_id, project_id: id });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating project" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const deleted = await Project
      .query()
      .delete()
      .where({
        user_id,
        project_id: id
      });

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting project" });
  }
};
