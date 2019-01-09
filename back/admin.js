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

router.post("/postfair", async (req, res) =>
{
    let db = await getDb();
    let body = req.body;
    let fair = body.payload;
    let user = await users.getUserByToken(body.token, db);
    if (!user || user.kind != "admin")
    {
        res.send("FAIL")
        return;
    }
    if(fair._id)
    {
        let id=fair._id;
        delete fair._id;
        await db.collection("fairs").updateOne({_id:ObjectId(id)}, {$set:fair});
    }
    else
    {
        await db.collection("fairs").insertOne(fair);
    }
    res.json({ "message": "OK"});
});

router.post("/getfair", async (req, res) =>
{
    let db = await getDb();
    let body = req.body;
    let id = body.payload.id;
    let user = await users.getUserByToken(body.token, db);
    if (!user || user.kind != "admin")
    {
        res.send("FAIL")
        return;
    }
    let fair=await db.collection("fairs").findOne({_id:ObjectId(id)});
    res.json({"message":"OK", payload:fair});
});

exports.router = router;