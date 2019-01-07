
var mongoClient = require("mongodb").MongoClient;

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
module.exports.getDb = getDb;