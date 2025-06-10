const mysql = require("mysql");

const db_info = {
  host: "localhost",
  port: "3306",
  user: "node-server",
  password: "1234123412341234",
  database: "next_template",
};
module.exports = {
  init: function () {
    return mysql.createConnection(db_info);
  },
  connect: function (conn) {
    conn.connect(function (err) {
      if (err) console.error("mysql connection error : " + err);
      else console.log("mysql is connected successfully!");
    });
  },
  query: function (sql, func) {
    conn.query(sql, func);
  },
};
