const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express(); 

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

var data = {
    'users': [
        {
            'username':'ryoma',
            'permissions':2,
        },{
            'username':'super',
            'permissions':2,
        },{
            'username':'group',
            'permissions':1,
        },{
            'username':'member1',
            'permissions':0,
        },{
            'username':'member2',
            'permissions':0,
        },

    ],
    'groups': [
        {
            'name':'Griffith Innovate',
            'admins':['ryoma'],
            'members':['member1']
        },{
            'name':'2811ICT',
            'admins':['super'],
            'members':['member1','ryoma']
        },{
            'name':'1701ICT',
            'admins':['group'],
            'members':['member2', 'ryoma']
        },
    ],
    'channels':[
        {'name': 'Events', 'group':'Griffith Innovate', 'members':['ryoma','member1']},
        {'name': 'Admin Chat', 'group': 'Griffith Innovate', 'members':['ryoma']},
        {'name': 'Lab Help', 'group': '2811ICT', 'members':['ryoma','member1','member2']},
        {'name': 'Assignment Help', 'group': '2811ICT', 'members':['member1','member2']},
    ]
}
// Login Module
require('./login.js')(app, data);

// the "index" route, which serves the Angular app
app.use(express.static(path.join(__dirname, '../angular-app/dist/angular-app')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'../angular-app/dist/angular-app/index.html'))
});
app.get('/home', function(req,res){
    res.sendFile(path.join(__dirname,'../angular-app/dist/angular-app/index.html'))
});
 

// API routes
app.get('/api/users', function(req,res){
    res.send(data.users);
});
app.get('/api/groups', function(req,res){
    res.send(data.groups);
});
app.get('/api/rooms', function(req,res){
    res.send(data.rooms);
});
 


// HTTP Listener
app.listen(3000, function(){
    console.log('Server runing');
})
module.exports = app;