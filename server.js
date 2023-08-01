const express = require("express");
const app = express();
const fs = require("fs");
let cron = require("node-cron");
const https = require("https");
const port = 3000;

cron.schedule("*/2 * * * *", () => {
  console.log("running a task every two minutes");
  // Ping to "https://propty-file-server.onrender.com" to keep it awake
  https.get("https://propty-file-server.onrender.com");
  console.log("Ping to https://propty-file-server.onrender.com");

  // Ping to "https://flowise-7ne0.onrender.com" to keep it awake
  https.get("https://flowise-7ne0.onrender.com");
  console.log("Ping to https://flowise-7ne0.onrender.com");
});

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  fs.createReadStream("./Propiedades.txt", { encoding: "utf-8" }).pipe(res);
});

// Overwrite file
app.post("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  fs.writeFile("./Propiedades.txt", req.body, function (err) {
    if (err) return console.log(err);
    console.log("File overwritten");
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
