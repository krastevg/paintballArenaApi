const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  madeAt: {
    type: Date,
    default: Date.now,
  },
  day: {
    type: mongoose.Types.ObjectId,
    ref: "Day",
  },

  price: {
    type: Number,
    default: 0,
    min: 0,
  },

  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  timeframe: {
    type: String,
    enum: ["08:00-12:00", "12:30-16:30", "17:00-21:00"],
    required: true,
    default: "08:00-12:00",
  },

  gear: {
    type: Boolean,
    default: false,
  },

  people: {
    type: Number,
    min: 1,
    max: 40,
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
