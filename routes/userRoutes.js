const express = require("express");
const User = require("../models/User");
const Request = require("../models/Request");
const router = express.Router();
const bcrypt = require("bcrypt");

const {
  genToken,
  authAccess,
  checkImpostor,
} = require("../helpers/authentication");
const { getUser } = require("../helpers/getModels");
const { dataValidation, passwordValidation } = require("../helpers/validators");
const {
  registrationComplete,
  passwordChange,
  passwordReset,
  sendEmailChangeCode,
  emailChanged,
} = require("../mailer/mailer");
const { generateRandomString } = require("../helpers/password");

router.post("/", dataValidation, async (req, res) => {
  const { email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPas = await bcrypt.hash(password, salt);
    const user = new User({ email, password: hashedPas });
    const savedObj = await user.save();
    const token = genToken(savedObj._id, savedObj.email, savedObj.role);
    res.cookie("paint", token); // adding cookie
    res.status(201).send({
      id: savedObj._id,
      email: savedObj.email,
      reservations: savedObj.reservations,
      role: savedObj.role,
    }); // sending response to the client
    registrationComplete(email); // sending an email for the registration
  } catch (err) {
    res.status(500).send({ error: { message: err.message } });
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
        const token = genToken(user._id, user.email, user.role);
        res.cookie("paint", token);
        res.status(200).send({
          id: user._id,
          email: user.email,
          reservations: user.reservations,
          role: user.role,
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

router.patch("/:id/changepassword", authAccess, getUser, async (req, res) => {
  const forUser = req.params.id;
  const { newPass, rePass } = req.body;

  try {
    if (!checkImpostor(req.loggedIn.id, forUser)) {
      throw { message: "Impostor Detected" };
    }

    if (!passwordValidation(newPass, rePass)) {
      throw { message: "Passwords do not match" };
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPas = await bcrypt.hash(newPass, salt);
    req.userResult.password = hashedPas;
    await req.userResult.save();
    passwordChange(req.userResult.email);
    res.status(200).send({ message: "Password Changed!" });
  } catch (err) {
    console.log(err);
    switch (err.message) {
      case "Impostor Detected": {
        res.status(401).send({ error: { message: "Impostor Detected" } });
        break;
      }
      case "Passwords do not match": {
        res.status(400).send({ error: { message: "Passwords do not match" } });
        break;
      }

      default: {
        res.status(500).send({
          error: { message: "Unexpected error! Please try again later!" },
        });
        break;
      }
    }
  }
});

router.post("/:email/resetpassword", async (req, res) => {
  const userEmail = req.params.email;
  const newPass = generateRandomString(3);
  try {
    const user = await User.find({ email: userEmail });
    if (user.length !== 0) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      const hashedPas = await bcrypt.hash(newPass, salt);
      user[0].password = hashedPas;
      await user[0].save();
      passwordReset(userEmail, newPass);
      res.status(200).send({ message: "Password reset sent!" });
    } else {
      throw "No such user!";
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: { message: "Unexpected error! Please try again later!" },
    });
  }
});

router.post("/:id/emailcode", authAccess, getUser, async (req, res) => {
  const forUser = req.params.id;
  try {
    if (!checkImpostor(req.loggedIn.id, forUser)) {
      throw { message: "Impostor Detected" };
    }
    const emailCode = generateRandomString(6);
    const emailChangeRequest = new Request({
      requestType: "Email Change",
      code: emailCode,
      user: req.userResult._id,
    });
    await emailChangeRequest.save();
    sendEmailChangeCode(req.userResult.email, emailCode);
    res.status(200).send({ message: "Email change code sent!" });
  } catch (err) {
    console.log(err);
    switch (err.message) {
      case "Impostor Detected": {
        res.status(401).send({ error: { message: "Impostor Detected" } });
        break;
      }
      default: {
        res.status(500).send({
          error: { message: "Unexpected error! Please try again later!" },
        });
        break;
      }
    }
  }
});

router.patch("/:id/emailchange", authAccess, getUser, async (req, res) => {
  const forUser = req.params.id;
  const { code, newEmail } = req.body;
  try {
    if (!checkImpostor(req.loggedIn.id, forUser)) {
      throw { message: "Impostor Detected" };
    }

    if (
      !newEmail.match(
        /^([\w!#$%&'*+\-\/=?^_`{|\.]{3,64})@([\w\.]{3,253})\.([a-z]{2,3})$/
      )
    ) {
      throw { message: "Wrong Email Format!" };
    }

    const requests = await Request.find({ code }).populate("user");
    if (
      requests.length === 0 ||
      requests[0].status === "used" ||
      String(requests[0].user._id) !== req.loggedIn.id
    ) {
      throw { message: "Invalid Code!" };
    }
    // code exists and is active
    req.userResult.email = newEmail; // change the email
    await req.userResult.save();
    requests[0].status = "used"; // change the request status to used
    await requests[0].save();
    emailChanged(newEmail);
    res.status(200).send({
      message: "Email updated successfully!",
      user: {
        email: req.userResult.email,
        id: req.userResult._id,
        reservations: req.userResult.reservations,
        role: req.userResult.role,
      },
    });
  } catch (err) {
    if (err.message.includes("E11000")) {
      res.status(400).send({ error: { message: "Email is already in use!" } });
      return;
    }
    switch (err.message) {
      case "Impostor Detected": {
        res.status(401).send({ error: { message: "Impostor Detected" } });
        break;
      }
      case "Invalid Code!": {
        res.status(400).send({ error: { message: "Invalid Code!" } });
        break;
      }
      case "Wrong Email Format!": {
        res.status(400).send({ error: { message: "Wrong Email Format!" } });
        break;
      }
      default: {
        res.status(500).send({
          error: { message: "Unexpected error! Please try again later!" },
        });
        break;
      }
    }
  }
});
module.exports = router;
