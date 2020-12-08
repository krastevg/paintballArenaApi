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
  },

  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  hours: {
    type: String,
  },

  people: {
    type: Number,
    min: 6,
    max: 20,
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
