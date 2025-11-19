const db = require("../db/knex");

// CREATE (supports single or multiple)
exports.create = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const data = req.body;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    if (Array.isArray(data)) {
      const payload = data.map(item => ({ ...item, user_id }));
      const records = await db("education_details")
        .insert(payload)
        .returning("*");
      return res.status(201).json(records);
    }

    data.user_id = user_id;
    const [record] = await db("education_details")
      .insert(data)
      .returning("*");

    return res.status(201).json(record);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating education_details" });
  }
};

// GET one
exports.getById = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const record = await db("education_details")
      .where({ user_id, education_id: id })
      .first();

    if (!record) return res.status(404).json({ message: "Not found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching education_details" });
  }
};

// GET all
exports.getByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const list = await db("education_details").where({ user_id });

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching list" });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const { user_id, id } = req.params;
    const data = req.body;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const [updated] = await db("education_details")
      .where({ user_id, education_id: id })
      .update({ ...data, updated_at: db.fn.now() }, "*");

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating education_details" });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const deleted = await db("education_details")
      .where({ user_id, education_id: id })
      .del();

    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting education" });
  }
};
