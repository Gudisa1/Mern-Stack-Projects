const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();
const url = process.env.MONGO_URI;
const userAuth = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/post");
// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", userAuth);
app.use("/api/post", postRoute);

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected Succesfully");
    app.listen(8080, console.log("Server Running on port 8080"));
  })
  .catch((err) => {
    console.log(err);
  });
