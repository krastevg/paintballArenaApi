require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const monthRouter = require("./routes/monthRoutes");

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@gettingstarted.lywkb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

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
app.use("/reservation", reservationRoutes);
app.use("/", monthRouter);

app.listen(3000, console.log("Listening on port 3000"));
