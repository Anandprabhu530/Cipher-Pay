const z = require("zod");
const express = require("express");
const { Account, User } = require("../db");
const { authMiddleware } = require("../middleware");

const router = express.Router();

//transfer zod schema
const Transferschema = z.object({
  transferto: z.string(),
  amount: z.number(),
});

//User balance
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

//User transfer
router.post("/transfer", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { success } = Transferschema.safeParse(req.body);
  if (!success) {
    return res
      .status(411)
      .json({ Message: "No sufficient objects to process" });
  }
  const check_balance = await Account.findOne({ userId: userId });
  if (check_balance.balance < req.body.amount) {
    return res.status(400).json({ Message: "Insufficient balance" });
  } else {
    const updatebalance = await Account.updateOne(
      { userId: userId },
      { balance: check_balance.balance - req.body.amount }
    );
    if (updatebalance) {
      const receiver = await User.findOne({ username: req.body.transferto });
      if (!receiver._id) {
        return res.status(400).json({ Message: "Invalid Account" });
      }
      const update_receiver = await Account.findOne({ userId: receiver._id });
      const update_receiver_balance = await Account.updateOne(
        { userId: receiver._id },
        { balance: update_receiver.balance + req.body.amount }
      );
      if (update_receiver_balance) {
        return res.status(200).json({ Message: "Transfer successful" });
      }
    } else {
      return res
        .status(500)
        .json({ Message: "Internal Error! Please try later." });
    }
  }
});

module.exports = router;
