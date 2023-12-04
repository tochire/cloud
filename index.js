const sql = require("mssql");
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));

const config = {
  user: "farahmed", // better stored in an app setting such as process.env.DB_USER
  password: "Abcd123456", // better stored in an app setting such as process.env.DB_PASSWORD
  server: "cloudisamm.database.windows.net", // better stored in an app setting such as process.env.DB_SERVER
  port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
  database: "projet", // better stored in an app setting such as process.env.DB_NAME
  authentication: {
    type: "default",
  },
  options: {
    encrypt: true,
  },
};


console.log("Starting...");
connectAndQuery();
async function connectAndQuery() {
  try {
    var poolConnection = await sql.connect(config);

    app.post("/submit", async (req, res) => {
      console.log(req.body);
      var resultSet = await poolConnection
        .request()
        .query(
          `insert into login values('${req.body.username}','${req.body.password}');`
        );

      res.send("donnees sauvegarde au base de donnee");
    });
    app.get("/logins", async (req, res) => {
      var result = await poolConnection
        .request()
        .query("select username,password from login");
      console.log(result);
      res.send(result.recordset);
    });
  } catch (err) {
    console.error(err.message);
  }
}
app.get("/", (req, res) => {
  res.sendfile("index.html");
});

app.listen(80,() =>console.log('listening on port 80'));
