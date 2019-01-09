var express = require("express");
var ObjectId = require("mongodb").ObjectId;
var crypto_utils = require("./crypto_utils");
var getDb = require("./db").getDb;
var users = require("./users");
var router = require("express-promise-router")();

router.get("/fair/:id", async (req, res) =>
{
    let db = await getDb();
    let id = req.params.id;
    let fair = await db.collection("fairs").findOne({ _id: ObjectId(id) }, { projection: { logo: 0 } });
    res.json({ message: "OK", payload: fair });
});

router.get("/fairs", async (req, res) =>
{
    let db = await getDb();
    let fairs = await db.collection("fairs").find({}, { projection: { logo: 0 } }).sort({ deadline: -1 }).toArray()
    res.json({ message: "OK", payload: fairs });
});
router.get("/fairpicture/:id", async (req, res) =>
{
    let db = await getDb();
    let id = req.params.id;
    let fair = await db.collection("fairs").findOne({ _id: ObjectId(id) }, { projection: { logo: 1 } });
    if (fair == null)
    {
        res.status(404);
        res.send("FAIL");
    }
    let buffer = Buffer.from(fair.logo.content64, "base64");
    res.writeHead(200, {
        'Content-Type': fair.logo.mimeType,
        'Content-Length': buffer.length
    });
    res.end(buffer);
    return;
});

exports.router = router;