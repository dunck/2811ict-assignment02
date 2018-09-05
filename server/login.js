module.exports = function(app, data){
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
}