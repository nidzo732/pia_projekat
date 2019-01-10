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
    let user = users.requireUser(req, "admin");
    let config = await getAdminConfig(db)
    res.json({ "message": "OK", payload: config });

});

router.post("/setconfig", async (req, res) =>
{
    let db = await getDb();
    let body = req.body;
    let config = body.payload.config;
    let user = users.requireUser(req, "admin");
    await updateAdminConfig(config, db);
    res.json({ "message": "OK" });

});

router.post("/postfair", async (req, res) =>
{
    let db = await getDb();
    let body = req.body;
    let fair = body.payload;
    let user = users.requireUser(req, "admin");
    if (fair._id)
    {
        let id = fair._id;
        delete fair._id;
        await db.collection("fairs").updateOne({ _id: ObjectId(id) }, { $set: fair });
    }
    else
    {
        await db.collection("fairs").insertOne(fair);
    }
    res.json({ "message": "OK" });
});

router.post("/getfair", async (req, res) =>
{
    let db = await getDb();
    let body = req.body;
    let id = body.payload.id;
    let user = users.requireUser(req, "admin");
    let fair = await db.collection("fairs").findOne({ _id: ObjectId(id) });
    res.json({ "message": "OK", payload: fair });
});

router.post("/getapplications", async (req, res) =>
{
    let db = await getDb();
    let body = req.body;
    let id = body.payload.id;
    let user = users.requireUser(req, "admin");
    let applications = await db.collection("fair_applications").find({ fair: id }).toArray();
    res.json({ message: "OK", payload: applications })
});

router.post("/managefair", async (req, res)=>{
    let db = await getDb();
    let body = req.body;
    let id = body.payload.id;
    let user = users.requireUser(req, "admin");

    let applications=body.payload.applications;
    let fair=body.payload.fair;

    await db.collection("fairs").updateOne({_id:ObjectId(fair._id)}, {$set:{CompanyEvents:fair.CompanyEvents}});

    for(let i=0;i<applications.length;i++)
    {
        let x=applications[i];
        await db.collection("fair_applications").updateOne({_id:ObjectId(x._id)}, {
            $set:{status:x.status, adminComment:x.adminComment}});
    }
    res.json({ message: "OK"})
});

exports.router = router;