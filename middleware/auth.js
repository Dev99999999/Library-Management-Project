const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; 
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.user = decoded;
    // console.log(req.user) 
    next();
  });
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }

    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
