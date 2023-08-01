const express = require("express");
const app = express();
const fs = require("fs");
let cron = require("node-cron");
const https = require("https");
const port = 3000;

cron.schedule("*/10 * * * *", () => {
  // Ping to "https://propty-file-server.onrender.com" to keep it awake
  fetch("https://propty-file-server.onrender.com");
  https.get("https://propty-file-server.onrender.com");
  console.log("Ping to https://propty-file-server.onrender.com");

  // Ping to "https://flowise-7ne0.onrender.com" to keep it awake
  fetch("https://flowise-7ne0.onrender.com");
  https.get("https://flowise-7ne0.onrender.com");
  console.log("Ping to https://flowise-7ne0.onrender.com");
});

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  fs.createReadStream("./Propiedades.txt", { encoding: "utf-8" }).pipe(res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
