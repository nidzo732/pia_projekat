
var mongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

const connString = "mongodb://127.0.0.1:4243/jobfair";

let client = null;

async function getClient() {
    var client = await mongoClient.connect(connString, {
        poolSize: 5,
        autoReconnect: true,
        useNewUrlParser: true,
    });
    return client;
}
async function getDb() {
    if (client == null) client = await getClient();
    return client.db("jobfair");
}

function getDefaultConfig()
{
    return {
        cvDeadline:5
    };
}

async function getAdminConfig(db)
{
    let configs = await db.collection("config").find().toArray();
    if(!configs || configs.length==0) return getDefaultConfig();
    else return configs[0];
}
async function updateAdminConfig(cfg, db)
{
    let existingConfig=await getAdminConfig(db);
    if(existingConfig._id)
    {
        await db.collection("config").updateMany({_id:ObjectId(existingConfig._id)},
        {
            $set:{
                cvDeadline:cfg.cvDeadline
            }
        });
    }
    else
    {
        await db.collection("config").insertOne(cfg);
    }
}

exports.getAdminConfig=getAdminConfig;
exports.updateAdminConfig=updateAdminConfig;
module.exports.getDb = getDb;