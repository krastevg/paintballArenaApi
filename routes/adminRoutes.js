const express = require("express");
const { authAccess, checkAdmin } = require("../helpers/authentication");
const { adminRegistration } = require("../mailer/mailer");
const { generateRandomString } = require("../helpers/password");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Reservation = require("../models/Reservation");
const Day = require("../models/Day");
const router = express.Router();

router.delete("/user/:email", authAccess, checkAdmin, async (req, res) => {
  const userEmail = req.params.email;
  try {
    if (userEmail === req.loggedIn.email) {
      res
        .status(400)
        .send({ error: { message: "You can't delete your own account!" } });
      return;
    }
    const outcome = await User.deleteOne({ email: userEmail });
    if (outcome.deletedCount === 0) {
      res
        .status(404)
        .send({ error: { message: "No user with this email exists!" } });
    } else {
      res
        .status(200)
        .send({ message: `User: "${userEmail}" has been deleted!` });
    }
  } catch (err) {
    res.status(500).send({ error: { message: err.message } });
  }
});

router.post("/", authAccess, checkAdmin, async (req, res) => {
  const { email } = req.body;
  const password = generateRandomString(4);
  if (
    !email.match(
      /^([\w!#$%&'*+\-\/=?^_`{|\.]{3,64})@([\w\.]{3,253})\.([a-z]{2,3})$/
    )
  ) {
    res.status(400).send({ error: { message: "Not a valid email address" } });
    return;
  }

  try {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPas = await bcrypt.hash(password, salt);
    const user = new User({ email, password: hashedPas, role: "admin" });
    const savedObj = await user.save();
    res.status(201).send({ message: "Admin Created" });
    adminRegistration(email, password);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: { message: err.message } });
  }
});

router.get("/revenue/date", authAccess, checkAdmin, async (req, res) => {
  let start = req.query.start;
  let end = req.query.end;
  const reservationsArray = [];
  const tempArr = [];
  let totalRevenue = 0;
  let payments = { inPerson: 0, online: 0 };
  let reservations = { totalNumber: 0, canceled: 0, complete: 0, active: 0 };

  if (!start || !end) {
    res
      .status(400)
      .send({ error: { message: "Start and End dates must be defined" } });
    return;
  }
  const startT = new Date(start).setHours(0, 0, 0);
  const endT = new Date(end).setHours(23, 59, 59);

  try {
    // find all the days
    const daysInRange = await Day.find({
      date: { $gte: startT, $lt: endT },
    }).lean();
    // find reservations
    for (let dayFound of daysInRange) {
      const reservFound = await Reservation.find({ day: dayFound._id })
        .populate("day user")
        .lean();
      tempArr.push(...reservFound);
    }

    for (let reservation of tempArr) {
      let { timeframe, madeAt, status, payment, price, user } = reservation;
      // calc total revenue for this period
      if (status !== "canceled") {
        totalRevenue += price;
      }
      // calculate type of payment
      payments[payment] += 1;
      // add to total number of reservations
      reservations.totalNumber += 1;
      // calculate statuses
      reservations[status] += 1;
      reservationsArray.push({
        date: `${reservation.day.weekday} ${reservation.day.day} ${reservation.day.month} ${reservation.day.year}`,
        timeframe,
        madeAt,
        status,
        payment: payment === "inPerson" ? "In Person" : "Online",
        price,
        user: user ? user.email : "deleted user",
      });
    }

    res.status(200).send({
      reservationsArray,
      totalRevenue,
      payments,
      reservations,
      startDate: start,
      endDate: end,
      queryType: "date",
      forUser: "",
    });
  } catch (err) {
    res.status(500).send({ error: { message: err.message } });
  }
});

router.get("/revenue/user", authAccess, checkAdmin, async (req, res) => {
  let email = req.query.email;
  const reservationsArray = [];
  let totalRevenue = 0;
  let payments = { inPerson: 0, online: 0 };
  let reservations = { totalNumber: 0, canceled: 0, complete: 0, active: 0 };

  if (
    !email ||
    !email.match(
      /^([\w!#$%&'*+\-\/=?^_`{|\.]{3,64})@([\w\.]{3,253})\.([a-z]{2,3})$/
    )
  ) {
    res
      .status(400)
      .send({ error: { message: "A valid email was not provided" } });
    return;
  }

  try {
    // find the user
    const user = await User.findOne({ email }).lean();
    if (!user) {
      res
        .status(404)
        .send({ error: { message: "No user with this email exists!" } });
      return;
    }
    // find the reservations made by this user
    const reservArray = await Reservation.find({ user: user._id })
      .populate("day user")
      .lean();
    for (let reservation of reservArray) {
      let { timeframe, madeAt, status, payment, price } = reservation;
      // calc total revenue for this period
      if (status !== "canceled") {
        totalRevenue += price;
      }
      // calculate type of payment
      payments[payment] += 1;
      // add to total number of reservations
      reservations.totalNumber += 1;
      // calculate statuses
      reservations[status] += 1;
      reservationsArray.push({
        date: `${reservation.day.weekday} ${reservation.day.day} ${reservation.day.month} ${reservation.day.year}`,
        timeframe,
        madeAt,
        status,
        payment: payment === "inPerson" ? "In Person" : "Online",
        price,
        user: user.email,
      });
    }

    res.status(200).send({
      reservationsArray,
      totalRevenue,
      payments,
      reservations,
      startDate: "",
      endDate: "",
      queryType: "user",
      forUser: user.email,
    });
  } catch (err) {
    res.status(500).send({ error: { message: err.message } });
  }
});
module.exports = router;
