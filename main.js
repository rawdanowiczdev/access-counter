const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_SENDER_PASSWORD,
  },
});

app.post("/", (req, res, next) => {
  const date = new Date();
  const log = `${date.toLocaleString("pl-PL").replace(/\,/g, "")}\r\n`;
  const logFile = date.toLocaleDateString("pl-PL");

  fs.appendFile(
    path.resolve(__dirname, "logs", `${logFile}.log`),
    log,
    (err) => {
      if (!err && logFile) {
        console.log(log);

        const mail = {
          from: `Marek Rawdanowicz ${process.env.EMAIL_SENDER}`,
          to: `${process.env.EMAIL_RECEIVER}`,
          subject: `${logFile}.log`,
          text: "Somebody just accessed rawdanowiczdev.pl, log file attached.",
          attachments: [
            {
              filename: `${logFile}.log`,
              path: path.resolve(__dirname, "logs", `${logFile}.log`),
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
    }
  );

  res.status(201).end();
});

app.listen(3100);
