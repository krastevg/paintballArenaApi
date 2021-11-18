const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  madeAt: {
    type: Date,
    default: Date.now,
  },
  requestType: {
    type: String,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "used", "expired"],
    default: "active",
  },
  user: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Request", requestSchema);
