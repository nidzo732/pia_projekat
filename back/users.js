var express = require("express");
var crypto_utils = require("./crypto_utils");
var db = require("./db");
var router = express.Router();


async function getUserByToken(token, db) {
    let tokenObj = await db.collection("tokens").findOne({ token: token });
    if (tokenObj == null) return null;
    return getUserByName(tokenObj.username, db);
}

async function getUserByName(username, db) {
    let user = await db.collection("users").findOne({ username: username }, { projection: { picture: 0, pictureType:0 } });
    return user;
}
async function getUserPicture(username, db){
    let user = await db.collection("users").findOne({ username: username }, { projection: { picture: 1, pictureType:1 } });
    return user;
}

function okPassword(password) {
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
function validateUserObject(user) {
    var okAreas = ["IT", "Telecom", "Power systems", "Civil egineering", "Architecture", "Mechanical engineering"];
    if (!user.username || !user.password) return "FAIL1";
    if (user.kind != "human" && user.kind != "company") return "FAIL2";
    if (!user.picture) return "FAIL2";
    if (okPassword(user.password) != "OK") return okPassword(user.password);
    if (user.kind == "human") {
        if (!user.humanInfo) return "FAIL3";
        if (!user.humanInfo.firstName) return "FAIL4";
        if (!user.humanInfo.firstName) return "FAIL5";
        if (!user.humanInfo.email) return "FAIL6";
        if (!user.humanInfo.phone) return "FAIL7";
        if (!user.humanInfo.studyYear) return "FAIL8";
        if (typeof (user.humanInfo.studyYear) != "number") return "FAIL10";
        if (user.humanInfo.graduated == null) return "FAIL9";
    }
    else if (user.kind == "company") {
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
async function setPwd(userObject, password) {
    userObject.password = await crypto_utils.kdf2Gen(password);
}
async function testPwd(userObject, password) {
    return await crypto_utils.kdf2Test(password, userObject.password);
}
function setPicture(userObject)
{
    try
    {
        let picture=userObject.picture.split(",")[1];
        let ctype=userObject.picture.split(",")[0].split(":")[1].split(";")[0];
        if(ctype.indexOf("image/")!=0) return false;
        let buffer=Buffer.from(picture, "base64");
        userObject.picture=picture;
        userObject.pictureType=ctype;
        return true;
    }
    catch{
        console.error("Invalid picture uploaded");
        return false;
    }
}

router.post("/register", async (req, res) => {
    var client = await db.getClient();
    try {
        let db = client.db("jobfair");
        let existingUser = await getUserByName(req.body.payload.username, db);
        if (existingUser != null) {
            res.json({ message: "A user with that username already exists" });
            return;
        }
        if (validateUserObject(req.body.payload) != "OK") {
            res.json({ message: validateUserObject(req.body.payload) });
            return;
        }
        let user = req.body.payload;
        await setPwd(user, user.password);
        if(!setPicture(user)){
            res.json({ message: "FAILP" });
            return;
        }
        await db.collection("users").insertOne(user);
        res.json({ message: "OK" });
    }
    finally {
        client.close();
    }
});

router.post("/login", async (req, res) => {
    var client = await db.getClient();
    try {
        var body = req.body.payload;
        if (body.password == null || body.username == null) return;
        let db = client.db("jobfair");
        let user = await getUserByName(body.username, db);
        if (user == null || !(await testPwd(user, body.password))) {
            res.json({ message: "Invalid credentials" });
            return;
        }
        let token = { username: user.username, token: crypto_utils.randString64(32) };
        await db.collection("tokens").insertOne(token);
        user.token = token.token;
        user.password = null;
        res.json({
            message: "OK",
            payload: user
        });
    }
    finally {
        client.close();
    }
})

router.post("/setpwd", async (req, res) => {
    var client = await db.getClient();
    try {
        let body = req.body;
        let db = client.db("jobfair");
        let user = await getUserByToken(body.token, db);
        if (user == null) return "FAIL";
        if (!(await testPwd(user, body.payload.oldPassword))) {
            res.json({ message: "Old password invalid" });
            return;
        }
        if (okPassword(body.payload.newPassword) != "OK") {
            res.json({ message: okPassword(body.payload.newPassword) });
            return;
        }
        await setPwd(user, body.payload.newPassword);
        await db.collection("users").updateOne({ username: user.username }, { $set: { password: user.password } });
        res.json({ message: "OK" });
        return;
    }
    finally {
        client.close();
    }
});

function validCV(cv) {
    let allowedTypes = ["Job", "Internship"];
    if (!cv.type) return "FAIL";
    if (allowedTypes.indexOf(cv.type) == -1) return "FAIL";
    if (!cv.motherTongue) return "FAIL";
    if (cv.experience) {
        cv.experience.forEach(element => {
            if (element.from > element.to) return "FAIL";
        });
    }
    if (cv.education) {
        cv.education.forEach(element => {
            if (element.from > element.to) return "FAIL";
        });
    }
    return "OK";
}
router.post("/setcv", async (req, res) => {
    var client = await db.getClient();
    try {
        let body = req.body;
        let db = client.db("jobfair");
        let user = await getUserByToken(body.token, db);
        if (user == null || user.kind != "human") return "FAIL";
        if (validCV(body.payload) != "OK") {
            res.json({ message: validCV(body.payload) });
            return;
        }
        await db.collection("users").updateOne({ username: user.username }, { $set: { "humanInfo.cv": body.payload } });
        res.json({ message: "OK" });
        return;
    }
    finally {
        client.close();
    }
});
router.get("/picture/:username", async (req, res)=>{
    var client = await db.getClient();
    try {
        let username=req.params.username;
        let db = client.db("jobfair");
        let user = await getUserPicture(username, db);
        if (user == null)
        {
            res.status(404);
            res.send("FAIL");
            return;
        }
        let buffer=Buffer.from(user.picture, "base64");
        res.writeHead(200, {
            'Content-Type': user.pictureType,
            'Content-Length': buffer.length
         });
        res.end(buffer);
        return;
    }
    finally {
        client.close();
    }
});

exports.router = router;
exports.getUserByName=getUserByName;
exports.getUserByToken=getUserByToken;