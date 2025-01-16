const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

// Generate a JWT for a user
exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Manually verify a JWT (used in custom logic)
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Middleware to verify tokens in protected routes
exports.verifyTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user info to req.user for use in route handlers
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error });
  }
};
