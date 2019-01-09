var crypto_utils = require("./crypto_utils");
var express = require('express');
var users=require("./users");
var admin=require("./admin");
var fairs=require("./fairs");
var companies=require("./companies");
var bodyParser=require("body-parser");
var cors=require("cors");
var app = express();
app.use(cors());
app.use(bodyParser.json({limit:"10mb"}));
app.use("/user", users.router);
app.use("/company", companies.router);
app.use("/admin", admin.router);
app.use("/fairs", fairs.router);
app.listen(4242, async function() {
  console.log('Listening on 4242');
});
app.use(function (err, req, res, next) {
  res.status(400);
  res.send("Bad request");
  console.error("Internal server error");
  console.error(err);
})