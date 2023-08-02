const express = require("express");
const app = express();
const fs = require("fs");
let cron = require("node-cron");
const https = require("https");
const bodyParser = require("body-parser");
const port = 3000;

// Set the file size limit to 50mb
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.text({ limit: "50mb" }));

cron.schedule("*/5 * * * *", () => {
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
app.post("/", bodyParser.text(), (req, res) => {
  // // The first line contains the names of the columns separated by commas, I want you to add the name of each column followed by : and the value of the column for each row
  // // Example:
  // // "id:1, name:John, age:20\nid:2, name:Mary, age:30\nid:3, name:Peter, age:40"

  const columnNames = req.body.split("\n")[0].split(",");
  const rows = req.body.split("\n").slice(1); // this will return an array of rows without the first row
  // Delte the "\r" from each row and also from columnNames
  rows.forEach((row, index) => {
    rows[index] = row.replace("\r", "");
  });
  columnNames.forEach((columnName, index) => {
    columnNames[index] = columnName.replace("\r", "");
  });

  // Create the result string, but ignore the last \n to avoid an empty line at the end
  const result = rows
    .map((row) => {
      const rowValues = row.split(",");
      return rowValues
        .map((rowValue, index) => {
          if (rowValue === "") return "";
          return `${columnNames[index]}:${rowValue}`;
        })
        .join(", ");
    })
    .join("\n");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  fs.writeFile("./Propiedades.txt", result, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error");
    } else {
      res.status(200).send("OK");
    }
  });

  // res.setHeader("Content-Type", "text/plain; charset=utf-8");
  // fs.writeFile("./Propiedades.txt", req.body, function (err) {
  //   if (err) return console.log(err);
  //   console.log("File overwritten");
  //   // Send success response in code 200
  //   res.status(200).send("File overwritten");
  // });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
