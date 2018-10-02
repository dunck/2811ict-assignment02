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

var url = "mongodb://localhost:27017/";

// CORS
// We are enabling CORS so that our 'ng serve' Angular server can still access
// our Node server. 
const cors = require('cors')
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
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'../angular-app/dist/angular-app/index.html'))
});
app.get('/home', function(req,res){
    res.sendFile(path.join(__dirname,'../angular-app/dist/angular-app/index.html'))
});


app.post('/api/login', async (req, res) => {
    console.log(`Processing login for '${req.body.username}'.`);
    let match = await findUser(req.body.username);

    // Check to see if we have a match, get groups if true
    if (match === false) {
        console.log(`Login failed.`);
    } else {
        console.log(`Login suceeded.`);
        match.groups = await groups.getGroups(match.username, match.permissions);
        // console.log(match.groups[0].channels[0]);
    }

    res.send(match);
});

// Group APIs
app.post('/api/groups', function(req,res){
    // We want to authenticate again -- usually you'd use a token
    fs.readFile(dataFile, dataFormat, function(err, data){
        data = JSON.parse(data);
        let username = req.body.username; 
        login.data = data;
        let match = login.findUser(username);
        
        // Check to see if we got a match, get groups if true
        if(match !== false){
            groups.data = data;
            match.groups = groups.getGroups(username, match.permissions);
        }
        res.send(match);
    });
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

app.delete('/api/group/delete/:groupname', function(req, res){
    let groupName = req.params.groupname;

app.post('/api/channel/create', async (req, res) => {
    let groupName = req.body.groupName;
    let channelName = req.body.channelName;
    console.log(`Received request to create channel '${channelName}' under '${groupName}'.`);
    let ret = false;
    if (channelName != '' && channelName != undefined && groupName != '' && groupName != undefined) {
        ret = await channels.createChannel(groupName, channelName);
    }
    res.send(ret);
});
    // Read the JSON file to get the current data
    fs.readFile(dataFile, dataFormat, function(err, data){
        let readData = JSON.parse(data);
        groups.data = readData.groups;
        readData.groups = groups.deleteGroup(groupName);
        console.log(readData);
        let json = JSON.stringify(readData);

        // Write the updated data to JSON
        fs.writeFile(dataFile, json, dataFormat, function(err, d){
            res.send(true);
            console.log("Deleted group: " + groupName);
        });
    });
});

app.post('/api/group/create', function(req, res){
    let groupName = req.body.newGroupName
    if(groupName == '' || groupName == 'undefined' || groupName == null){
        res.send(false);
    } else {
        // Read the JSON file to get an updated list of groups
        fs.readFile(dataFile, dataFormat, function(err, data){
            let readData = JSON.parse(data);
            let g = readData.groups;
    
            let newGroup = {
                'name': req.body.newGroupName,
                'admins':[],
                'members':[]
            }
            g.push(newGroup)
            readData.groups = g;
            let json = JSON.stringify(readData);
            
            // Write the updated data to the JSON file.
            fs.writeFile(dataFile, json, dataFormat, function(err, data){
                res.send(true);
                console.log("Created new group: " + req.body.newGroupName);
            });
        });
    }
})
 
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


// HTTP Listener
app.listen(3000, function(){
    console.log('Server runing');
})
module.exports = app;