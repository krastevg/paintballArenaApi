const Reservation = require("../models/Reservation");
const { getCurrentDate, createDate } = require("./dateHelpers");

const changeReservationStatus = async () => {
  // get all reservations
  try {
    const reservations = await Reservation.find({ status: "active" }).populate(
      "day"
    );
    for (let reservationObj of reservations) {
      if (cantCancel(reservationObj)) {
        reservationObj.status = "complete";
        await reservationObj.save();
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const cantCancel = (reservationObj) => {
  const reservationDate = createDate(
    reservationObj.day.month,
    reservationObj.day.day,
    reservationObj.day.year
  );

  const currentDate = getCurrentDate();

  console.log(reservationDate, currentDate);

  return reservationDate.getTime() <= currentDate.getTime() ? true : false;
};

module.exports = {
  changeReservationStatus,
  cantCancel,
};
