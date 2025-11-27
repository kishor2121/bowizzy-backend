const Link = require("../models/Link");

exports.create = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { links } = req.body;

    if (!Array.isArray(links)) {
      return res.status(400).json({ message: "links must be an array" });
    }

    const rows = links.map(l => ({
      ...l,
      user_id
    }));

    const inserted = await Link.query().insert(rows);

    return res.status(201).json(inserted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating links" });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const list = await Link.query()
      .where({ user_id })
      .orderBy("link_id", "asc");

    return res.json(list);

  } catch (err) {
    res.status(500).json({ message: "Error fetching links" });
  }
};

exports.getById = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { link_id } = req.params;

    const record = await Link.query().findOne({
      user_id,
      link_id
    });

    if (!record) {
      return res.status(404).json({ message: "link record not found" });
    }

    return res.json(record);

  } catch (err) {
    res.status(500).json({ message: "Error fetching link" });
  }
};

exports.update = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { link_id } = req.params;
    const data = req.body;

    const updatedCount = await Link.query()
      .patch(data)
      .where({ user_id, link_id });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "link record not found" });
    }

    const updated = await Link.query().findOne({
      user_id,
      link_id
    });

    return res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Error updating link" });
  }
};

exports.remove = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { link_id } = req.params;

    const deleted = await Link.query()
      .delete()
      .where({ user_id, link_id });

    if (!deleted) {
      return res.status(404).json({ message: "link record not found" });
    }

    return res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting link" });
  }
};
