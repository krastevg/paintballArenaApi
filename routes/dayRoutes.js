const express = require("express");
const router = express.Router();
const Day = require("../models/Day");
const { authAccess } = require("../helpers/authentication");
const { validateDayData } = require("../helpers/validators");
const { createDate } = require("../helpers/dateHelpers");

router.post("/", authAccess, async (req, res) => {
  const { year, month, weekday, day } = req.body;

  if (!validateDayData(year, month, weekday, day)) {
    // checking data
    res
      .status(400)
      .send({ error: "Data is provided in the incorrect format !" });
    return;
  }

  // checking if the day exists already
  try {
    const existingDay = await Day.findOne({ year, month, weekday, day }).lean();
    if (!!existingDay) {
      res.status(200).send(existingDay); // the day in question has been found and is returned
      return;
    }
    // the day has not been found ; creating a new one
    const newDay = new Day({
      year,
      month,
      weekday,
      day,
      date: createDate(month, day, year),
    });
    const result = await newDay.save();
    res.status(201).send(result); // new day is created
  } catch (err) {
    res.status(500).send({ error: { message: err.message } });
  }
});

module.exports = router;
