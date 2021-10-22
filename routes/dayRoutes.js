const express = require("express");
const router = express.Router();
const Day = require("../models/Day");
const { authAccess } = require("./helpers");

router.post("/", authAccess, async (req, res) => {
  const { year, month, weekday, day } = req.body;

  console.log(year, month, weekday, day);

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
    });
    const result = await newDay.save();
    res.status(201).send(result); // new day is created
  } catch (err) {
    res.status(500).send({ error: { message: err.message } });
  }
});

function validateDayData(year, month, weekday, day) {
  const weekdayArr = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const monthArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (!!year && !!month && !!weekday && !!day) {
    // will continue only if all parameters are present
    if (
      Number(year) !== NaN &&
      Number(day) !== NaN &&
      Number(day) <= 31 &&
      Number(day) >= 1
    ) {
      // numerical check
      if (weekdayArr.includes(weekday) && monthArr.includes(month)) {
        // check if the month provided is in the array
        return true; // all checks passed return true
      }
    }

    return false;
  }

  return false;
}

module.exports = router;
