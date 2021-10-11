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
  timeframes: { type: [Number], default: [40, 40, 40] },

  reservationsMade: [{ type: mongoose.Types.ObjectId, ref: "Reservation" }],
});

module.exports = mongoose.model("Day", daySchema);
