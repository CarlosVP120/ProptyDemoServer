const express = require("express");
const app = express();
const fs = require("fs");
const port = 3000;

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  fs.createReadStream("./Propiedades.txt", { encoding: "utf-8" }).pipe(res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
