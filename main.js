const express = require("express");
const app = express();
const fs = require("fs");

require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

app.post("/", (req, res, next) => {
  res.status(201);
  const date = new Date();
  const log = `${date.toLocaleString("pl-PL").replace(/\,/g, "")}\r\n`;
  const logFile = date.toLocaleDateString("pl-PL");

  fs.appendFile(`./logs/${logFile}.log`, log, (err) => {
    if (!err && logFile) {
      console.log(log);

      const mail = {
        from: "Marek Rawdanowicz mar.rawdanowicz@gmail.com",
        to: "marek.rawdanowicz@outlook.com",
        subject: `${logFile}.log`,
        text: `Somebody just accessed rawdanowiczdev.pl, log file attached.`,
        attachments: [
          {
            path: `./logs/${logFile}.log`,
          },
        ],
      };

      transporter.sendMail(mail, (err) => {
        if (!err) {
          console.log(`Logs sent to ${mail.to}`);
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });

  res.end();
});

app.listen(3000);
