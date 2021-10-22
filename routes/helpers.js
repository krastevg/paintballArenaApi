const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Day = require("../models/Day");
// generates jwt token
const genToken = (id, email) => {
  const token = jwt.sign({ id, email }, process.env.PRIVATE_KEY);

  return token;
};
// checks for authentication
const authAccess = (req, res, next) => {
  const cookieWithToken = req.cookies["paint"];
  if (!cookieWithToken) {
    res.status(401).send({ error: { message: "JWT token not found !" } });
    return;
  }

  try {
    const result = jwt.verify(cookieWithToken, process.env.PRIVATE_KEY);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: { message: "Authentication FAILED" } });
    return;
  }
};

const dataValidation = (req, res, next) => {
  // validates data fields for user register and login
  let { email, password, rePassword } = req.body;
  rePassword = rePassword || password;

  if (
    password !== rePassword ||
    !password.match(/^[A-Za-z0-9]{5,}$/) ||
    !email.match(
      /^([\w!#$%&'*+\-\/=?^_`{|\.]{3,64})@([\w\.]{3,253})\.([a-z]{2,3})$/
    )
  ) {
    res.status(400).send({ error: { message: "Data does not meet criteria" } }); // change code
    return;
  }

  next();
};
// checks if all needed data for the validation is provided to the back end correctly
// needs to be called AFTER getDay and getUser
const reservationValidation = (req, res, next) => {
  let {
    people,
    gear,
    dayId,
    price,
    timeframe,
    priceWithGear,
    priceNoGear,
    payment,
  } = req.body;
  const userResult = req.userResult;
  const dayResult = req.dayResult;

  if (
    !isNaN(people) &&
    !isNaN(price) &&
    !isNaN(priceWithGear) &&
    !isNaN(priceNoGear) &&
    !!dayId &&
    !!timeframe &&
    !!payment &&
    !!userResult &&
    !!dayResult &&
    numberOfPeopleValidation(dayResult, people, timeframe) &&
    priceValidation(gear, price, people, priceNoGear, priceWithGear)
  ) {
    next();
  } else {
    res.status(400).send({ error: { message: "Data not valid" } });
  }
};
// validates that the given price is equal to the one that the user sees in the front end
const priceValidation = (gear, price, people, priceNoGear, priceWithGear) => {
  let priceToBe;
  if (gear === "true") {
    priceToBe = people * priceWithGear;
  } else {
    priceToBe = people * priceNoGear;
  }

  if (price === priceToBe) {
    return true;
  }

  return false;
};

const numberOfPeopleValidation = (dayResult, people, timeframe) => {
  const numberOfPeople = Number(people);
  const availableSlots = Number(dayResult.timeframes[timeframe]);

  if (numberOfPeople <= availableSlots) {
    return true;
  }
  return false;
};
// returns the user from the database, found by ID
const getUser = async (req, res, next) => {
  const userId = req.body.user;
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
// gets the Day by ID
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
  genToken,
  authAccess,
  dataValidation,
  reservationValidation,
  getUser,
  getDay,
};
