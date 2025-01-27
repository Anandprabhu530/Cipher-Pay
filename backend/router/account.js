const z = require("zod");
const express = require("express");
const { Account, User } = require("../db");
const { authMiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");

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
  const session = await mongoose.startSession();
  session.startTransaction();
  const check_balance = await Account.findOne({ userId: userId }).session(
    session
  );
  if (check_balance.balance < req.body.amount) {
    await session.abortTransaction();
    return res.status(400).json({ Message: "Insufficient balance" });
  } else {
    await Account.updateOne(
      { userId: userId },
      { $inc: { balance: -req.body.amount } }
    ).session(session);
    await Account.updateOne(
      { userId: req.body.transferto },
      { $inc: { balance: req.body.amount } }
    ).session(session);
    await session.commitTransaction();
    return res.status(200).json({ Message: "Transfer successful" });
  }
});

module.exports = router;
