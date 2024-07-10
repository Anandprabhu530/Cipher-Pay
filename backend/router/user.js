const express = require("express");
const z = require("zod");
const router = express.Router();
const { User } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");

const Registeruser = z.object({
  username: z.string().email(),
  password: z.string(),
  fullname: z.string(),
});

const login_user = z.object({
  username: z.string().email(),
  password: z.string(),
});

const update_user = z.object({
  password: z.string(),
  fullname: z.string(),
});
//Register New user
router.post("/new-user", async (req, res) => {
  const parsed_data = Registeruser.safeParse(req.body);
  if (parsed_data.success) {
    const already_exists = await User.findOne({ username: req.body.username });
    if (already_exists) {
      return res
        .status(411)
        .json({ message: "Email already taken/Incorrect inputs" });
    }

    bcrypt.hash(req.body.password, 2, async function (err, hash) {
      if (err) {
        return res
          .status(500)
          .json({ message: "Internal Error! Please try again later" });
      } else {
        const inserted_data = await User.create({
          username: req.body.username,
          password: hash,
          fullname: req.body.fullname,
        });

        if (inserted_data) {
          const userId = inserted_data._id;
          const token = jwt.sign({ userId }, process.env.JWT_SECRET);
          return res.status(200).json({
            message: "User created successfully",
            token: token,
          });
        }
      }
    });
  } else {
    return res
      .status(411)
      .json({ message: "Email already taken / Incorrect inputs" });
  }
});

//Login user
router.post("/login", authMiddleware, async (req, res) => {
  const parsed_data = login_user.safeParse(req.body);
  if (parsed_data) {
    const userdata = await User.findOne({ username: req.body.username });
    bcrypt.compare(
      req.body.password,
      userdata.password,
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(411).json({ message: "Error while logging in" });
        }
        if (result) {
          const userId = userdata._id;
          const token = jwt.sign({ userId }, process.env.JWT_SECRET);
          return res.status(200).json({
            message: "Login Successfull",
            token: token,
          });
        } else {
          return res
            .status(403)
            .json({ message: "Invalid password! Login correct password" });
        }
      }
    );
  } else {
    return res.status(411).json({ message: "Incorrect inputs" });
  }
});

//Update user
router.put("/", authMiddleware, async (req, res) => {
  const { success } = update_user.safeParse(req.body);
  if (success) {
    const user = req.userId;
    const updater = await User.updateOne(
      { _id: user },
      { fullname: req.body.fullname }
    );
    if (updater.modifiedCount > 0) {
      return res.status(200).json({ Message: "Update Success" });
    } else {
      return res
        .status(500)
        .json({ Message: "Internal Error! Please try again later" });
    }
  } else {
    return res
      .status(411)
      .json({ message: "Error while updating information/Check Inputs" });
  }
});

//Request for usernames
router.get("/bulk", async (req, res) => {
  if (req.query.filter) {
    const all_user = await User.find({
      fullname: { $regex: req.query.filter + ".*" },
    });

    return res.status(200).json({
      users: all_user.map((data) => ({
        fullname: data.fullname,
        id: data._id,
      })),
    });
  } else {
    return res.status(411).json({ Messgae: "Please provide a filter" });
  }
});

module.exports = router;
