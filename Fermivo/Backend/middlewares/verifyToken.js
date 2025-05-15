const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;  // va avea { id, email, role }
      next();
    } catch (err) {
      return res.status(403).json({ message: "Token invalid" });
    }
  } else {
    return res.status(401).json({ message: "Token lipsă" });
  }
};

module.exports = verifyToken;
