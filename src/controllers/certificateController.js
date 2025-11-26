const Certificate = require("../models/Certificate");
const db = require("../db/knex");
const { uploadFileToCloudinary, deleteFileFromCloudinary } = require("../utils/uploadFile");

exports.create = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { certificates } = req.body;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!Array.isArray(certificates)) {
      return res.status(400).json({ message: "certificates must be an array" });
    }

    const rows = certificates.map(certificate => ({
      ...certificate,
      user_id,
    }));

    // Cloudinary upload (commented out)
    /*
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        const url = await uploadFileToCloudinary(req.files[i].buffer, "certificates");
        rows[i].file_url = url;
      }
    }
    */

    const records = await Certificate
      .query()
      .insert(rows)
      .returning("*");

    return res.status(201).json(records);

  } catch (err) {
    return res.status(500).json({ message: "Error creating certificates" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const list = await Certificate.query().where({ user_id });
    res.json(list);

  } catch {
    res.status(500).json({ message: "Error fetching list" });
  }
};

exports.update = async (req, res) => {
  try {
    const { user_id, id } = req.params;
    const data = req.body;

    const record = await Certificate.query()
      .where({ user_id, certificate_id: id })
      .first();

    if (!record) {
      return res.status(404).json({ message: "Certificate record not found for this user" });
    }

    if (req.file) {
      if (record.file_url) {
        await deleteFileFromCloudinary(record.file_url);
      }

      const newUrl = await uploadFileToCloudinary(req.file.buffer, "certificates");
      data.file_url = newUrl;
    }

    const updated = await Certificate.query()
      .patchAndFetchById(id, { ...data, updated_at: db.fn.now() });

    return res.status(200).json(updated);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating certificate" });
  }
};


exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const oldRecord = await Certificate.query()
      .where({ user_id, certificate_id: id })
      .first();

    if (!oldRecord) return res.status(404).json({ message: "Not found" });

    // if (oldRecord.file_url) {
    //   await deleteFileFromCloudinary(oldRecord.file_url);
    // }

    await Certificate.query()
      .where({ user_id, certificate_id: id })
      .del();

    res.json({ message: "Deleted successfully" });

  } catch {
    res.status(500).json({ message: "Error deleting certificate" });
  }
};
