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
  payment: {
    type: String,
    required: true,
    enum: ["online", "inPerson"],
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "complete", "canceled"],
    default: "active",
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
