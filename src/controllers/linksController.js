const db = require("../db/knex");

exports.create = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { links } = req.body;

    const userExists = await db("users").where({ user_id }).first();
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(links))
      return res.status(400).json({ message: "links must be an array" });

    const rows = links.map((l) => ({
      ...l,
      user_id,
    }));

    const inserted = await db("links").insert(rows).returning("*");

    res.status(201).json(inserted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating links" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const list = await db("links")
      .where({ user_id })
      .orderBy("link_id", "asc");

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching links" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { user_id, link_id } = req.params;

    const record = await db("links")
      .where({ user_id, link_id })
      .first();

    if (!record)
      return res.status(404).json({ message: "Not found" });

    res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching link" });
  }
};

exports.update = async (req, res) => {
  try {
    const { user_id, link_id } = req.params;
    const data = req.body;

    const [updated] = await db("links")
      .where({ user_id, link_id })
      .update({ ...data, updated_at: db.fn.now() }, "*");

    if (!updated)
      return res.status(404).json({ message: "Not found" });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating link" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { user_id, link_id } = req.params;

    const deleted = await db("links")
      .where({ user_id, link_id })
      .del();

    if (!deleted)
      return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting link" });
  }
};
