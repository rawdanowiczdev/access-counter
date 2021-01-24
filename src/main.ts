import express from "express";
import fs from "fs";
import path from "path";

import nodemailer from "nodemailer";
import dotenv from "dotenv";
import helmet from "helmet";

const app = express();
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_SENDER_PASSWORD,
  },
});

app.use(helmet());

app.post("/", (req, res, next) => {
  const date = new Date();
  const logFileName = date.toLocaleDateString("pl-PL");
  const log = `${date.toLocaleString("pl-PL").replace(/\,/g, "")}\r\n`;
  const logsPath = path.resolve(__dirname, "..", "logs", `${logFileName}.log`);

  fs.appendFile(logsPath, log, (err) => {
    if (!err && logFileName) {
      console.log(log);

      const mail = {
        from: `Marek Rawdanowicz ${process.env.EMAIL_SENDER}`,
        to: `${process.env.EMAIL_RECEIVER}`,
        subject: `${logFileName}.log`,
        text: "Somebody just accessed rawdanowiczdev.pl, log file attached.",
        attachments: [
          {
            filename: `${logFileName}.log`,
            path: logsPath,
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

  res.status(201).end();
});

app.listen(process.env.PORT);
