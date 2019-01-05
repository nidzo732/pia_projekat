var express = require("express");
var ObjectId=require("mongodb").ObjectId;
var crypto_utils = require("./crypto_utils");
var db = require("./db");
var users = require("./users");
var router = express.Router();

router.get("/search/:name/:city/:area", async (req, res) => {
    let client = await db.getClient();
    try {
        let query = { kind: "company" };
        let name = req.params.name;
        let city = req.params.city;
        let area = req.params.area;
        if (name && name.trim()) {
            query["companyInfo.name"] = { $regex: name.trim(), $options: "i" };
        }
        if (city && city.trim()) {
            query["companyInfo.city"] = { $regex: city.trim(), $options: "i" };
        }
        if (area && area.trim()) {
            query["companyInfo.area"] = { $regex: area.trim(), $options: "i" };
        }
        let db = client.db("jobfair");
        let result = await db.collection("users").find(query,
            { projection: { username: 1, companyInfo: 1 } }).toArray();
        res.json({ "message": "OK", payload: result });
    }
    finally {
        client.close();
    }
})

router.get("/details/:name", async (req, res) => {
    let client = await db.getClient();
    try {
        let name = req.params.name;
        let db = client.db("jobfair");
        let result = await db.collection("users").findOne({ username: name, kind: "company" },
            { projection: { username: 1, companyInfo: 1 } });
        res.json({ "message": "OK", payload: result });
    }
    finally {
        client.close();
    }
});
function validOffer(offer) {
    let offerTypes = ["Job", "Internship"];
    if (!offer) return "FAIL";
    if (!offer.description) return "FAIL";
    if (offer.type == null || offerTypes.indexOf(offer.type) == -1) return "FAIL";
    let deadline = new Date(offer.deadline);
    if (isNaN(deadline.getDate())) return "FAIL";
    if (offer.files && offer.files.length > 0) {
        for (var i = 0; i < offer.files.length; i++) {
            let file = offer.files[i];
            if (!file.name || !file.content64 || !file.mimeType) {
                return "FAIL";
            }
        }
    }
    return "OK";
}
router.post("/newoffer", async (req, res) => {
    let client = await db.getClient();
    try {
        let db = client.db("jobfair");
        let body = req.body;
        let offer = body.payload;
        let user = await users.getUserByToken(body.token, db);
        if (user == null || user.kind != "company") {
            res.send("FAIL")
            return;
        }
        if (validOffer(offer) != "OK") {
            res.json({ "message": validOffer(offer) });
            return;
        }
        offer.company = user.username;
        offer.companyName = user.companyInfo.name;
        await db.collection("offers").insertOne(offer);
        res.json({ "message": "OK" });
    }
    finally {
        client.close();
    }
});
function getIsoNow() {
    let now = new Date();
    let year = now.getFullYear();
    let month = "" + (now.getMonth() + 1);
    while (month.length < 2) month = "0" + month;
    let day = "" + now.getDate();
    while (day.length < 2) day = "0" + day;
    return year + "-" + month + "-" + day;
}

router.get("/offers/:company?", async (req, res) => {
    let client = await db.getClient();
    try {
        let db = client.db("jobfair");
        let company = req.params.company;
        let query = { deadline: { $gte: getIsoNow() } };

        if (company) {
            query["company"] = company;
        }
        let result = await db.collection("offers").find(query, { projection: { "files.content64": 0 } }).toArray();
        res.json({ message: "OK", payload: result });
    }
    finally {
        client.close();
    }
})
router.get("/offerfile/:offerid/:fileindex", async (req, res) => {
    let client = await db.getClient();
    try {
        let db = client.db("jobfair");
        let offer = req.params.offerid;
        let fileindex = req.params.fileindex;
        let query = { _id: ObjectId(offer) };
        let result = await db.collection("offers").findOne(query);
        if (result == null || result.files == null
            || result.files.length <= fileindex) {
            res.status(404);
            res.send("FAIL");
            return;
        }
        let file=result.files[fileindex];
        let buffer=Buffer.from(file.content64, "base64");
        let mimeType=file.mimeType;
        res.writeHead(200, {
            'Content-Type': mimeType,
            'Content-Length': buffer.length
         });
         res.end(buffer);
    }
    finally {
        client.close();
    }
})

exports.router = router;