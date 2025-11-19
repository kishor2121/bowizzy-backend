const db = require("../db/knex");
const { uploadImageToCloudinary, deleteImageFromCloudinary } = require("../utils/uploadImage");

// CREATE PERSONAL DETAILS
exports.create = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const data = req.body;

    data.user_id = user_id;

    if (data.languages_known && typeof data.languages_known === "string") {
      try { data.languages_known = JSON.parse(data.languages_known); } catch {}
    }

    if (req.file) {
      const url = await uploadImageToCloudinary(req.file.buffer, "profile_photos");
      data.profile_photo_url = url;
    }

    const [record] = await db("personal_details")
      .insert(data)
      .returning("*");

    return res.status(201).json(record);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating personal details" });
  }
};

// GET personal details (by user_id + personal_id)
exports.getById = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const record = await db("personal_details")
      .where({ user_id, personal_id: id })
      .first();

    if (!record) return res.status(404).json({ message: "Not found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching record" });
  }
};

// UPDATE personal details
exports.update = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const oldRecord = await db("personal_details")
      .where({ user_id, personal_id: id })
      .first();

    if (!oldRecord) {
      return res.status(404).json({ message: "Not found" });
    }

    const data = req.body;

    if (data.languages_known && typeof data.languages_known === "string") {
      try { data.languages_known = JSON.parse(data.languages_known); } catch {}
    }

    if (req.file) {
      if (oldRecord.profile_photo_url) {
        await deleteImageFromCloudinary(oldRecord.profile_photo_url);
      }

      const newUrl = await uploadImageToCloudinary(
        req.file.buffer,
        "profile_photos"
      );

      data.profile_photo_url = newUrl;
    }

    const [updated] = await db("personal_details")
      .where({ user_id, personal_id: id })
      .update({ ...data, updated_at: db.fn.now() }, "*");

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating details" });
  }
};

// GET ALL PERSONAL DETAILS
exports.getAll = async (req, res) => {
  try {
    const list = await db("personal_details").select("*");
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data" });
  }
};

// DELETE (optional)
exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const deleted = await db("personal_details")
      .where({ user_id, personal_id: id })
      .del();

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting details" });
  }
};
