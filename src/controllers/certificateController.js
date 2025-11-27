const Certificate = require("../models/Certificate");

exports.create = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { certificates } = req.body;

    if (Array.isArray(certificates)) {
      const rows = certificates.map(c => ({
        ...c,
        user_id
      }));

      const inserted = await Certificate.query().insert(rows);
      return res.status(201).json(inserted);
    }

    const record = await Certificate.query().insert({
      ...req.body,
      user_id
    });

    return res.status(201).json(record);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating certificate" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const list = await Certificate.query().where({ user_id });

    return res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching certificates" });
  }
};

exports.getById = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const record = await Certificate.query().findOne({
      user_id,
      certificate_id: id
    });

    if (!record) {
      return res.status(404).json({ message: "Certificate record not found" });
    }

    return res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching certificate" });
  }
};

exports.update = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const exists = await Certificate.query().findOne({
      user_id,
      certificate_id: id
    });

    if (!exists) {
      return res.status(404).json({ message: "Certificate record not found" });
    }

    await Certificate.query()
      .patch(req.body)
      .where({ user_id, certificate_id: id });

    const updated = await Certificate.query().findOne({
      user_id,
      certificate_id: id
    });

    return res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating certificate" });
  }
};

exports.remove = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const deleted = await Certificate.query()
      .delete()
      .where({ user_id, certificate_id: id });

    if (!deleted) {
      return res.status(404).json({ message: "Certificate record not found" });
    }

    return res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting certificate" });
  }
};
