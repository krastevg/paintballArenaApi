const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[A-Za-z0-9]{5,20}$/,
      "User must contain english characters and numbers only and be at least 5 symbols",
    ],
  },
  password: {
    type: String,
    required: true,
  },

  reservations: [{ type: mongoose.Types.ObjectId, ref: "Reservation" }],
});

module.exports = mongoose.model("User", userSchema);
