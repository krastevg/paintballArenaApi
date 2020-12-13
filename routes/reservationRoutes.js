const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const { authAccess } = require("./helpers");

router.post("/makeReservation", authAccess, async (req, res) => {
  let { hours, people } = req.body;
  people = Number(people);
  const userId = req.query.userId;
  const dayId = req.query.dayId;
  const price = Number(req.query.price);

  if (people < 6 || people > 20) {
    res.status(400).send({ error: { message: "Data does not meet criteria" } });
    return;
  }

  try {
    const reservation = new Reservation({
      day: dayId,
      user: userId,
      people,
      price,
      hours,
    });
    const result = await reservation.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send({ error: { message: err.message } });
  }
});

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
