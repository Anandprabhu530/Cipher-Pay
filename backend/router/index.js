const express = require("express");
const userRouter = require("./user");
const Accoutrouter = require("./account");

const router = express.Router();

router.use("/user", userRouter);
router.use("/account", Accoutrouter);

module.exports = router;
