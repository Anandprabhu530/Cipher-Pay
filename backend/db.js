const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => await mongoose.connect(process.env.MONGO_DB_URL);
connect();

const Userschema = mongoose.Schema({
  username: {
    trim: true,
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    trim: true,
  },
});

const Accountschema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    trim: true,
  },
});

const User = mongoose.model("user_model", Userschema);
const Account = mongoose.model("account_model", Accountschema);

module.exports = { User, Account };
