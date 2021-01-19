const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", (req, res, next) => {
  const date = `${new Date().toLocaleString().replace(/\,/g, "")}\r\n`;

  fs.appendFile("./access.log", date, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(date);
  });

  res.end();
});

app.listen(3000);
