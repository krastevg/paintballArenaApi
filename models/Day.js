const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  date: {
    type: Number,
    max: 31,
    min: 1,
  },
  dayOfWeek: {
    type: String,
  },
  month: {
    type: String,
  },

  year: {
    type: Number,
  },
  firstFrame: [{ type: mongoose.Types.ObjectId, ref: "Reservation" }],
  secondFrame: [{ type: mongoose.Types.ObjectId, ref: "Reservation" }],
  thirdFrame: [{ type: mongoose.Types.ObjectId, ref: "Reservation" }],
});

module.exports = mongoose.model("Day", daySchema);
