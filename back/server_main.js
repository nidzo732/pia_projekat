var crypto_utils = require("./crypto_utils");

var express = require('express');
var cors=require("cors");
var users=require("./users");
var bodyParser=require("body-parser");
var app = express();
app.use(cors());
app.use(bodyParser.json({limit:"10mb"}));
app.use("/user", users.router);
app.listen(4242, async function() {
  console.log('Listening on 4242');
});