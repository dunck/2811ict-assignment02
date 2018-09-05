module.exports = function(app, data){
    app.post('/api/login', function(req, res){
        let username = req.body.username; 
        let match = findUser(username);
        res.send(match);
    });

    function findUser(username){
        let match = false;
        let users = data.users;
        for(let i = 0; i < users.length; i++){
            if(users[i].username == username){
                match = users[i];
            }
        }
        // Grab some groups
        if(match !== false){
            match.groups = getGroups(username);
        }

        return match;
    }

    function getGroups(username){
        let groups = [];
        // Check for group admin
        for(let i = 0; i < data.groups.length; i++){
            let admins = data.groups[i].admins;
            for(let j = 0; j < admins.length; j++){
                if(username == admins[i]){
                    data.groups[i].role = 1;
                    groups.push(data.groups[i]);
                }
            }
        }

        // Check for membership
        for(let i = 0; i < data.groups.length; i++){
            let members = data.groups[i].members;
            for(let j = 0; j < members.length; j++){
                if(username == members[i]){
                    data.groups[i].role = 0;
                    groups.push(data.groups[i]);
                }
            }
        }

        return groups;
    }
}