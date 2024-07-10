const express = require("express");
const { User, Account } = require("../db");

const router = express.Router();

router.get("/balance", async (req, res) => {
  const username = req.body.username;

  const user_id = await User.findOne({ username: username });
  if (user_id) {
    const balance = await Account.findOne({ userId: user_id.id });
    return res.status(200).json({ balance: balance.balance });
  }
  return res
    .status(411)
    .json({ message: "Invalid user! Please login or register" });
});

module.exports = router;
