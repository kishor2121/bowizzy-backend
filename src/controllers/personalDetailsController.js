const db = require("../db/knex");
const { uploadImageToCloudinary, deleteImageFromCloudinary } = require("../utils/uploadImage");

exports.create = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const data = req.body;

    data.user_id = user_id;

    if (data.languages_known && typeof data.languages_known === "string") {
      try { data.languages_known = JSON.parse(data.languages_known); } catch {}
    }

    // if (req.file) {
    //   const url = await uploadImageToCloudinary(req.file.buffer, "profile_photos");
    //   data.profile_photo_url = url;
    // }

    const [record] = await db("personal_details")
      .insert(data)
      .returning("*");

    return res.status(201).json(record);

  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({
        message: "Personal details already exist for this user. Please update instead."
      });
    }

    console.error("Error creating personal details:", err);
    return res.status(500).json({ message: "Error creating personal details" });
  }
};

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

exports.getAll = async (req, res) => {
  try {
    const list = await db("personal_details").select("*");
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data" });
  }
};

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

exports.getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const record = await db("personal_details")
      .where({ user_id })
      .first(); 

    if (!record) {
      return res.status(404).json({ message: "No personal details found" });
    }

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching personal details" });
  }
};
