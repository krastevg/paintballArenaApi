const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");

router.get("/hello", (req, res) => {
  res.send("Works");
});
module.exports = router;
