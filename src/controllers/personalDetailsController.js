const PersonalDetails = require("../models/PersonalDetails");
const User = require("../models/User");

exports.create = async (req, res) => {
  try {
    const { user_id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = await PersonalDetails.query().findOne({ user_id });

    if (exists) {
      return res.status(400).json({
        message: "Personal details already exist. Please use update instead."
      });
    }

    const data = req.body;
    data.user_id = user_id;

    if (data.languages_known && typeof data.languages_known === "string") {
      try { data.languages_known = JSON.parse(data.languages_known); } catch {}
    }

    const record = await PersonalDetails.query().insert(data);

    res.status(201).json(record);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating personal details" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const userExists = await User.query().findById(user_id);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const record = await PersonalDetails.query().findOne({ user_id });

    if (!record) return res.status(404).json({ message: "No details found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching details" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const record = await PersonalDetails.query()
      .findOne({ user_id, personal_id: id });

    if (!record) return res.status(404).json({ message: "No personal details found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching record" });
  }
};

exports.update = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const data = req.body;

    if (data.languages_known && typeof data.languages_known === "string") {
      try { data.languages_known = JSON.parse(data.languages_known); } catch {}
    }

    const updated = await PersonalDetails.query()
      .patchAndFetchById(id, data)  
      .where({ user_id });

    if (!updated) {
      return res.status(404).json({ message: "No personal details found" });
    }

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating details" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const userExists = await User.query().findById(user_id);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const deleted = await PersonalDetails.query()
      .delete()
      .where({ user_id, personal_id: id });

    if (!deleted) return res.status(404).json({ message: "No personal details found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting data" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const user_id = req.user.user_id; 

    const list = await PersonalDetails.query()
      .where({ user_id });

    if (list.length === 0) {
      return res.status(404).json({ message: "No personal details found" });
    }

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching data" });
  }
};

