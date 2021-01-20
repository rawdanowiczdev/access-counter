const express = require("express");
const app = express();
const fs = require("fs");
const nodemailer = require("nodemailer");
require("dotenv").config();

let date = undefined;
let logsFile = undefined;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

app.get("/", (req, res, next) => {
  date = new Date();
  logsFile = date.toLocaleDateString("pl-PL");
  const log = `${date.toLocaleString("pl-PL").replace(/\,/g, "")}\r\n`;

  fs.appendFile(`./logs/${logsFile}.log`, log, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(date);
  });

  next();
});

app.get("/", (req, res, next) => {
  if (date) {
    const mail = {
      from: "Marek Rawdanowicz mar.rawdanowicz@gmail.com",
      to: "marek.rawdanowicz@outlook.com",
      subject: `rawdanowiczdev.pl ${logsFile} logs`,
      attachments: [
        {
          path: `./logs/${logsFile}.log`,
        },
      ],
    };

    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Logs sent.");
      }
    });
  }

  res.end();
});

app.listen(3000);
