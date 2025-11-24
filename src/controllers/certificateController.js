const db = require("../db/knex");
const { uploadFileToCloudinary, deleteFileFromCloudinary } = require("../utils/uploadFile");

exports.create = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const data = req.body;
    data.user_id = user_id;

    // if (req.file) {
    //   const url = await uploadFileToCloudinary(req.file.buffer, "certificates");
    //   data.file_url = url;
    // }

    const [record] = await db("certificates")
      .insert(data)
      .returning("*");

    res.status(201).json(record);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating certificate" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const record = await db("certificates")
      .where({ user_id, certificate_id: id })
      .first();

    if (!record) return res.status(404).json({ message: "Not found" });

    res.json(record);

  } catch {
    res.status(500).json({ message: "Error fetching certificate" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const list = await db("certificates").where({ user_id });
    res.json(list);

  } catch {
    res.status(500).json({ message: "Error fetching list" });
  }
};

exports.update = async (req, res) => {
  try {
    const { user_id, id } = req.params;
    const data = req.body;

    const oldRecord = await db("certificates")
      .where({ user_id, certificate_id: id })
      .first();

    if (!oldRecord) return res.status(404).json({ message: "Not found" });

    if (req.file) {
      if (oldRecord.file_url) {
        await deleteFileFromCloudinary(oldRecord.file_url);
      }

      const newUrl = await uploadFileToCloudinary(req.file.buffer, "certificates");
      data.file_url = newUrl;
    }

    const [updated] = await db("certificates")
      .where({ user_id, certificate_id: id })
      .update({ ...data, updated_at: db.fn.now() }, "*");

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating certificate" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const oldRecord = await db("certificates")
      .where({ user_id, certificate_id: id })
      .first();

    if (!oldRecord) return res.status(404).json({ message: "Not found" });

    if (oldRecord.file_url) {
      await deleteFileFromCloudinary(oldRecord.file_url);
    }

    await db("certificates")
      .where({ user_id, certificate_id: id })
      .del();

    res.json({ message: "Deleted successfully" });

  } catch {
    res.status(500).json({ message: "Error deleting certificate" });
  }
};
