const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protects routes by requiring a valid JWT in the Authorization header:
 *   Authorization: Bearer <token>
 */
async function protect(req, res, next) {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Not authorized. User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Not authorized. Invalid or expired token." });
  }
}

/**
 * Restricts a route to admin users only. Use after `protect`.
 */
function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ success: false, message: "Admin access required." });
}

module.exports = { protect, adminOnly };
