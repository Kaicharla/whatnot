const express = require("express");
const app = express();
global.mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
global.multer= require("multer");
//const cron = require("node-cron");
global.path = require("path");
//const axios = require("axios");
const { DateTime } = require("luxon");
global.DateTime=DateTime;
global.bcrypt=require("bcrypt");
global.nodemailer=require("nodemailer");
global.jwt = require("jsonwebtoken");
global.upload=multer();
global.fs=require("fs");
const FCM = require("fcm-node");
 global.fcm = new FCM(process.env.USER_FCM_SERVER_KEY);
 const cron = require("node-cron");

//middlewares

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use("/fileStorage" ,express.static(path.join(__dirname,"fileStorage")))

// defining folder for uploading the files/images/documents
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/templates", express.static(path.join(__dirname, "templates")));

// database connection
mongoose
  // .connect("mongodb+srv://Sandeep666:S@ndeep666@cluster0.0e2mb0p.mongodb.net/?retryWrites=true&w=majority")
  .connect(process.env.MONGODB_CONNECTION_ATLAS)
  .then(() => {
    console.log("The database was connected successfully");
  })
  .catch((err) => {
    console.log("No database was found", err);
  });

//api endpoint
//const end = require("./routes/routes");
const endpoint=require("./routes/adminRoutes/routes");
app.use("/", endpoint);
app.use("/promoters",require("./routes/promoterRoutes/promoter_routes"));


//api check
app.get("/", (req, res) => {
  res.send(
    "<center><h1>📚📕📖 HAPPY SHOPPING 📖📕📚</h1></center>"
  );
});
cron.schedule("0 */3 * * * *", () => {
  console.log("Server running on port 5047");
});

app.listen(process.env.PORT, () => {
  console.log(`Server connected to the port ${process.env.PORT}`);
  console.log(DateTime.local().startOf('month').toISO({ includeOffset: true }))
if("0"){
  console.log("ll")
}
  
});
