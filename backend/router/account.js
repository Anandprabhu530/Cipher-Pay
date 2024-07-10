const express = require("express");
const { User, Account } = require("../db");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const balance = await Account.findOne({ userId: req.userId });
  if (balance) {
    return res.status(200).json({ balance: balance.balance });
  } else {
    return res
      .status(411)
      .json({ message: "Invalid user! Please login or register" });
  }
});

module.exports = router;
