const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");

const { genToken } = require("./helpers");

router.post("/register", async (req, res) => {
  const { username, password, rePassword } = req.body;

  // check if data is valid

  if (
    password !== rePassword ||
    !password.match(/^[A-Za-z0-9]{5,}$/) ||
    !username.match(/^[A-Za-z0-9]{5,20}$/)
  ) {
    res.status(400).send({ error: "Data does not meet criteria" });
    return;
  }

  try {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPas = await bcrypt.hash(password, salt);
    const user = new User({ username, password: hashedPas });
    const savedObj = await user.save();
    const token = genToken(savedObj._id, savedObj.username);
    res.cookie("paint", token);
    res.status(201).send(savedObj);
  } catch (err) {
    res.status(400).send(err.message);
    //   console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (
    !password.match(/^[A-Za-z0-9]{5,}$/) ||
    !username.match(/^[A-Za-z0-9]{5,20}$/)
  ) {
    res.status(400).send({ error: "Data does not meet criteria" });
    return;
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(200).send({ error: "No such user or password" });
    } else {
      const passmatch = await bcrypt.compare(password, user.password);
      if (!passmatch) {
        res.status(200).send({ error: "No such user or password" });
      } else {
        const token = genToken(user._id, user.username);
        res.cookie("paint", token);
        res.status(200).send(user);
      }
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});
// router.get ...
module.exports = router;
