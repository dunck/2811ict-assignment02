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
            'name':'group1',
            'id': 1,
            'admins':['ryomaohira'],
            'members':['member1']
        }
    ],
    'rooms':[
        {'name': 'room1', 'group_id': -1},
        {'name': 'room1', 'group_id': 1},
    ]
}

app.post('/api/login', function(req, res){
   let username = req.body.username; 
   let users = data.users;
   let match = false;
   for(let i = 0; i < users.length; i++){
       if(users[i].username == username){
           match = users[i];
       }
   }

   res.send(match);
});

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