// channels.js
// Dependency of `groups.js`.
// Handles channels creation, deletion and get requests.

module.exports = () => {
    this.mongo = require("mongodb").MongoClient;
    this.url = "mongodb://localhost:27017/";

    // Creates a channel, and returns a truthy value corresponding to success.
    // The channel contains no members by default.
    // Takes a group name and a channel name.
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

    // Deletes a channel, and returns a truthy value corresponding to success.
    // Takes a group name and a channel name.
    this.deleteChannel = async (channelName) => {
        let db = await mongo.connect(this.url, { useNewUrlParser: true });
        let dbo = await db.db("chat-app");
        let res = await dbo.collection("channels").deleteOne({ "name": channelName });
        await db.close();
        return res;
    }

    // Retrieves a channel list corresponding to a username, group and role.
    // Takes a username, group name and a role.
    this.getChannels = async (username, group, role) => {
        let db = await mongo.connect(this.url, { useNewUrlParser: true });
        let dbo = await db.db("chat-app");

        // 1 If the role is super-admin, return all the channels.
        // 2 If the role is group-admin, return all the channels.
        // 3 If the role is user, return all the channels where the user is a member of that group.
        let searchbase = { "group": group };
        if (role == 0)
            searchbase += { "members": username };
        
        let channels = await dbo.collection("channels").find(searchbase).toArray();
        await db.close();
        return channels;
    }

    return this;
}