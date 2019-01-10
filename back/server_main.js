var crypto_utils = require("./crypto_utils");
var express = require('express');
var users = require("./users");
var admin = require("./admin");
var fairs = require("./fairs");
var companies = require("./companies");
var bodyParser = require("body-parser");
var getDb = require("./db").getDb;
var cors = require("cors");
var app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
  
app.use(async (req, res, next) =>
{
    if (req.method == "POST")
    {
        let token = req.body.token;
        if (token)
        {
            let db = await getDb();
            let user = await users.getUserByToken(token, db);
            if (user)
            {
                req.user = user;
            }
        }
    }
    next();
})
app.use("/user", users.router);
app.use("/company", companies.router);
app.use("/admin", admin.router);
app.use("/fairs", fairs.router);
app.listen(4242, async function ()
{
    console.log('Listening on 4242');
});
app.use(function (err, req, res, next)
{
    res.status(400);
    res.send("Bad request");
    console.error("Internal server error");
    console.error(err);
})