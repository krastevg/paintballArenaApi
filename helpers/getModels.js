const User = require("../models/User");
const Day = require("../models/Day");
// attaches the user to the request object from the database, found by ID
const getUser = async (req, res, next) => {
  const userId = req.query.userId;
  if (!!userId) {
    try {
      const userResult = await User.findById(userId);
      req.userResult = userResult;
      next();
    } catch (err) {
      res.status(500).send({ error: { message: err.message } });
    }
  } else {
    res.status(400).send({ error: { message: "UserId needs to be provided" } });
  }
};
// attaches the day to the request object from the databse, found by day ID
const getDay = async (req, res, next) => {
  const dayId = req.body.dayId;
  if (!!dayId) {
    try {
      const dayResult = await Day.findById(dayId);
      req.dayResult = dayResult;
      next();
    } catch (err) {
      res.status(500).send({ error: { message: err.message } });
    }
  } else {
    res.status(400).send({ error: { message: "dayId needs to be provided" } });
  }
};

module.exports = {
  getUser,
  getDay,
};
