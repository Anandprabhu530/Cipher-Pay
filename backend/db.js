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

const User = mongoose.model("user_model", Userschema);

module.exports = { User };
