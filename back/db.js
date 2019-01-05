
var mongoClient = require("mongodb").MongoClient;

const connString="mongodb://127.0.0.1:4243/jobfair";

async function getClient()
{
    var client = await mongoClient.connect(connString, {
        poolSize:5,
        autoReconnect:true,
        useNewUrlParser:true
    });
    return client;
}
module.exports.getClient=getClient