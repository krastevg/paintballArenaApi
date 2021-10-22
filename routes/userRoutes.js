const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { genToken, authAccess, dataValidation } = require("./helpers");
const { registrationComplete } = require("../mailer/mailer");

router.post("/", dataValidation, async (req, res) => {
  const { email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPas = await bcrypt.hash(password, salt);
    const user = new User({ email, password: hashedPas });
    const savedObj = await user.save();
    const token = genToken(savedObj._id, savedObj.email);
    res.cookie("paint", token); // adding cookie
    res.status(201).send(savedObj); // sending response to the client
    registrationComplete(email); // sending an email for the registration
  } catch (err) {
    res.status(500).send({ error: { message: err.message } });
    //   console.log(err);
  }
});

router.post("/login", dataValidation, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).send({ error: { message: "No such user or password" } });
    } else {
      const passmatch = await bcrypt.compare(password, user.password);
      if (!passmatch) {
        res
          .status(401)
          .send({ error: { message: "No such user or password" } });
      } else {
        const token = genToken(user._id, user.email);
        res.cookie("paint", token);
        res.status(200).send({
          id: user._id,
          email: user.email,
          reservations: user.reservations,
        });
      }
    }
  } catch (err) {
    res.status(500).send({ error: { message: err.message } });
  }
});

router.get("/checkAuth", authAccess, (req, res) => {
  // validest the jwt that the user sends via authAccess , is called to check if the user has access on the front end
  res.status(200).send({ message: "Auth is valid", flag: true });
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
module.exports = router;
