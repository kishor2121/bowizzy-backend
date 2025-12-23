const User = require("../models/User");

exports.getUserById = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.query().findById(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};
