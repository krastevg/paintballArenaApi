const express = require("express");

const router = express.Router();
const Month = require("../models/Month");
const Day = require("../models/Day");
const { authAccess } = require("./helpers");

router.get("/months", authAccess, async (req, res) => {
  //http://localhost:3000/months?month=Jan&year=2020

  const hasMonth = !!req.query.month;
  const hasYear = !!req.query.year;

  if (hasMonth && hasYear) {
    const yearParam = req.query.year;
    const monthParam = req.query.month;
    try {
      const monthres = await Month.find({
        name: monthParam,
        year: yearParam,
      })
        .populate("days")
        .lean();

      if (monthres.length === 0) {
        const daysArr = await makeDays(yearParam, monthParam, req, res);
      } else {
        res.status(200).send(monthres); // the month already exists a populated query is returned
      }
    } catch (err) {
      res.status(400).send({ error: { message: err.message } });
    }
  } else {
    try {
      const months = await Month.find().populate("days").lean();
      res.status(200).send(months);
    } catch (err) {
      res.status(400).send({ error: { message: err.message } });
    }
  }
});

async function makeDays(year, month1, req, res) {
  // let month1s = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December",
  // ];
  // let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let days = {
    January: 31,
    February: 28,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };
  let dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let firstDay = new Date(`${month1} 1, ${year} 00:00:00`);

  let testArr = [];
  let counter = firstDay.getDay();

  function changeCounter() {
    // function that keeps track of the days of the week
    if (counter <= 5) {
      counter++;
    } else {
      counter = 0;
    }
  }
  // creating documents
  for (let i = 0; i < days[month1]; i++) {
    testArr.push({
      date: i + 1,
      dayOfWeek: dayOfWeek[counter],
      month: month1,
      year,
    });
    changeCounter();
  }

  Day.insertMany(testArr)
    .then(function (docs) {
      let idArr = docs.reduce((acc, curr) => {
        acc.push(curr._id);
        return acc;
      }, []);

      const monthResult = new Month({
        name: month1,
        year,
        days: idArr,
      });
      monthResult.save().then(() => {
        Month.find({
          name: month1,
          year,
        })
          .populate("days")
          .lean()
          .then((data) => {
            res.status(200).send(data);
          });
      });
    })
    .catch(function (err) {
      console.log(err);
    });
}

module.exports = router;
