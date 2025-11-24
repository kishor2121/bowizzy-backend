const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../firebase");

exports.authHandler = async (req, res) => {
  try {
    const { type } = req.body;

    if (type === "signup") {
      const { email, password, user_type } = req.body;

      const exists = await User.query().findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already exists" });

      const password_hash = await bcrypt.hash(password, 10);

      const user = await User.query().insert({
        email,
        password_hash,
        user_type: user_type || "regular",
      });

      return res.status(201).json({
        message: "Signup successful",
        user_id: user.user_id,
        email: user.email
      });
    }

    if (type === "login") {
      const { email, password } = req.body;

      const user = await User.query().findOne({ email });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { user_id: user.user_id, user_type: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return res.json({
        message: "Login successful",
        user_id: user.user_id,
        email: user.email,
        token
      });
    }

    if (type === "google") {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ message: "idToken required" });
      }

      const decoded = await admin.auth().verifyIdToken(idToken);
      const email = decoded.email;

      let user = await User.query().findOne({ email });

      if (!user) {
        user = await User.query().insert({
          email,
          password_hash: "",
          user_type: "regular",
        });
      }

      const token = jwt.sign(
        { user_id: user.user_id, user_type: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return res.json({
        message: "Google login successful",
        user_id: user.user_id,
        email: user.email,
        token
      });
    }

    return res.status(400).json({
      message: "Invalid type. Must be one of: signup | login | google",
    });

  } catch (err) {
    console.error("Auth Error:", err);
    res.status(500).json({ message: "Authentication failed" });
  }
};
