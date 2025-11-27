const Project = require("../models/Project");

exports.create = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { projects } = req.body;

    if (!Array.isArray(projects)) {
      return res.status(400).json({ message: "projects must be an array" });
    }

    const rows = projects.map(p => ({ ...p, user_id }));
    const inserted = await Project.query().insert(rows);

    return res.status(201).json(inserted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating projects" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const list = await Project.query()
      .where({ user_id })
      .orderBy("project_id", "asc");

    return res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

exports.getById = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const record = await Project.query()
      .findOne({ user_id, project_id: id });

    if (!record) {
      return res.status(404).json({ message: "Project record not found" });
    }

    return res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching project" });
  }
};

exports.update = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;
    const data = req.body;

    const updatedCount = await Project.query()
      .patch(data)
      .where({ user_id, project_id: id });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Project record not found" });
    }

    const updated = await Project.query()
      .findOne({ user_id, project_id: id });

    return res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating project" });
  }
};

exports.remove = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const deleted = await Project.query()
      .delete()
      .where({ user_id, project_id: id });

    if (!deleted) {
      return res.status(404).json({ message: "Project record not found" });
    }

    return res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting project" });
  }
};