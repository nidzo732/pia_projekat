
var mongoClient = require("mongodb").MongoClient;

const connString="mongodb://localhost:4243/jobfair";

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