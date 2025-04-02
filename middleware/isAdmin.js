// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
    try {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Access Denied. Admins only." });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };