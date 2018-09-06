// ============================================
// This module is responsible for joining the user's 
// groups and channels according to the user's 
// responsibilities
// ============================================
module.exports = function(){
    this.username;
    this.data;
    

    this.findUser = function(username){
        let match = false;
        let users = data.users;
        for(let i = 0; i < users.length; i++){
            if(users[i].username == username){
                match = users[i];
            }
        }
        // Grab some groups
        if(match !== false){
            match.groups = this.getGroups(username);
        }

        return match;
    }

    this.getGroups = function(username){
        let groups = [];
        // Check for group admin
        for(let i = 0; i < data.groups.length; i++){
            let admins = data.groups[i].admins;
            for(let j = 0; j < admins.length; j++){
                if(username == admins[j]){
                    data.groups[i].role = 1;
                    groups.push(data.groups[i]);
                }
            }
        }

        // Check for membership
        for(let i = 0; i < data.groups.length; i++){
            let members = data.groups[i].members;
            for(let j = 0; j < members.length; j++){
                if(username == members[j]){
                    data.groups[i].role = 0;
                    groups.push(data.groups[i]);
                }
            }
        }

        // Grab the channels for each group
        for(let i = 0; i < groups.length; i++){
            let channels = getChannels(username, groups[i], groups[i].role);
            groups[i].channels = channels;
        }
        return groups;
    }

    this.getChannels = function(username, group, role){
        channels = [];
        // Go through all the channels
        for(let i = 0; i < data.channels.length; i++){
            // Check to see if the channel matches the current group
            if(data.channels[i].group == group.name){
                if(group.role >= 1){
                    channels.push(data.channels[i]);
                } else {
                    // Channel belongs to group, check for access
                    let channel = data.channels[i];
                    for(let j = 0; j < channel.members.length; j++){
                        if(username == channel.members[j]){
                            channels.push(channel);
                        }
                    }
                }
            }
        }


        return channels;
    }
    return this;
}