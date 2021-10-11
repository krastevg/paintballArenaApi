const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: [
      /^([\w!#$%&'*+\-\/=?^_`{|\.]{3,64})@([\w\.]{3,253})\.([a-z]{2,3})$/,
      "Not a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  reservations: [{ type: mongoose.Types.ObjectId, ref: "Reservation" }],
});

module.exports = mongoose.model("User", userSchema);
