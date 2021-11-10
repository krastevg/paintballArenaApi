const { createDate, getCurrentDate } = require("./dateHelpers");

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
    priceValidation(gear, price, people, priceNoGear, priceWithGear) &&
    checkDate(dayResult.month, dayResult.day, dayResult.year)
  ) {
    next();
  } else {
    res.status(400).send({ error: { message: "Data not valid" } });
  }
};

const checkDate = (month, day, year) => {
  const reservationDate = createDate(month, day, year);
  const currentDate = getCurrentDate();

  console.log("checkDate", reservationDate, currentDate);

  return reservationDate.getTime() > currentDate.getTime() ? true : false;
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

function validateDayData(year, month, weekday, day) {
  const weekdayArr = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const monthArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (!!year && !!month && !!weekday && !!day) {
    // will continue only if all parameters are present
    if (
      Number(year) !== NaN &&
      Number(day) !== NaN &&
      Number(day) <= 31 &&
      Number(day) >= 1
    ) {
      // numerical check
      if (weekdayArr.includes(weekday) && monthArr.includes(month)) {
        // check if the month provided is in the array
        return true;
      }
    }
  }

  return false;
}

module.exports = {
  dataValidation,
  reservationValidation,
  validateDayData,
};
