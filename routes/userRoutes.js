const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/login", (req, res) => {
  res.send("IT WORKS");
});

router.post("/register", async (req, res) => {
  const data = req.body;
  const user = new User(data);
  try {
    const mongoresult = await user.save();
    res.status(201).send(mongoresult);
  } catch (err) {
    res.status(400).send(err.message);
    console.log(err);
  }
});
// router.get ...
module.exports = router;
