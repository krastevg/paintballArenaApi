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

const passwordReset = (userEmail, newPass) => {
  const options = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    port: 587,
    subject: "PaintballHeaven - Password reset",
    text: `Your new password is "${newPass}". Please use it the next time you try to log into our system. You can change it at any time in the Profile tab!`,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Response: ${info.response}`);
  });
};

const sendEmailChangeCode = (userEmail, code) => {
  const options = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    port: 587,
    subject: "PaintballHeaven - Email Change Code",
    text: `Your email change code is "${code}". It will be active for 24 hours. If this was not requested by you, please secure your account.`,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Response: ${info.response}`);
  });
};

const emailChanged = (userEmail) => {
  const options = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    port: 587,
    subject: "PaintballHeaven - Email Change Code",
    text: `Your email has been changed sucsesfully! Please use this email the next time you try to log into our system.`,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Response: ${info.response}`);
  });
};

const adminRegistration = (email, password) => {
  const options = {
    from: process.env.EMAIL_USER,
    to: email,
    port: 587,
    subject: "PaintballHeaven - Admin Registration complete",
    text: `Admin account created! Please use this email and password("${password}") to log into your admin account.`,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Response: ${info.response}`);
  });
};

module.exports = {
  registrationComplete,
  reservationComplete,
  passwordChange,
  passwordReset,
  sendEmailChangeCode,
  emailChanged,
  adminRegistration,
};
