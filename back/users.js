var express = require("express");
var crypto_utils = require("./crypto_utils");
var ObjectId = require("mongodb").ObjectId;
var getDb = require("./db").getDb;
var getAdminConfig = require("./db").getAdminConfig;
var router = require("express-promise-router")();
var jimp = require("jimp");


async function getUserByToken(token, db)
{
    let tokenObj = await db.collection("tokens").findOne({ token: token });
    if (tokenObj == null) return null;
    return getUserByName(tokenObj.username, db);
}

async function getUserByName(username, db)
{
    let user = await db.collection("users").findOne({ username: username }, { projection: { picture: 0, pictureType: 0 } });
    return user;
}
async function getUserPicture(username, db)
{
    let user = await db.collection("users").findOne({ username: username }, { projection: { picture: 1, pictureType: 1 } });
    return user;
}

function requireUser(request, kind)
{
    if (!request.user)
    {
        throw "User required but not found";
    }
    if (kind)
    {
        if (request.user.kind != kind)
        {
            throw "User kind did not match, required " + kind + " got " + user.kind;
        }
    }
    return request.user;
}

function okPassword(password)
{
    var upcase = new RegExp(/[A-Z]/);
    var lcase = new RegExp(/.*[a-z].*[a-z].*[a-z].*/)
    var startLetter = new RegExp(/^[A-Za-z].+/);
    var digit = new RegExp(/[0-9]/);
    var spec = new RegExp(/[\#\*\.\!\?\$]/);
    let message = "Pravila za lozinku: treba da ima najmanje 8 karaktera, a najviše 12 karaktera. Minimalan\
    broj velikih slova je 1, minimalan broj malih slova je 3, minimalan broj numerika je 1 i minimalan\
    broj specijalnih znakova iz skupa (#*.!?$) je 1. Početni karakter mora biti slovo, malo ili veliko.\
    Ne smeju se naći dva uzastopna ista znaka"
    if (password.length < 8 || password.length > 12) return message;
    if (!upcase.test(password)) return message;
    if (!lcase.test(password)) return message;
    if (!startLetter.test(password)) return message;
    if (!spec.test(password)) return message;
    for (var i = 1; i < password.length; i++) if (password[i] == password[i - 1]) return message;
    return "OK";


}
function validateUserObject(user)
{
    var okAreas = ["IT", "Telecom", "Power systems", "Civil egineering", "Architecture", "Mechanical engineering"];
    if (!user.username || !user.password) return "FAIL1";
    if (user.kind != "human" && user.kind != "company") return "FAIL2";
    if (!user.picture) return "FAIL2";
    if (okPassword(user.password) != "OK") return okPassword(user.password);
    if (user.kind == "human")
    {
        if (!user.humanInfo) return "FAIL3";
        if (!user.humanInfo.firstName) return "FAIL4";
        if (!user.humanInfo.firstName) return "FAIL5";
        if (!user.humanInfo.email) return "FAIL6";
        if (!user.humanInfo.phone) return "FAIL7";
        if (!user.humanInfo.studyYear) return "FAIL8";
        if (typeof (user.humanInfo.studyYear) != "number") return "FAIL10";
        if (user.humanInfo.graduated == null) return "FAIL9";
    }
    else if (user.kind == "company")
    {
        if (!user.companyInfo) return "FAIL12";
        if (!user.companyInfo.name) return "FAIL13";
        if (!user.companyInfo.city) return "FAIL14";
        if (!user.companyInfo.director) return "FAIL15";
        if (!user.companyInfo.pib) return "FAIL16";
        if (!user.companyInfo.employeeCount) return "FAIL17";
        if (typeof (user.companyInfo.employeeCount) != "number") return "FAIL18";
        if (!user.companyInfo.email) return "FAIL19";
        if (!user.companyInfo.site) return "FAIL20";
        if (!user.companyInfo.area) return "FAIL21";
        if (!user.companyInfo.specialty) return "FAIL22";
        if (okAreas.indexOf(user.companyInfo.area) == -1) return "FAIL11";

    }
    return "OK";
}
async function setPwd(userObject, password)
{
    userObject.password = await crypto_utils.kdf2Gen(password);
}
async function testPwd(userObject, password)
{
    return await crypto_utils.kdf2Test(password, userObject.password);
}
async function setPicture(userObject)
{
    try
    {
        let picture = userObject.picture.split(",")[1];
        let ctype = userObject.picture.split(",")[0].split(":")[1].split(";")[0];
        if (ctype.indexOf("image/") != 0) return false;
        userObject.picture = picture;
        userObject.pictureType = ctype;
        let buffer = Buffer.from(picture, "base64");
        let image = await jimp.read(buffer);
        if (image.getWidth() < 100 || image.getWidth() > 300
            || image.getHeight() < 100 || image.getHeight() > 300)
        {
            return "Image size must be between 100x100 and 300x300";
        }
        
        return "OK";
    }
    catch(ex){
        console.error("Invalid picture uploaded");
        console.error(ex);
        return "Uploaded file is not a picture";
    }
}

router.post("/register", async (req, res) =>
{
    let db = await getDb();
    let existingUser = await getUserByName(req.body.payload.username, db);
    if (existingUser != null)
    {
        res.json({ message: "A user with that username already exists" });
        return;
    }
    if (validateUserObject(req.body.payload) != "OK")
    {
        res.json({ message: validateUserObject(req.body.payload) });
        return;
    }
    let user = req.body.payload;
    await setPwd(user, user.password);
    let setPictureResult=await setPicture(user);
    if (setPictureResult != "OK")
    {
        res.json({ message: setPictureResult });
        return;
    }
    await db.collection("users").insertOne(user);
    res.json({ message: "OK" });
});

router.post("/login", async (req, res) =>
{
    var body = req.body.payload;
    if (body.password == null || body.username == null) return;
    let db = await getDb();
    let user = await getUserByName(body.username, db);
    if (user == null || !(await testPwd(user, body.password)))
    {
        res.json({ message: "Invalid credentials" });
        return;
    }
    let token = { username: user.username, token: crypto_utils.randString64(32) };
    await db.collection("tokens").insertOne(token);
    user.token = token.token;
    user.password = null;
    let now = new Date();
    if (!user.cvDeadline || user.cvDeadline > now)
    {
        user.canFillCV = true;
    }
    else
    {
        user.canFillCV = false;
    }
    user.cvDeadline = null;
    res.json({
        message: "OK",
        payload: user
    });
})

router.post("/setpwd", async (req, res) =>
{
    let body = req.body;
    let db = await getDb();
    let user = await requireUser(req);
    if (!(await testPwd(user, body.payload.oldPassword)))
    {
        res.json({ message: "Old password invalid" });
        return;
    }
    if (okPassword(body.payload.newPassword) != "OK")
    {
        res.json({ message: okPassword(body.payload.newPassword) });
        return;
    }
    await setPwd(user, body.payload.newPassword);
    await db.collection("users").updateOne({ username: user.username }, { $set: { password: user.password } });
    res.json({ message: "OK" });
    return;
});

function validCV(cv)
{
    let allowedTypes = ["Job", "Internship"];
    if (!cv.type) return "FAIL";
    if (allowedTypes.indexOf(cv.type) == -1) return "FAIL";
    if (!cv.motherTongue) return "FAIL";
    if (cv.experience)
    {
        cv.experience.forEach(element =>
        {
            if (element.from > element.to) return "FAIL";
        });
    }
    if (cv.education)
    {
        cv.education.forEach(element =>
        {
            if (element.from > element.to) return "FAIL";
        });
    }
    return "OK";
}
router.post("/setcv", async (req, res) =>
{
    let body = req.body;
    let db = await getDb();
    let user = requireUser(req, "human");
    if (validCV(body.payload) != "OK")
    {
        res.json({ message: validCV(body.payload) });
        return;
    }
    let cv = body.payload;
    let cvDeadline = new Date();
    let config = await getAdminConfig(db);
    cvDeadline.setDate(config.cvDeadline + cvDeadline.getDate());
    let now = new Date();
    if (user.cvDeadline && user.cvDeadline < now)
    {
        res.json({ message: "CV entry deadline has expired" });
        return;
    }
    if (!user.cvDeadline || user.cvDeadline > cvDeadline)
    {
        user.cvDeadline = cvDeadline;
    }
    await db.collection("users").updateOne({ username: user.username }, { $set: { "humanInfo.cv": body.payload, "cvDeadline": user.cvDeadline } });
    res.json({ message: "OK" });
    return;
});
router.get("/picture/:username", async (req, res) =>
{
    let username = req.params.username;
    let db = await getDb();
    let user = await getUserPicture(username, db);
    if (user == null)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let buffer = Buffer.from(user.picture, "base64");
    res.writeHead(200, {
        'Content-Type': user.pictureType,
        'Content-Length': buffer.length
    });
    res.end(buffer);
    return;
});
function validApplication(application)
{
    if (!application.offerId) return "FAILOID";
    if (!application.coverLetter && !application.coverLetterUpload) return "FAILCL";
    if (application.coverLetterUpload)
    {
        let file = application.coverLetterUpload;
        if (!file.name || !file.content64 || !file.mimeType)
        {
            return "FAILF";
        }
    }
    return "OK";
}
router.post("/apply", async (req, res) =>
{
    let body = req.body;
    let db = await getDb();
    let user = requireUser(req, "human");
    if (user.humanInfo.cv == null)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let application = body.payload;
    if (validApplication(application) != "OK")
    {
        res.json({ message: validApplication(application) });
        return;
    }
    let offer = await db.collection("offers").findOne({
        _id: ObjectId(application.offerId)
    });
    if (offer == null)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let now = new Date();
    let deadline = new Date(offer.deadline);
    if (deadline < now)
    {
        res.status(404);
        res.send("FAIL");
        return;
    }
    let existingApplication = await db.collection("applications").findOne({
        offerId: application.offerId,
        username: user.username
    });
    if (existingApplication != null)
    {
        res.json({ message: "You have already applied to this offer" });
        return;
    }
    application.username = user.username;
    application.userLongName = user.humanInfo.firstName + " " + user.humanInfo.lastName;
    application.companyName = offer.companyName;
    application.status = "Pending";
    application.offerDescription = offer.description;
    await db.collection("applications").insertOne(application);
    res.json({ message: "OK" });
});
router.post("/myapplications", async (req, res) =>
{
    let body = req.body;
    let db = await getDb();
    let user = requireUser(req, "human");
    let applications = await db.collection("applications").find({ username: user.username }).toArray();
    res.json({ message: "OK", payload: applications });
})
router.post("/rateapp", async (req, res) =>
{
    let body = req.body;
    let db = await getDb();
    let user = requireUser(req, "human");
    let payload = body.payload;
    if (payload.rating < 1 || payload.rating > 10)
    {
        res.status(404);
        res.send("FAIL2");
        return;
    }
    let appId = payload.appId;
    let application = await db.collection("applications").findOne({ _id: ObjectId(appId) });
    if (application == null || application.username != user.username || application.status != "Accepted")
    {
        res.status(404);
        res.send("FAIL3");
        return;
    }
    let now = new Date();
    let stamp = application.timestamp;
    stamp.setMonth(stamp.getMonth() + 1);
    if (now < stamp)
    {
        res.status(404);
        res.send("FAIL4");
        return;
    }
    await db.collection("applications").updateOne({ _id: ObjectId(appId) }, { $set: { rating: payload.rating } });
    res.json({ message: "OK" })

});

exports.router = router;
exports.getUserByName = getUserByName;
exports.getUserByToken = getUserByToken;
exports.requireUser = requireUser;