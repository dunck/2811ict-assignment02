# Summary
The server files are largely spread out between three main files:
* server.js
* login.js
* groups.js

## server.js
**server.js** is the main file that will run the server. It also instantiates the two other files as modules. 


## login.js
This module is purely for finding the user from the **this.data** array of users. The data member variable must be set before **findUser()** is run. This can be done by either settings it externally (as the **data** member variable is public) or through the function **setData()**. 

**findUser()** will search through the data and see if a match exists between the username and the list of users. If a user exists, the function will return the user object. If there is no match, the function will return **false**. 

## groups.js
This module is responsbile for CRUD on the groups as well as returning the groups (and subsequently, the channels) associated with the user. 

**deleteGroup(name)**: given a name for the group, this function will delete the group from the **data** list. It will return the new list if a group with the given name eixsts. If no group is found, the function will return a **false**. 

**getGroups(username, [role])**: given a username and an optional role parameter, the function will return all the groups and channels associated with the username. Roles are categories as:
* 0: user
* 1: group admin
* 2: super admin
If a user is a super admin (2), then all groups are returned with all channels. Otherwise, the function will go through all the groups and add the groups that the user is associated with. Afterwhich it will then go through and grab all the channels for each group that the user has access to. 

**getChannels(username, group, role)**: Given a username, group and role, the function will search through the channels for channels associated with the group. It will then look to see if the user has access to the channel. 


# Routes

## API

### Login

### User 

### Group
