const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { genToken, authAccess } = require("./helpers");

router.post("/register", async (req, res) => {
  const { username, password, rePassword } = req.body;

  // check if data is valid

  if (
    password !== rePassword ||
    !password.match(/^[A-Za-z0-9]{5,}$/) ||
    !username.match(/^[A-Za-z0-9]{5,20}$/)
  ) {
    res.status(401).send({ error: { message: "Data does not meet criteria" } });
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
    res.status(401).send({ error: { message: err.message } });
    //   console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (
    !password.match(/^[A-Za-z0-9]{5,}$/) ||
    !username.match(/^[A-Za-z0-9]{5,20}$/)
  ) {
    res.status(401).send({ error: { message: "Data does not meet criteria" } });

    return;
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).send({ error: { message: "No such user or password" } });
    } else {
      const passmatch = await bcrypt.compare(password, user.password);
      if (!passmatch) {
        res
          .status(401)
          .send({ error: { message: "No such user or password" } });
      } else {
        const token = genToken(user._id, user.username);
        res.cookie("paint", token);
        res.status(200).send(user);
      }
    }
  } catch (err) {
    res.status(401).send({ error: { message: err.message } });
  }
});

router.get("/checkAuth", (req, res) => {
  const cookieWithToken = req.cookies["paint"];
  if (!cookieWithToken) {
    res.status(401).send({ error: { message: "Cookie not found" } });
  }

  try {
    const result = jwt.verify(cookieWithToken, process.env.PRIVATE_KEY); // throws if fail
    //console.log(result); //for  debugging
    res.status(200).send({ message: "Auth is valid", flag: true });
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: { message: "Authentication FAILED" } });
  }
});

router.get("/profile", authAccess, async (req, res) => {
  const userId = req.query.userId;
  if (!!userId) {
    try {
      const result = await User.findById(userId)
        .populate("reservations")
        .lean();
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ error: { message: err.message } });
    }
  } else {
    res.status(400).send({ error: { message: "No id provided" } });
  }
});
// router.get ...
module.exports = router;
