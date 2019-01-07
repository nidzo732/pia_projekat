var express = require("express");
var ObjectId = require("mongodb").ObjectId;
var crypto_utils = require("./crypto_utils");
var getDb = require("./db").getDb;
var users = require("./users");
var router = require("express-promise-router")();

router.get("/search/:name/:city/:area", async (req, res) =>
{
    let query = { kind: "company" };
    let name = req.params.name;
    let city = req.params.city;
    let area = req.params.area;
    if (name && name.trim())
    {
        query["companyInfo.name"] = { $regex: name.trim(), $options: "i" };
    }
    if (city && city.trim())
    {
        query["companyInfo.city"] = { $regex: city.trim(), $options: "i" };
    }
    if (area && area.trim())
    {
        query["companyInfo.area"] = { $regex: area.trim(), $options: "i" };
    }
    let db = await getDb();
    let result = await db.collection("users").find(query,
        { projection: { username: 1, companyInfo: 1 } }).toArray();
    res.json({ "message": "OK", payload: result });
})

router.get("/details/:name", async (req, res) =>
{

    let name = req.params.name;
    let db = await getDb();
    let result = await db.collection("users").findOne({ username: name, kind: "company" },
        { projection: { username: 1, companyInfo: 1 } });
    res.json({ "message": "OK", payload: result });

});
function validOffer(offer)
{
    let offerTypes = ["Job", "Internship"];
    if (!offer) return "FAIL";
    if (!offer.description) return "FAIL";
    if (!offer.type || offerTypes.indexOf(offer.type) == -1) return "FAIL";
    let deadline = new Date(offer.deadline);
    if (isNaN(deadline.getDate())) return "FAIL";
    if (offer.files && offer.files.length > 0)
    {
        for (var i = 0; i < offer.files.length; i++)
        {
            let file = offer.files[i];
            if (!file.name || !file.content64 || !file.mimeType)
            {
                return "FAIL";
            }
        }
    }
    return "OK";
}
router.post("/newoffer", async (req, res) =>
{

    let db = await getDb();
    let body = req.body;
    let offer = body.payload;
    let user = await users.getUserByToken(body.token, db);
    if (!user || user.kind != "company")
    {
        res.send("FAIL")
        return;
    }
    if (validOffer(offer) != "OK")
    {
        res.json({ "message": validOffer(offer) });
        return;
    }
    offer.company = user.username;
    offer.companyName = user.companyInfo.name;
    await db.collection("offers").insertOne(offer);
    res.json({ "message": "OK" });

});
function getIsoNow()
{
    let now = new Date();
    let year = now.getFullYear();
    let month = "" + (now.getMonth() + 1);
    while (month.length < 2) month = "0" + month;
    let day = "" + now.getDate();
    while (day.length < 2) day = "0" + day;
    return year + "-" + month + "-" + day;
}

router.get("/offers/:company?", async (req, res) =>
{
    let db = await getDb();
    let company = req.params.company;
    let query = { deadline: { $gte: getIsoNow() } };

    if (company)
    {
        query["company"] = company;
    }
    let result = await db.collection("offers").find(query, { projection: { "files.content64": 0 } }).toArray();
    res.json({ message: "OK", payload: result });

})
router.get("/offer/:id?", async (req, res) =>
{
    let db = await getDb();
    let id = req.params.id;
    let query = { _id: ObjectId(id) };
    let result = await db.collection("offers").findOne(query, { projection: { "files.content64": 0 } });
    res.json({ message: "OK", payload: result });

})
router.get("/offerfile/:offerid/:fileindex", async (req, res) =>
{
    let db = await getDb();
    let offer = req.params.offerid;
    let fileindex = req.params.fileindex;
    let query = { _id: ObjectId(offer) };
    let result = await db.collection("offers").findOne(query);
    if (!result || result.files == null
        || result.files.length <= fileindex)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let file = result.files[fileindex];
    let buffer = Buffer.from(file.content64, "base64");
    let mimeType = file.mimeType;
    res.writeHead(200, {
        'Content-Type': mimeType,
        'Content-Length': buffer.length
    });
    res.end(buffer);

})

router.post("/applications", async (req, res)=>{
    let db = await getDb();
    let body=req.body;
    let user=await users.getUserByToken(body.token, db);
    if(!user || user.kind!="company")
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let offerId = req.body.payload.offerId;
    let offer=await db.collection("offers").findOne({_id:ObjectId(offerId)});
    if(!offer || offer.company!=user.username)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let applications = await db.collection("applications").find({offerId:offerId}, { projection: { "coverLetterUpload.content64":0 } }).toArray();
    res.json({message:"OK", payload:applications});
});
router.post("/application", async (req, res)=>{
    let db = await getDb();
    let body=req.body;
    let user=await users.getUserByToken(body.token, db);
    if(!user || user.kind!="company")
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let id = req.body.payload.id;
    let application=await db.collection("applications").findOne({_id:ObjectId(id)}, { projection: { "coverLetterUpload.content64":0 } });
    if(!application)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let offer = await db.collection("offers").findOne({_id:ObjectId(application.offerId)});
    if(!offer || offer.company!=user.username)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    res.json({message:"OK", payload:application});
});
router.post("/coverletter", async (req, res)=>{
    let db = await getDb();
    let body=req.body;
    let user=await users.getUserByToken(body.token, db);
    if(!user || user.kind!="company")
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let id = req.body.payload.id;
    let application=await db.collection("applications").findOne({_id:ObjectId(id)});
    if(!application || !application.coverLetterUpload)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let offer = await db.collection("offers").findOne({_id:ObjectId(application.offerId)});
    if(!offer || offer.company!=user.username)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    res.json({message:"OK", payload:application.coverLetterUpload});
});

exports.router = router;