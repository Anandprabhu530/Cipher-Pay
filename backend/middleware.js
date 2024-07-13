const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.json({ Message: "Invalid auth token" });
  }
  try {
    const verfication = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.userId = verfication.userId;
    next();
  } catch (error) {
    return res.json({ Message: "Invalid auth token" });
  }
};

module.exports = { authMiddleware };
