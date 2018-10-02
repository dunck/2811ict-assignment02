// server.js
// Run with `node server.js`.
// Powers login, groups, and channels administrations.

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mongodb = require('mongodb');
const fs = require('fs');
const dataFile = './data.json';
const dataFormat = 'utf8';
const usercol = 'users';
const groupcol = 'groups';
const channelcol = 'channels';
const login = require('./login.js')();
const groups = require('./groups.js')();
const channels = require('./channels.js')();
const formidable = require('formidable');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors')

// CORS
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions))

// Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Routes
app.use(express.static(path.join(__dirname, '../angular-app/dist/angular-app')));

// Used for getting the basic router page.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../angular-app/dist/angular-app/index.html'))
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../angular-app/dist/angular-app/index.html'))
});

// Used for storing profile images.
app.use('/images', express.static(path.join(__dirname, './images')));

// Used for processing login attempts.
// Takes a username & password in the request body.
app.post('/api/login', async (req, res) => {
    // Params
    let username = req.body.username;
    let password = req.body.password;

    // Processing
    console.log(`Processing login for '${username}'.`);
    // findUser will return false if a bad username/password combination is given.
    let match = await login.findUser(username, password);

    if (match === false) {
        console.log(`Login failed.`);
    } else {
        console.log(`Login suceeded.`);
        match.groups = await groups.getGroups(match.username, match.permissions);
    }
    res.send(match);
});

// Used for retrieving groups for a specific user.
// Takes a username in the request body.
app.post('/api/groups', async (req, res) => {
    // Params
    let username = req.body.username;

    // Processing
    console.log(`Received request for groups under '${username}'.`)
    let match = {};
    match.groups = await groups.getGroups(username);
    console.log(`Returning ${match.groups.length} groups.`)
    res.send(match);
});

// Used for deleting groups.
// Takes the group name in the request parameters.
app.delete('/api/group/delete/:groupname', async (req, res) => {
    // Params
    let groupName = req.params.groupname;

    // Processing
    console.log(`Received request to delete group '${groupName}'.`);
    let ret = false;
    if (groupName != '' && groupName != 'undefined' && groupName != null) {
        ret = await groups.deleteGroup(groupName);
    }
    console.log(`Group deleted: ${res}.`);
    res.send(ret);
});

// Used for deleting channels.
// Takes the channel name in the request parameters.
app.delete('/api/channel/delete/:channelname', async (req, res) => {
    // Params
    let channelname = req.params.channelname;

    // Processing
    console.log(`Received request to delete channel '${channelname}'.`);
    let ret = false;
    if (channelname != '' && channelname != 'undefined' && channelname != null) {
        ret = await channels.deleteChannel(channelname);
    }
    console.log(`Channel deleted: ${res}.`);
    res.send(ret);
});

// Used for creating groups.
// Takes the channel name in the request parameters.
app.post('/api/group/create/:groupname', async (req, res) => {
    // Params
    let groupName = req.params.groupname;

    // Processing
    console.log(`Received request to create group '${groupName}'.`);
    let ret = false;
    if (groupName != '' && groupName != 'undefined' && groupName != null) {
        ret = await groups.createGroup(groupName);
    }
    res.send(ret);
});

// Used for creating channels.
// Takes the group name and channel name in the request parameters.
app.post('/api/channel/create', async (req, res) => {
    // Params
    let groupName = req.body.groupName;
    let channelName = req.body.channelName;

    // Processing
    console.log(`Received request to create channel '${channelName}' under '${groupName}'.`);
    let ret = false;
    if (channelName != '' && channelName != undefined && groupName != '' && groupName != undefined) {
        ret = await channels.createChannel(groupName, channelName);
    }
    res.send(ret);
});

// Used for uploading profile images.
// The request is a FormData object.
app.post('/api/images/upload', (req, res) => {
    var form = new formidable.IncomingForm({ uploadDir: './images' });
    form.keepExtensions = true;

    form.on('error', err => {
        throw err;
        res.send({
            result: "Failed",
            data: {},
            numberOfImages: 0,
            message: "Cannot upload images."
        });
    });

    form.on('field', (name, field) => {
        console.log("File upload initiated1.");
        file.path = form.uploadDir + "/" + "super" + ".png";
    });

    form.on('file', (field, file) => {
        res.send({
            result: "OK",
            data: { 'filename': file.name, 'size': file.size },
            numberOfImages: 1,
            message: "Upload successful."
        });
    });

    form.parse(req);
    res.send(true);
});

// Used for retrieving channels for a user.
// Takes the group name, username and user role in the request body
app.post('/api/channels', async (req, res) => {
    // Params
    let groupName = req.body.group;
    let username = req.body.username;
    let role = req.body.role;

    // Processing.
    console.log(`Received request to get channels under '${groupName}' for '${username}' with role ${role}.`);
    ret = await channels.getChannels(username, groupName, role);

    res.send(ret);
});

// Sockets setup.
io.on('connection', async socket => {
    // let mongo = require("mongodb").MongoClient;
    // let url = "mongodb://localhost:27017/";
    // let db = await mongo.connect(url, { useNewUrlParser: true });
    // let dbo = await db.db("chat-app");

    // Log whenever a user connects
    console.log('User connected.');

    // Log whenever a client disconnects from our websocket server
    socket.on('disconnect', () => {
        console.log('User disconnected.');
    });

    socket.on('message', message => {
        console.log("Message received: " + message);
        let pmsg = JSON.parse(message);
        // console.log("Inserting message into db.");
        // dbo.collection("chat").insertOne(message)
        io.emit('message', { type: 'new-message', data: { "username": pmsg.username, "message": pmsg.message } });
    });
});

// Initialize our websocket server on port 5000
http.listen(5000, () => console.log('Websockets listening...'));

// HTTP Listener on port 3000
app.listen(3000, () => console.log('Server listening...'));

module.exports = app;