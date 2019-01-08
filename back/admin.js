var express = require("express");
var ObjectId = require("mongodb").ObjectId;
var crypto_utils = require("./crypto_utils");
var getDb = require("./db").getDb;
var getAdminConfig = require("./db").getAdminConfig;
var updateAdminConfig = require("./db").updateAdminConfig;
var users = require("./users");
var router = require("express-promise-router")();

router.post("/getconfig", async (req, res) =>
{
    let db = await getDb();
    let body = req.body;
    let user = await users.getUserByToken(body.token, db);
    if (!user || user.kind != "admin")
    {
        res.send("FAIL")
        return;
    }
    let config=await getAdminConfig(db)
    res.json({ "message": "OK", payload:config });

});

router.post("/setconfig", async (req, res) =>
{
    let db = await getDb();
    let body = req.body;
    let config = body.payload.config;
    let user = await users.getUserByToken(body.token, db);
    if (!user || user.kind != "admin")
    {
        res.send("FAIL")
        return;
    }
    await updateAdminConfig(config, db);
    res.json({ "message": "OK"});

});

exports.router = router;