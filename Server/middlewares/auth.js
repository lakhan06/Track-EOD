const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      req.user = decoded;

      // Check role
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: `${decoded.role} dont have access to do this task` });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = auth;
