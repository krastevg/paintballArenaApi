require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cron = require("node-cron");

const userRoutes = require("./routes/userRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const dayRouter = require("./routes/dayRoutes");
const { changeReservationStatus, expireRequests } = require("./helpers/expire");

const url = process.env.URL;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4200"],
    credentials: true,
  })
);

mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      console.log("Databse connection established");
    }
  }
);

app.use("/user", userRoutes);
app.use("/reservations", reservationRoutes);
app.use("/days", dayRouter);

app.listen(3000, console.log("Listening on port 3000"));

// will execute at the specified time
cron.schedule("0 0 0 * * *", changeReservationStatus, {
  timezone: "Europe/Sofia",
});

cron.schedule("0 0 * * * *", expireRequests, {
  timezone: "Europe/Sofia",
});
