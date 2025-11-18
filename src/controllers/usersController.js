const db = require("../db/knex");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db("users").select(
      "user_id",
      "email",
      "user_type",
      "is_interviewer_verified",
      "created_at",
      "updated_at"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get one user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await db("users").where({ user_id: req.params.id }).first();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Error fetching user" });
  }
};

// Create user
exports.createUser = async (req, res) => {
  const { email, password_hash, user_type } = req.body;
  try {
    const [newUser] = await db("users")
      .insert({ email, password_hash, user_type })
      .returning("*");
    res.status(201).json(newUser);
  } catch {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { email, user_type, is_interviewer_verified } = req.body;
  try {
    const [updatedUser] = await db("users")
      .where({ user_id: req.params.id })
      .update(
        { email, user_type, is_interviewer_verified, updated_at: db.fn.now() },
        "*"
      );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await db("users").where({ user_id: req.params.id }).del();
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
