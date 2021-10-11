const express = require("express");
const router = express.Router();
const Day = require("../models/Day");
const { authAccess } = require("./helpers");

router.post("/", authAccess, async (req, res) => {
  const { year, month, weekday, day } = req.body;

  //console.log(year, month, weekday, day);

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

// router.get("/day", authAccess, async (req, res) => {
//   const dayId = req.query.dayId;
//   if (!!dayId) {
//     try {
//       const result = await Day.findById(dayId).lean();
//       res.status(200).send(result);
//     } catch (err) {
//       res.status(400).send({ error: { message: err.message } });
//     }
//   } else {
//     res.status(400).send({ error: { message: "No query params" } });
//   }
// });

// router.patch("/day/:_id", authAccess, async (req, res) => {
//   const id = req.params._id;
//   const frame = req.query.frame;
//   const type = req.query.type;
//   const { reservId } = req.body;

//   console.log("IM IN", id, frame, type, reservId);

//   if (!!frame && !!type) {
//     switch (frame) {
//       case "firstFrame":
//         firstFrame(req, res, type, reservId, id);
//         break;

//       case "secondFrame":
//         secondFrame(req, res, type, reservId, id);
//         break;

//       case "thirdFrame":
//         thirdFrame(req, res, type, reservId, id);
//         break;
//     }
//   } else {
//     console.log("No params");
//     res.status(400).send({ error: { message: "No query params" } });
//   }
// });

// const firstFrame = async (req, res, type, reservId, id) => {
//   try {
//     if (type === "update") {
//       const result = await Day.findByIdAndUpdate(id, {
//         $addToSet: {
//           firstFrame: reservId,
//         },
//       }).lean();
//       res.status(200).send(result);
//     } else {
//       const result = await Day.findByIdAndUpdate(id, {
//         $pop: {
//           firstFrame: -1,
//         },
//       }).lean();
//       console.log("first frame should send status now");
//       res.status(200).send(result);
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(400).send({ error: { message: err.message } });
//   }
// };

// const secondFrame = async (req, res, type, reservId, id) => {
//   try {
//     if (type === "update") {
//       const result = await Day.findByIdAndUpdate(id, {
//         $addToSet: {
//           secondFrame: reservId,
//         },
//       }).lean();
//       res.status(200).send(result);
//     } else {
//       const result = await Day.findByIdAndUpdate(id, {
//         $pop: {
//           secondFrame: -1,
//         },
//       }).lean();
//       console.log("second frame should send status now");
//       res.status(200).send(result);
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(400).send({ error: { message: err.message } });
//   }
// };

// const thirdFrame = async (req, res, type, reservId, id) => {
//   try {
//     if (type === "update") {
//       const result = await Day.findByIdAndUpdate(id, {
//         $addToSet: {
//           thirdFrame: reservId,
//         },
//       }).lean();
//       res.status(200).send(result);
//     } else {
//       const result = await Day.findByIdAndUpdate(id, {
//         $pop: {
//           thirdFrame: -1,
//         },
//       }).lean();
//       res.status(200).send(result);
//       console.log("third frame should send status now");
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(400).send({ error: { message: err.message } });
//   }
// };

module.exports = router;
