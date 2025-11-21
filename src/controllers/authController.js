const db = require("../db/knex");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../firebase");

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { email, password, user_type } = req.body;

    const exists = await db("users").where({ email }).first();
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const password_hash = await bcrypt.hash(password, 10);

    const [user] = await db("users")
      .insert({
        email,
        password_hash,
        user_type,
      })
      .returning("*");

    res.status(201).json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db("users").where({ email }).first();
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_type: user.user_type,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      user_id: user.user_id,
      email: user.email,
      token: token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "idToken required" });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);

    const email = decoded.email;

    let user = await db("users").where({ email }).first();

    if (!user) {
      const [newUser] = await db("users")
        .insert({
          email,
          password_hash: "",
          user_type: "regular",
        })
        .returning("*");

      user = newUser;
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_type: user.user_type,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({
      message: "Google login successful",
      user_id: user.user_id,
      email: user.email,
      token
    });

  } catch (err) {
    console.error("Google Login Error:", err);
    return res.status(500).json({ message: "Google login failed" });
  }
};
