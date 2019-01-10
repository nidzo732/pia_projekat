var express = require("express");
var ObjectId = require("mongodb").ObjectId;
var crypto_utils = require("./crypto_utils");
var getDb = require("./db").getDb;
var requireUser = require("./users").requireUser;
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

router.get("/searchoffers/:cname/:jname/:kind", async (req, res) =>
{
    let query = { };
    let cname = req.params.cname;
    let jname = req.params.jname;
    let kind = req.params.kind;
    if (cname && cname.trim())
    {
        query["companyName"] = { $regex: cname.trim(), $options: "i" };
    }
    if (jname && jname.trim())
    {
        query["description"] = { $regex: jname.trim(), $options: "i" };
    }
    if (kind && kind.trim())
    {
        query["type"] = kind;
    }
    let db = await getDb();
    let result = await db.collection("offers").find(query,
        { projection: { files: 0 } }).sort({ deadline: -1 }).toArray();
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
    let user = requireUser(req, "company");
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

router.get("/offers/:company?", async (req, res) =>
{
    let db = await getDb();
    let company = req.params.company;
    let query = {};

    if (company)
    {
        query["company"] = company;
    }
    let result = await db.collection("offers").find(query, { projection: { "files.content64": 0 } }).sort({ deadline: -1 }).toArray();
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

router.post("/applications", async (req, res) =>
{
    let db = await getDb();
    let body = req.body;
    let user = requireUser(req, "company");
    let offerId = req.body.payload.offerId;
    let offer = await db.collection("offers").findOne({ _id: ObjectId(offerId) });
    if (!offer || offer.company != user.username)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let applications = await db.collection("applications").find({ offerId: offerId }, { projection: { "coverLetterUpload.content64": 0 } }).toArray();
    res.json({ message: "OK", payload: applications });
});

router.get("/scores/:id", async (req, res) =>
{
    let db = await getDb();
    let offerId = req.params.id;
    let offer = await db.collection("offers").findOne({ _id: ObjectId(offerId) });
    if (!offer)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let applications = await db.collection("applications").find({ offerId: offerId }, 
        { projection: { "coverLetterUpload": 0, "coverLetter":0 } }).toArray();
    res.json({ message: "OK", payload: applications });
});
router.post("/application", async (req, res) =>
{
    let db = await getDb();
    let body = req.body;
    let user = requireUser(req, "company");
    let id = req.body.payload.id;
    let application = await db.collection("applications").findOne({ _id: ObjectId(id) }, { projection: { "coverLetterUpload.content64": 0 } });
    if (!application)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let offer = await db.collection("offers").findOne({ _id: ObjectId(application.offerId) });
    if (!offer || offer.company != user.username)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    res.json({ message: "OK", payload: application });
});
router.post("/coverletter", async (req, res) =>
{
    let db = await getDb();
    let body = req.body;
    let user = requireUser(req, "company");
    let id = req.body.payload.id;
    let application = await db.collection("applications").findOne({ _id: ObjectId(id) });
    if (!application || !application.coverLetterUpload)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let offer = await db.collection("offers").findOne({ _id: ObjectId(application.offerId) });
    if (!offer || offer.company != user.username)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    res.json({ message: "OK", payload: application.coverLetterUpload });
});

router.post("/applicantinfo", async (req, res) =>
{
    let db = await getDb();
    let body = req.body;
    let user = requireUser(req, "company");
    let id = req.body.payload.id;
    let application = await db.collection("applications").findOne({ _id: ObjectId(id) });
    if (!application)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let offer = await db.collection("offers").findOne({ _id: ObjectId(application.offerId) });
    if (!offer || offer.company != user.username)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let applicant = await db.collection("users").findOne({ username: application.username },
        {
            projection:
            {
                "username": 1,
                "humanInfo.firstName": 1,
                "humanInfo.lastName": 1,
                "humanInfo.email": 1,
                "humanInfo.phone": 1,
                "humanInfo.studyYear": 1,
                "humanInfo.graduated": 1,
                "humanInfo.cv": 1,
            }
        }
    );
    res.json({ message: "OK", payload: applicant });
});

router.post("/applicationstatus", async (req, res) =>
{
    let db = await getDb();
    let body = req.body;
    let user = requireUser(req, "company");
    let id = req.body.payload.id;
    let accepted = req.body.payload.accepted;
    let application = await db.collection("applications").findOne({ _id: ObjectId(id) });
    if (!application)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let offer = await db.collection("offers").findOne({ _id: ObjectId(application.offerId) });
    if (!offer || offer.company != user.username)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    if (accepted)
    {
        application.status = "Accepted";
    }
    else
    {
        application.status = "Rejected";
    }
    application.timestamp=new Date();
    await db.collection("applications").updateOne(
        { _id: application._id },
        { $set: { status: application.status, timestamp:application.timestamp } });
    res.json({ message: "OK" });
});
router.post("/getfairapplication", async (req, res)=>{
    let db = await getDb();
    let body = req.body;
    let user = requireUser(req, "company");
    let id=body.payload.id;
    let application=await db.collection("fair_applications").findOne({company:user.username, fair:id});
    res.json({message:"OK", payload:application});
});
function validApplication(application, fair)
{
    if(!application.fair) return "FAIL";
    if(application.package==null) return "FAIL";
    if(application.package<0 || application.package>=fair.packages.Packages.length)
    {
        return "FAIL";
    }
    let result="OK";
    if(application.additions==null) return "FAIL";
    if(application.additions)
    {
        application.additions.forEach((x,y)=>{
            if(x==null || x<0 || x>fair.packages.Additional.length)
            {
                result="FAIL";
            }
        });
    }
    return result;
}

router.post("/fairapply", async (req, res)=>{
    let db = await getDb();
    let body = req.body;
    let user = requireUser(req, "company");
    let application=body.payload;
    let fair=await db.collection("fairs").findOne({_id:ObjectId(application.fair)});
    if(fair==null)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let deadline=new Date(fair.Fairs[0].Deadline);
    let now=new Date();
    if(deadline<now)
    {
        res.json({message:"Deadline has expired"});
        return;
    }
    if(validApplication(application, fair)!="OK")
    {
        res.json({message:validApplication(application, fair)});
        return;
    }

    let oldApplication=await db.collection("fair_applications").findOne({company:user.username, fair:application.fair});
    if(oldApplication)
    {
        if(oldApplication.status!="Pending")
        {
            res.json({message:"Your application has already been "+oldApplication.status+" you can't change it now"});
            return;
        }
        await db.collection("fair_applications").deleteOne({_id:oldApplication._id});
    }
    application.status="Pending";
    application.companyName=user.companyInfo.name;
    await db.collection("fair_applications").insertOne(application);
    res.json({message:"OK"});
});

exports.router = router;