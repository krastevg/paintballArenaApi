const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  day: {
    type: Number,
    max: 31,
    min: 1,
  },
  weekday: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  month: {
    type: String,
    enum: [
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
    ],
  },

  year: {
    type: Number,
  },
  timeframes: {
    type: Object,
    default: { "08:00-12:00": 40, "12:30-16:30": 40, "17:00-21:00": 40 },
  },

  reservationsMade: [{ type: mongoose.Types.ObjectId, ref: "Reservation" }],

  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Day", daySchema);
