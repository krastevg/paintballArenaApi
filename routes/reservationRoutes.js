const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const { reservationComplete } = require("../mailer/mailer");
const { authAccess, checkImpostor } = require("../helpers/authentication");
const { getUser, getDay } = require("../helpers/getModels");
const { reservationValidation } = require("../helpers/validators");

router.post(
  "/",
  authAccess,
  getUser,
  getDay,
  reservationValidation,
  async (req, res) => {
    const { people, gear, dayId, price, timeframe, payment, user } = req.body;
    try {
      if (checkImpostor(req.loggedIn, user)) {
        // if true the requester is not the one the entry is being made
        throw { message: "Impostor detected!" };
      }
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
      req.dayResult.set(
        `timeframes.${timeframe}`,
        req.dayResult.timeframes[timeframe] - people
      );
      const saveReservationToDay = await req.dayResult.save();
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

router.get("/", authAccess, async (req, res) => {
  const userId = req.query.userId;
  try {
    const result = await Reservation.find({ user: userId })
      .populate("day")
      .lean();
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: { message: err.message } });
  }
});

router.patch("/:id", authAccess, async (req, res) => {
  const reservationId = req.params.id;
  const { status } = req.body;
  try {
    const reservationResult = await Reservation.findById(reservationId);
    const user = String(reservationResult.user);
    if (checkImpostor(req.loggedIn, user)) {
      // if true the requester is not the one the entry is being made
      throw { message: "Impostor detected!" };
    }

    if (reservationResult.status === "active") {
      reservationResult.status = status;
      await reservationResult.save();
      res
        .status(200)
        .send({ message: "Reservation status changed to canceled!" });
    } else {
      throw { message: "Can't cancel" };
    }
  } catch (err) {
    res.status(400).send({ error: { message: err.message } });
  }
});
module.exports = router;
