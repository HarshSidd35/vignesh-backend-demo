const jwt = require("jsonwebtoken");

// Middleware to check if the user is authenticated
exports.isUser = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });
    const key = token.split(" ")

    const verified = jwt.verify(key[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};