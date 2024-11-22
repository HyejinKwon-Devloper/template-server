const express = require("express");
const app = express();
app.listen(10040, function () {
  console.log("Start port 10040");
});

app.get("/", function (req, res) {
  res.send("<h1>hello world!</h1>");
});
