// ============================================
// This module is responsible for joining the user's 
// groups and channels according to the user's 
// responsibilities
// ============================================


module.exports = () => {
    this.username;
    this.data;
    this.mongo = require("mongodb").MongoClient;
    this.url = "mongodb://localhost:27017/";
    this.channels = require('./channels.js')();
    this.login = require('./login.js')();

    // Find and delete a group by matching groupName to available data in this.data
    this.deleteGroup = async (groupName) => {
        let db = await this.mongo.connect(this.url, { useNewUrlParser: true });
        let dbo = await db.db("chat-app");
        let res = await dbo.collection("groups").deleteOne({ "name": groupName });
        await db.close();
        return res;
    }

    // Find and delete a group by matching groupName to available data in this.data
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

    // Return all groups where the username exists (or according to role)
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

        // Grab the channels for each group
        // console.log('Channels:');
        // for (let i = 0; i < groups.length; i++) {
        //     let channels = await this.channels.getChannels(username, groups[i], role);
        //     // console.log(channels);
        //     groups[i].channels = channels;
        // }
        // console.log('End channels.');

        return groups;
    }

    return this;
}