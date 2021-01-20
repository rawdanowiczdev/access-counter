const express = require("express");
const app = express();
const fs = require("fs");

const nodemailer = require("nodemailer");
require("dotenv").config();

let date;
let log;
let logFile;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

app.get("/", (req, res, next) => {
  date = new Date();
  log = `${date.toLocaleString("pl-PL").replace(/\,/g, "")}\r\n`;
  logFile = date.toLocaleDateString("pl-PL");

  fs.appendFile(`./logs/${logFile}.log`, log, (err) => {
    if (!err) {
      console.log(log);
    } else {
      console.log(err);
    }
  });

  res.status(201);
  next();
});

app.get("/", (req, res, next) => {
  if (date) {
    const mail = {
      from: "Marek Rawdanowicz mar.rawdanowicz@gmail.com",
      to: "marek.rawdanowicz@outlook.com",
      subject: `rawdanowiczdev.pl ${logFile}.log`,
      attachments: [
        {
          path: `./logs/${logFile}.log`,
        },
      ],
    };

    transporter.sendMail(mail, (err) => {
      if (!err) {
        console.log("Logs sent to marek.rawdanowicz@outlook.com");
      } else {
        console.log(err);
      }
    });
  }

  res.end();
});

app.listen(3000);
