const express = require("express");
const router = require("./router/index");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.listen(3000, (req, res) => {
  console.log("Listening on port 3000");
});
