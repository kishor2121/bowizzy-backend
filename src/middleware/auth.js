const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (req.params.user_id && String(req.params.user_id) !== String(decoded.user_id)) {
      return res.status(403).json({ message: "Forbidden: Not your data" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
