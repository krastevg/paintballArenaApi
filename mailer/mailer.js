const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const registrationComplete = (userEmail) => {
  const options = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    port: 587,
    subject: "PaintballArena Registration",
    text: "You have sucsesfully registered an account with us !",
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Response: ${info.response}`);
  });
};

const reservationComplete = (
  userEmail,
  dayObject,
  people,
  price,
  timeframe
) => {
  const options = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    port: 587,
    subject: "Reservation Complete",
    text: `Your reservation for ${people} at ${dayObject.weekday} ${dayObject.day} ${dayObject.month} ${dayObject.year} - ${timeframe} for the price of ${price} has been completed sucsesfuly!`,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Response: ${info.response}`);
  });
};

const passwordChange = (userEmail) => {
  const options = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    port: 587,
    subject: "PaintballHeaven - Password change",
    text: `Your password has been changed successfully!`,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Response: ${info.response}`);
  });
};

module.exports = { registrationComplete, reservationComplete, passwordChange };
