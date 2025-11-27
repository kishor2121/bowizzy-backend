const WorkExperience = require("../models/WorkExperience");
const User = require("../models/User");
const JobRole = require("../models/JobRole"); // new model

exports.create = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { job_role, experiences } = req.body;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(experiences))
      return res.status(400).json({ message: "experiences must be an array" });

    if (job_role) {
      const existsRole = await JobRole.query().findOne({ user_id });

      if (existsRole) {
        await JobRole.query().patch({ job_role }).where({ user_id });
      } else {
        await JobRole.query().insert({ user_id, job_role });
      }
    }

    const payload = experiences.map(exp => ({
      ...exp,
      user_id
    }));

    const records = await WorkExperience.query().insert(payload);

    res.status(201).json({
      job_role,
      experiences: records
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating work experience" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    const jobRole = await JobRole.query().findOne({ user_id });

    const list = await WorkExperience.query()
      .where({ user_id })
      .orderBy("experience_id", "asc");

    res.json({
      job_role: jobRole ? jobRole.job_role : null,
      experiences: list
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching work experience" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    const record = await WorkExperience.query().findOne({
      user_id,
      experience_id: id
    });

    if (!record)
      return res.status(404).json({ message: "Not found" });

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
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    const updatedRowCount = await WorkExperience.query()
      .patch(data)
      .where({
        user_id,
        experience_id: id
      });

    if (updatedRowCount === 0)
      return res.status(404).json({ message: "Not found" });

    const updated = await WorkExperience.query().findOne({
      user_id,
      experience_id: id
    });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating work experience" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    const deleted = await WorkExperience.query()
      .delete()
      .where({
        user_id,
        experience_id: id
      });

    if (!deleted)
      return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting work experience" });
  }
};

exports.updateJobRole = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { job_role } = req.body;

    if (!job_role) {
      return res.status(400).json({ message: "job_role is required" });
    }

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    const existsRole = await JobRole.query().findOne({ user_id });

    if (existsRole) {
      await JobRole.query().patch({ job_role }).where({ user_id });
    } else {
      await JobRole.query().insert({ user_id, job_role });
    }

    return res.json({
      message: "Job role updated",
      job_role
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating job role" });
  }
};

