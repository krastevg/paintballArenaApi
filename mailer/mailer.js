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

module.exports = { registrationComplete };
