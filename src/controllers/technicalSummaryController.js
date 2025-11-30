const TechnicalSummary = require("../models/TechnicalSummary");

exports.create = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const exists = await TechnicalSummary.query().findOne({ user_id });
    if (exists) {
      return res.status(400).json({
        message: "Technical summary already exists. Please use update instead."
      });
    }

    const data = req.body;
    data.user_id = user_id;

    const record = await TechnicalSummary.query().insert(data);

    res.status(201).json(record);

  } catch (err) {
    console.error("Error creating technical summary:", err);
    res.status(500).json({ message: "Error creating technical summary" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const record = await TechnicalSummary.query().findOne({ user_id });

    if (!record) {
      return res.status(404).json({ message: "No technical summary found" });
    }

    res.json(record);

  } catch (err) {
    console.error("Error fetching summary:", err);
    res.status(500).json({ message: "Error fetching technical summary" });
  }
};

exports.getById = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const record = await TechnicalSummary.query()
      .findOne({ user_id, summary_id: id });

    if (!record) {
      return res.status(404).json({ message: "Technical summary not found" });
    }

    res.json(record);

  } catch (err) {
    console.error("Error fetching record:", err);
    res.status(500).json({ message: "Error fetching technical summary" });
  }
};

exports.update = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;
    const data = req.body;

    const updated = await TechnicalSummary.query()
      .patchAndFetchById(id, data)
      .where({ user_id });

    if (!updated) {
      return res.status(404).json({ message: "No technical summary found" });
    }

    res.json(updated);

  } catch (err) {
    console.error("Error updating summary:", err);
    res.status(500).json({ message: "Error updating technical summary" });
  }
};

exports.remove = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const deleted = await TechnicalSummary.query()
      .delete()
      .where({ user_id, summary_id: id });

    if (!deleted) {
      return res.status(404).json({ message: "No technical summary found" });
    }

    res.json({ message: "Technical summary deleted successfully" });

  } catch (err) {
    console.error("Error deleting:", err);
    res.status(500).json({ message: "Error deleting technical summary" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const list = await TechnicalSummary.query().where({ user_id });

    if (list.length === 0) {
      return res.status(404).json({ message: "No technical summary found" });
    }

    res.json(list);

  } catch (err) {
    console.error("Error fetching list:", err);
    res.status(500).json({ message: "Error fetching technical summary list" });
  }
};
