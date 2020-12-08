const mongoose = require("mongoose");

const monthSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  days: [{ type: mongoose.Types.ObjectId, ref: "Day" }],
});

module.exports = mongoose.model("Month", monthSchema);
