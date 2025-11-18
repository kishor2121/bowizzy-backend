const db = require("../db/knex");

//  CREATE Personal Details
exports.create = async (req, res) => {
  try {
    const data = req.body;

    const [record] = await db("personal_details")
      .insert(data)
      .returning("*");

    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating personal details" });
  }
};

// GET ALL personal details
exports.getAll = async (req, res) => {
  try {
    const list = await db("personal_details").select("*");
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data" });
  }
};

//  GET one by ID
exports.getById = async (req, res) => {
  try {
    const record = await db("personal_details")
      .where({ personal_id: req.params.id })
      .first();

    if (!record) return res.status(404).json({ message: "Not found" });

    res.json(record);
  } catch {
    res.status(500).json({ message: "Error fetching record" });
  }
};

//  UPDATE
exports.update = async (req, res) => {
  try {
    const [updated] = await db("personal_details")
      .where({ personal_id: req.params.id })
      .update({ ...req.body, updated_at: db.fn.now() }, "*");

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Error updating data" });
  }
};

//  DELETE
exports.remove = async (req, res) => {
  try {
    const deleted = await db("personal_details")
      .where({ personal_id: req.params.id })
      .del();

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Error deleting data" });
  }
};
