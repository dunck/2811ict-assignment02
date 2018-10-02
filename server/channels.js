// ============================================
// This module is responsible for joining the user's 
// groups and channels according to the user's 
// responsibilities
// ============================================
module.exports = () => {
    this.mongo = require("mongodb").MongoClient;
    this.url = "mongodb://localhost:27017/";

    this.createChannel = async (groupName, channelName) => {
        let db = await mongo.connect(this.url, { useNewUrlParser: true });
        let dbo = await db.db("chat-app");

        let channel = {
            'name': channelName,
            'group': groupName,
            'members': []
        }

        let res = await dbo.collection("channels").insertOne(channel, { "upsert": "true" });
        console.log(`Channel (possibly re)created. New channel list for ${groupName}:`);
        console.log(await dbo.collection("channels").find({ "group": groupName }).toArray());
        await db.close();
        return res;
    }

    this.deleteChannel = async (channelName) => {
        let db = await mongo.connect(this.url, { useNewUrlParser: true });
        let dbo = await db.db("chat-app");
        let res = await dbo.collection("channels").deleteOne({ "name": channelName });
        await db.close();
        return res;
    }

    // Get all the channels a user has access for a given group and role
    this.getChannels = async (username, group, role) => {
        // console.log(username);
        // console.log(group);
        // console.log(role);
        let db = await mongo.connect(this.url, { useNewUrlParser: true });
        let dbo = await db.db("chat-app");

        // 1 If the role is super-admin, return all the channels.
        // 2 If the role is group-admin, return all the channels.
        // 3 If the role is user, return all the channels where the user is a member of that group.
        let searchbase = { "group": group };
        if (role == 0)
            searchbase += { "members": username };
        console.log(`Searchbase:`);
        
        // console.log(searchbase);
        let channels = await dbo.collection("channels").find(searchbase).toArray();
        // console.log(channels);
        await db.close();
        return channels;
    }

    return this;
}