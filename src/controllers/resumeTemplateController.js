const ResumeTemplate = require("../models/ResumeTemplate");
const db = require("../db/knex");
const { uploadFileToCloudinary, deleteFileFromCloudinary } = require("../utils/uploadFile");

exports.create = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const data = req.body;
    data.user_id = user_id;

    if (req.files && req.files.thumbnail) {
      const url = await uploadFileToCloudinary(req.files.thumbnail[0].buffer, "resume_templates");
      data.thumbnail_url = url;
    }

    if (req.files && req.files.template_file) {
      const fileUrl = await uploadFileToCloudinary(req.files.template_file[0].buffer, "resume_templates");
      data.template_file_url = fileUrl;
    }

    const record = await ResumeTemplate
      .query()
      .insert(data)
      .returning("*");

    res.status(201).json(record);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating template" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const list = await ResumeTemplate.query()
      .where({ user_id: req.params.user_id });

    res.json(list);

  } catch {
    res.status(500).json({ message: "Error fetching templates" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const record = await ResumeTemplate.query()
      .where({ user_id, resume_template_id: id })
      .first();

    if (!record) return res.status(404).json({ message: "Not found" });

    res.json(record);

  } catch {
    res.status(500).json({ message: "Error fetching template" });
  }
};

exports.update = async (req, res) => {
  try {
    const { user_id, id } = req.params;
    const data = { ...req.body };

    const record = await ResumeTemplate.query()
      .where({ user_id, resume_template_id: id })
      .first();

    if (!record) {
      return res.status(404).json({ message: "Resume template not found for this user" });
    }

    if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
      if (record.thumbnail_url) {
        await deleteFileFromCloudinary(record.thumbnail_url);
      }

      const newThumb = await uploadFileToCloudinary(
        req.files.thumbnail[0].buffer,
        "resume_templates"
      );

      data.thumbnail_url = newThumb;
    }

    if (req.files && req.files.template_file && req.files.template_file.length > 0) {
      if (record.template_file_url) {
        await deleteFileFromCloudinary(record.template_file_url);
      }

      const fileUrl = await uploadFileToCloudinary(
        req.files.template_file[0].buffer,
        "resume_templates"
      );

      data.template_file_url = fileUrl;
    }

    const updated = await ResumeTemplate.query()
      .patchAndFetchById(id, { ...data, updated_at: db.fn.now() });

    return res.status(200).json(updated);

  } catch (err) {
    console.error("Error updating resume template:", err);
    return res.status(500).json({ message: "Error updating template" });
  }
};


exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const oldRecord = await ResumeTemplate.query()
      .where({ user_id, resume_template_id: id })
      .first();

    if (!oldRecord) return res.status(404).json({ message: "Not found" });

    if (oldRecord.thumbnail_url) {
      await deleteFileFromCloudinary(oldRecord.thumbnail_url);
    }

    if (oldRecord.template_file_url) {
      await deleteFileFromCloudinary(oldRecord.template_file_url);
    }

    await ResumeTemplate.query().where({ user_id, resume_template_id: id }).del();

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting template" });
  }
};
