const ResumeTemplate = require("../models/ResumeTemplate");
const User = require("../models/User");

exports.create = async (req, res) => {
  try {
    const { user_id } = req.params;
    const data = req.body;

    const userExists = await User.query().findById(user_id);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    if (Array.isArray(data.templates)) {
      const payload = data.templates.map(item => ({
        ...item,
        user_id
      }));

      const inserted = await ResumeTemplate.query().insert(payload);
      return res.status(201).json(inserted);
    }

    data.user_id = user_id;

    const record = await ResumeTemplate.query().insert(data);

    return res.status(201).json(record);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating template(s)" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const list = await ResumeTemplate.query()
      .where({ user_id });

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching templates" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const record = await ResumeTemplate.query()
      .findOne({ user_id, resume_template_id: id });

    if (!record)
      return res.status(404).json({ message: "Not found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching template" });
  }
};

exports.update = async (req, res) => {
  try {
    const { user_id, id } = req.params;
    const data = req.body;

    const exists = await ResumeTemplate.query()
      .findOne({ user_id, resume_template_id: id });

    if (!exists)
      return res.status(404).json({ message: "Not found" });

    await ResumeTemplate.query()
      .update(data)
      .where({ user_id, resume_template_id: id });

    const updated = await ResumeTemplate.query()
      .findOne({ user_id, resume_template_id: id });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating template" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const exists = await ResumeTemplate.query()
      .findOne({ user_id, resume_template_id: id });

    if (!exists)
      return res.status(404).json({ message: "Not found" });

    await ResumeTemplate.query()
      .delete()
      .where({ user_id, resume_template_id: id });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting template" });
  }
};
