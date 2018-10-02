// group.js
// Dependency of `server.js`.
// Handles group creation, deletion and get requests.

module.exports = () => {
    this.username;
    this.data;
    this.mongo = require("mongodb").MongoClient;
    this.url = "mongodb://localhost:27017/";
    this.channels = require('./channels.js')();
    this.login = require('./login.js')();

    // Returns a truthy true if successfully deleted a group.
    // Takes a groupname.
    this.deleteGroup = async (groupName) => {
        let db = await this.mongo.connect(this.url, { useNewUrlParser: true });
        let dbo = await db.db("chat-app");
        let res = await dbo.collection("groups").deleteOne({ "name": groupName });
        await db.close();
        return res;
    }

    // Returns a truthy true if successfully crated a group.
    // The default admin of the group is 'super'.
    // Takes a groupname.
    this.createGroup = async (groupName) => {
        let db = await mongo.connect(this.url, { useNewUrlParser: true });
        let dbo = await db.db("chat-app");

        let group = {
            'name': groupName,
            'admins': ['super'],
            'members': []
        }

        // Don't create the group if it already exists.
        let exists = await dbo.collection("groups").find({ "name": groupName }).toArray();
        let res = false;
        if (exists.length == 0) {
            res = await dbo.collection("groups").insertOne(group);
            console.log(await dbo.collection("groups").find().toArray());
        }
        else {
            console.log(`Group already exists.`);
        }
        await db.close();
        return res;
    }
    
    // Returns a list of groups corresponding to a user.
    // Takes a username.
    this.getGroups = async username => {
        let db = await mongo.connect(this.url, { useNewUrlParser: true });
        let dbo = await db.db("chat-app");

        // 1 If the role is super-admin, return all the groups.
        // 2 If the role is group-admin, return all the groups.
        // 3 If the role is user, return all the groups where the user is a member.
        let role = await this.login.getUserRole(username);
        let searchbase = {};
        if (role == 0)
            searchbase = { "members": username };

        let groups = await dbo.collection("groups").find(searchbase).toArray();
        await db.close();

        return groups;
    }

    return this;
}