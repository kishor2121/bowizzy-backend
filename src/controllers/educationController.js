const Education = require("../models/Education");

exports.create = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const data = req.body;

    if (Array.isArray(data)) {
      const payload = data.map(item => ({ ...item, user_id }));
      const records = await Education.query().insert(payload);
      return res.status(201).json(records);
    }

    const record = await Education.query().insert({
      ...data,
      user_id
    });

    return res.status(201).json(record);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating education_details" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const list = await Education.query()
      .where({ user_id })
      .orderBy("education_id", "asc");

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching list" });
  }
};

exports.getById = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const record = await Education.query().findOne({
      user_id,
      education_id: id
    });

    if (!record) return res.status(404).json({ message: "Education record not found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching education_details" });
  }
};

exports.update = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;
    const data = req.body;

    const updatedCount = await Education.query()
      .patch(data)
      .where({ user_id, education_id: id });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Education record not found" });
    }

    const updated = await Education.query().findOne({
      user_id,
      education_id: id
    });

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating education_details" });
  }
};

exports.remove = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const deleted = await Education.query()
      .delete()
      .where({
        user_id,
        education_id: id
      });

    if (!deleted) {
      return res.status(404).json({ message: "Education record not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting education" });
  }
};
