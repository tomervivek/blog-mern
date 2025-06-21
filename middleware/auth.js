const jwt = require("jsonwebtoken");
const JWT_SECRET = "ask8F!sdf8@#sdf9sdf8sdf7sdf"; // Replace with your actual secret key

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { email, UserId }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalid or expired" });
  }
}

module.exports = authenticateToken;
