// ============================================
// This module handles the login according to
// the data that is presented.
// ============================================



module.exports = function () {
    this.mongo = require("mongodb").MongoClient;
    this.url = "mongodb://localhost:27017/";

    this.findUser = async (username, password) => {
        let db = await mongo.connect(this.url, { useNewUrlParser: true });
        let dbo = await db.db("chat-app");
        let match = await dbo.collection("users").find({ 
            "username": username,
            "password": password 
        }).toArray();
        await db.close();

        if (match.length > 1)
            throw err;

        if (match[0] === undefined)
            return false;

        return match[0];
    }

    this.getUserRole = async username => {
        let db = await mongo.connect(this.url, { useNewUrlParser: true });
        let dbo = await db.db("chat-app");
        let res = await dbo.collection("users").find({ "username": username }).toArray();
        let role = res[0].permissions;
        await db.close();
        return role;
    }

    return this;
}