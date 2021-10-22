const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const User = require("../models/User");
const { reservationComplete } = require("../mailer/mailer");
const {
  authAccess,
  getUser,
  reservationValidation,
  getDay,
} = require("./helpers");

router.post(
  "/",
  authAccess,
  getUser,
  getDay,
  reservationValidation,
  async (req, res) => {
    const { people, gear, dayId, price, user, timeframe, payment } = req.body;
    try {
      // creating reservation
      const reservation = new Reservation({
        day: dayId,
        price,
        user,
        timeframe,
        gear,
        people,
        payment,
      });
      // write to the db  reservation
      const reservationResult = await reservation.save();
      // add reservation to the day and add reservation to the user
      req.userResult.reservations.push(reservationResult._id);
      const saveReservationToUser = await req.userResult.save();
      //console.log(saveReservationToUser);
      req.dayResult.reservationsMade.push(reservationResult._id);

      req.dayResult.set(
        `timeframes.${timeframe}`,
        req.dayResult.timeframes[timeframe] - people
      );

      //console.log(req.dayResult.timeframes[timeframe]);
      const saveReservationToDay = await req.dayResult.save();
      //console.log(saveReservationToDay);
      reservationComplete(
        req.userResult.email,
        req.dayResult,
        people,
        price,
        timeframe
      );
      res
        .status(201)
        .send({ message: `Reservation created - ${reservationResult._id} !` });
    } catch (err) {
      res.status(500).send({ error: { message: err.message } });
    }
  }
);

router.delete("/delete/:_id", authAccess, async (req, res) => {
  const id = req.params._id;
  try {
    const result = await Reservation.findByIdAndDelete(id);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: { message: err.message } });
  }
});

router.get("/getByUser/:userId", authAccess, async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await Reservation.find({ user: userId })
      .populate("day")
      .lean();
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: { message: err.message } });
  }
});
module.exports = router;
