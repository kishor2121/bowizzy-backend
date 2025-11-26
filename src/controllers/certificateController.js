const Certificate = require("../models/Certificate");
const User = require("../models/User");

exports.create = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { certificates } = req.body;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    if (Array.isArray(certificates)) {
      const rows = certificates.map((c) => ({
        ...c,
        user_id,
      }));

      const inserted = await Certificate.query().insert(rows);
      return res.status(201).json(inserted);
    }

    const data = req.body;
    data.user_id = user_id;

    const record = await Certificate.query().insert(data);

    res.status(201).json(record);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating certificate" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const list = await Certificate.query().where({ user_id });

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching certificates" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const record = await Certificate.query()
      .findOne({ user_id, certificate_id: id });

    if (!record)
      return res.status(404).json({ message: "Not found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching certificate" });
  }
};

exports.update = async (req, res) => {
  try {
    const { user_id, id } = req.params;
    const data = req.body;

    const exists = await Certificate.query()
      .findOne({ user_id, certificate_id: id });

    if (!exists)
      return res.status(404).json({ message: "Not found" });

    await Certificate.query()
      .patch(data)
      .where({ user_id, certificate_id: id });

    const updated = await Certificate.query()
      .findOne({ user_id, certificate_id: id });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating certificate" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const exists = await Certificate.query()
      .findOne({ user_id, certificate_id: id });

    if (!exists)
      return res.status(404).json({ message: "Not found" });

    await Certificate.query()
      .delete()
      .where({ user_id, certificate_id: id });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting certificate" });
  }
};
