const express = require("express");
const noticeApp = express();

let connectedDb = null;

noticeApp.get("/notice", function (req, res) {
  let totalItemsNum = 0;

  try {
    const totalItemsQuery = `SELECT count(*) as totalItemsNum FROM notice_board`;

    connectedDb?.query(totalItemsQuery, function (err, result) {
      if (err) {
        console.log(err);
        throw new Error(err);
      }
      totalItemsNum = result[0].totalItemsNum;
    });
  } catch (Error) {
    console.log(Error);
    res.status(500).send("can not select data");
    return;
  }

  try {
    console.log(req.query);
    const selectQuery = `SELECT bnum, title, contents, regDate, uptDate FROM notice_board ORDER BY bnum DESC LIMIT ${req.query.limit} OFFSET ${req.query.startNum}`;
    connectedDb?.query(selectQuery, function (err, result) {
      if (err) {
        console.log(err);
        throw new Error(err);
      } else {
        console.log({ ...{ totalItemsNum: totalItemsNum }, contents: result });
        res
          .status(200)
          .send({ ...{ totalItemsNum: totalItemsNum }, contents: result });
      }
    });
  } catch (Error) {
    console.log(Error);
    res.status(500).send("can not select data");
    return;
  }
});

noticeApp.get(`/notice/:bnum`, function (req, res) {
  const selectQuery = `SELECT * FROM notice_board WHERE bnum=${req.params?.bnum}`;
  try {
    connectedDb?.query(selectQuery, function (err, result) {
      if (err) {
        console.log(err);
        throw new Error();
      } else {
        res.status(200).send(JSON.stringify(result));
        console.log(JSON.stringify(result));
      }
    });
  } catch (Error) {
    console.log(Error);
    res.status(500).send("can not select data");
    return;
  }
});

noticeApp.post("/notice/add", function (req, res) {
  const getCurrentBnum = "SELECT COUNT(*) as bnum FROM NOTICE_BOARD";
  try {
    connectedDb?.query(getCurrentBnum, function (err, result) {
      let bnum = result[0].bnum;
      if (err) {
        console.log(err);
        throw new Error();
      } else {
        if (bnum) {
          bnum += 1;
        } else bnum = 1;
        const insertQuery = `INSERT INTO NOTICE_BOARD (bnum, register, title, contents, regDate, uptDate) VALUES (${bnum}, 'hyejin', '${req.body.title}', '${req.body.contents}', now(), now())`;
        try {
          if (!req.body.title || !req.body.contents) {
            console.log(
              "output >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
              req.body.title,
              req.body.contents
            );
            throw new Error();
          }
          connectedDb?.query(insertQuery, function (err, result) {
            if (err) {
              console.log(err);
              throw new Error();
            } else {
              console.log("success >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
              res.sendStatus(200);
              console.log(
                "success 2>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
              );
            }
          });
        } catch (Error) {
          console.log(Error);
          res.status(400).send("Check Data");
          return;
        }
      }
    });
  } catch (Error) {
    console.log(Error);
    res.status(500).send("can not select data");
    return;
  }
});

noticeApp.put("/notice/:bnum", function (req, res) {
  console.log(req.baseUrl, req.params, req.path, req.query);
  const getCurrentBnum = `SELECT * FROM NOTICE_BOARD WHERE bnum=${req.params?.bnum}`;
  try {
    connectedDb?.query(getCurrentBnum, function (err, result) {
      if (err) {
        console.log(err);
        throw new Error();
      } else {
        const updateQuery = `UPDATE NOTICE_BOARD SET title='${req.body.title}', contents='${req.body.contents}', uptDate=now() WHERE bnum=${req.params?.bnum}`;
        try {
          if (!req.body.title || !req.body.contents) {
            throw new Error();
          }
          connectedDb?.query(updateQuery, function (err, result) {
            if (err) {
              console.log(err);
              throw new Error();
            } else {
              res.status(200).send("OK");
            }
          });
        } catch (Error) {
          console.log(Error);
          res.status(400).send("Check Data");
          return;
        }
      }
    });
  } catch (Error) {
    console.log(Error);
    res.status(400).send("Bad Request");
    return;
  }
});

module.exports = {
  init: function (conn) {
    if (conn) connectedDb = conn;
  },
  noticeApp,
};
