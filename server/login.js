// login.js
// Dependency of `server.js`.
// Handles logins and user role requests.

module.exports = function () {
    this.mongo = require("mongodb").MongoClient;
    this.url = "mongodb://localhost:27017/";

    // Returns a truthy true if username/password combination is valid.
    // Takes a username and a password.
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

    // Returns a user role (i.e. 0, 1, or 2).
    // Takes a username.
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