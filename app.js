const express = require("express");
const notice = require("./notice.js");
const db = require("./dbconnection.js");
const bodyParser = require("body-parser");
const app = express();

app.listen(10040, function () {
  console.log("Start port 10040");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const connected_db = db.init();
db.connect(connected_db);

notice.init(connected_db);
app.use(notice.noticeApp);

app.get("/", function (req, res) {
  res.send("<h1>hello world!</h1>");
});
