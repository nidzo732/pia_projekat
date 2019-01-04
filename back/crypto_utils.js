var crypto=require("crypto");
async function kdf2Gen(password)
{
    return new Promise((resolve, reject)=>{
        let salt=crypto.randomBytes(32);
        crypto.pbkdf2(password, salt, 10000, 512, "sha512", (err, key)=>{
            resolve(key.toString("base64")+"$"+salt.toString("base64"));
        });
    });
}
async function kdf2Test(password, hash)
{
    let testKey=hash.split("$")[0];
    let testSalt=Buffer.from(hash.split("$")[1], "base64");
    return new Promise((resolve, reject)=>{
        crypto.pbkdf2(password, testSalt, 10000, 512, "sha512", (err, key)=>{
            resolve(key.toString("base64")==testKey);
        });
    });
}
function randString64(len)
{
    return crypto.randomBytes(len).toString("base64");
}
exports.kdf2Gen=kdf2Gen;
exports.kdf2Test=kdf2Test;
exports.randString64=randString64;