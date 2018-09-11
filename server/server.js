const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express(); 
const fs = require('fs');
const dataFile = './data.json';
const dataFormat = 'utf8';


// CORS
const cors = require('cors')
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions))



// Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//var data = 
// Login Module
const login = require('./login.js')();
const groups = require('./groups.js')();

app.post('/api/login', function(req, res){
    fs.readFile(dataFile, dataFormat, function(err, data){
        data = JSON.parse(data);
        let username = req.body.username; 
        login.data = data;
        let match = login.findUser(username);
    
        if(match !== false){
            groups.data = data;
            match.groups = groups.getGroups(username, match.permissions);
        }
        res.send(match);
    });
});


// the "index" route, which serves the Angular app
app.use(express.static(path.join(__dirname, '../angular-app/dist/angular-app')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'../angular-app/dist/angular-app/index.html'))
});
app.get('/home', function(req,res){
    res.sendFile(path.join(__dirname,'../angular-app/dist/angular-app/index.html'))
});
 

// // API routes
// app.get('/api/users', function(req,res){
//     res.send(data.users);
// });
// app.post('/api/groups', function(req,res){
//     let username = req.body.username;
//     res.send(data.groups);
// });
// app.get('/api/rooms', function(req,res){
//     res.send(data.rooms);
// });
app.post('/api/group/create', function(req, res){
    let groupName = req.body.newGroupName
    if(groupName == '' || groupName == 'undefined' || groupName == null){
        res.send(false);
    } else {
        fs.readFile(dataFile, dataFormat, function(err, data){
            let readData = JSON.parse(data);
            let groups = readData.groups;
    
            let newGroup = {
                'name': req.body.newGroupName,
                'admins':[],
                'members':[]
            }
            groups.push(newGroup)
            readData.groups = groups;
            let json = JSON.stringify(readData);
            // console.log(newGroup);   
            fs.writeFile(dataFile, json, dataFormat, function(err, data){
                res.send(true);
                console.log("Created new group: " + req.body.newGroupName);
            });
    
            // let obj = {
            //     'name': req.body.newGroupName,
            //     'admins':[],
            //     'members':[]
            // }
            // let newGroup = JSON.stringify(obj);
            // fs.writeFile
            // console.log(obj);
            // res.send(true);
        });
    }
})
 


// HTTP Listener
app.listen(3000, function(){
    console.log('Server runing');
})
module.exports = app;