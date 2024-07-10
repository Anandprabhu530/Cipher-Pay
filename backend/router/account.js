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
  const receiver = await User.findOne({
    username: req.body.transferto,
  }).session(session);
  if (!receiver) {
    await session.abortTransaction();
    return res.status(400).json({ Message: "Invalid Account" });
  }
  const check_balance = await Account.findOne({ userId: userId }).session(
    session
  );
  if (check_balance.balance < req.body.amount) {
    await session.abortTransaction();
    return res.status(400).json({ Message: "Insufficient balance" });
  } else {
    const update_receiver = await Account.findOne({
      userId: receiver._id,
    }).session(session);
    await Account.updateOne(
      { userId: userId },
      { balance: check_balance.balance - req.body.amount }
    ).session(session);
    await Account.updateOne(
      { userId: receiver._id },
      { balance: update_receiver.balance + req.body.amount }
    ).session(session);
    await session.commitTransaction();
    return res.status(200).json({ Message: "Transfer successful" });
  }
});

module.exports = router;
