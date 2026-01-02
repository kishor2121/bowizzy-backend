const User = require("../models/User");
const PersonalDetails = require("../models/PersonalDetails");
const UserSubscription = require("../models/UserSubscription"); // ⬅ ADD THIS
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../firebase");

exports.authHandler = async (req, res) => {
  try {
    const { type } = req.body;

    if (type === "signup") {
      const {
        email,
        password,
        user_type,
        first_name,
        middle_name,
        last_name,
        phone_number,
        gender,
        date_of_birth,
        linkedin_url
      } = req.body;

      const requiredFields = ["email", "password", "first_name", "last_name", "phone_number"];
      let missing = [];

      requiredFields.forEach((field) => {
        if (!req.body[field]) missing.push(field);
      });

      if (missing.length > 0) {
        return res.status(400).json({
          message: "Missing required fields",
          missing
        });
      }

      const exists = await User.query().findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already exists" });

      const existsPhone = await User.query().findOne({ phone_number });
      if (existsPhone)
        return res.status(400).json({ message: "Phone number already exists" });

      const password_hash = await bcrypt.hash(password, 10);

      const user = await User.query().insert({
        email,
        password_hash,
        user_type: user_type || "regular",
        first_name,
        last_name,
        phone_number,
        gender
      });

      await PersonalDetails.query().insert({
        user_id: user.user_id,
        first_name,
        last_name,
        middle_name,
        email,
        mobile_number: phone_number,
        gender: gender || "",
        date_of_birth: date_of_birth || null,
         linkedin_url: linkedin_url || null 
      });

      await UserSubscription.query().insert({
        user_id: user.user_id,
        plan_type: "free",
        start_date: new Date(),
        end_date: null,             
        status: "active"
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

      await User.query().patch({ current_token: token }).where({ user_id: user.user_id });

      return res.json({
        message: "Login successful",
        user_id: user.user_id,
        email: user.email,
        user_type: user.user_type,
        token
      });
    }

    if (type === "google") {
      const { idToken } = req.body;
      if (!idToken)
        return res.status(400).json({ message: "idToken required" });

      const decoded = await admin.auth().verifyIdToken(idToken);
      const email = decoded.email;

      let user = await User.query().findOne({ email });

      if (!user) {
        user = await User.query().insert({
          email,
          password_hash: "",
          user_type: "regular"
        });

        await PersonalDetails.query().insert({
          user_id: user.user_id,
          email
        });

        await UserSubscription.query().insert({
          user_id: user.user_id,
          plan_type: "free",
          start_date: new Date(),
          end_date: null,
          status: "active"
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
      message: "Invalid type. Must be one of: signup | login | google"
    });
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(500).json({ message: "Authentication failed" });
  }
};
