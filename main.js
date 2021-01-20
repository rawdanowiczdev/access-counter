const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", (req, res, next) => {
  const date = new Date();
  const file = date.toLocaleDateString("pl-PL");
  const log = `${date.toLocaleString("pl-PL").replace(/\,/g, "")}\r\n`;

  fs.appendFile(`./logs/${file}.log`, log, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(date);
  });

  res.end();
});

app.listen(3000);
