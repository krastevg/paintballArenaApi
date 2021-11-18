const Request = require("../models/Request");
const Reservation = require("../models/Reservation");
const { getCurrentDate, createDate } = require("./dateHelpers");

const changeReservationStatus = async () => {
  // get all reservations
  try {
    const reservations = await Reservation.find({ status: "active" }).populate(
      "day"
    );
    for (let reservationObj of reservations) {
      if (canCancel(reservationObj)) {
        reservationObj.status = "complete";
        await reservationObj.save();
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const canCancel = (reservationObj) => {
  const reservationDate = createDate(
    reservationObj.day.month,
    reservationObj.day.day,
    reservationObj.day.year
  );

  const currentDate = getCurrentDate();

  console.log(reservationDate, currentDate);

  return reservationDate.getTime() <= currentDate.getTime() ? true : false;
};

const hasExpired = (requestObj) => {
  const oneDay = 1 * 24 * 60 * 60 * 1000; // in miliseconds same as Date.getTime
  //day * hours*  minutes * seconds *miliseconds
  const dateNow = Date.now();
  const expiryDate = requestObj.madeAt.getTime() + oneDay;

  console.log(dateNow, expiryDate);

  return dateNow >= expiryDate ? true : false;
};

const expireRequests = async () => {
  try {
    const requests = await Request.find({ status: "active" });

    for (let request of requests) {
      if (hasExpired(request)) {
        request.status = "expired";
        await request.save();
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  changeReservationStatus,
  expireRequests,
};
