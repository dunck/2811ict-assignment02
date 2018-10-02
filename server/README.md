# Summary
The server files are largely spread out between these main files:
* server.js
* login.js
* groups.js
* channels.js

## server.js
**server.js** is the main file that will run the server. It also instantiates the other files as modules. 

This module exposes the following routes:
|Route|Description|
|-|-|
|`GET /`, `GET /home`|Points to `index.html` - exists as redunancy for the router outlet.|
|`POST /api/login`|Accepts a username/password in the request body, returns truthy success login value.|
|`POST /api/groups`|Accepts a username in the request body, returns list of groups associated with that username.|
|`DELETE /api/group/delete/:groupname`|Accepts a group name in the request parameters, returns a truthy value for deletion of it.|
|`DELETE /api/channel/delete/:groupname`|Accepts a channel name in the request parameters, returns a truthy value for deletion of it.|
|`POST /api/channel/create`|Accepts a channel name & group name in the request body, returns a truthy value for creation of it.|
|`GET /images`|Points to `./images` - profile picture storage.|
|`POST /api/images/upload`|Accepts a channel name & group name in the request body, returns a truthy value for creation of it.|
|`POST /api/channels`|Accepts a user name, group name & role in the request body, returns a corresponding list of channels.|

## login.js
This module exposes the following functions:
|Function|Description|
|-|-|
|`findUser(username, password)`|Returns a truthy value to determine whether a user login attempt was successful. No ticket needed. Needs a connection to MongoDB.|
|`getUserRole(username)`|Returns the permission level of a user in the database 0, 1, or 2. No ticket needed. Needs a connection to MongoDB. |

## groups.js
This module exposes the following:
|Function|Description|
|-|-|
|`getGroups(username)`|Returns all groups associated with the username. No ticket needed. Needs a connection to MongoDB.|
|`createGroup(groupname)`|Creates a group, returning a truthy success value. The default admin of the group is `super`, and the group contains no members or channels by default. No ticket needed. Needs a connection to MongoDB.|
|`deleteGroup(groupname)`|Deletes a group, returning a truthy success value. No ticket needed. Needs a connection to MongoDB.|

## channels.js
This module exposes the following:
|Function|Description|
|-|-|
|`getChannels(username, group, role)`|Returns all channels associated with the username, group & role. No ticket needed. Needs a connection to MongoDB.|
|`createChannel(groupname, channelname)`|Creates a channel under a group, returning a truthy success value. No ticket needed. Needs a connection to MongoDB.|
|`deleteChannel(channelname)`|Deletes a channel, returning a truthy success value. No ticket needed. Needs a connection to MongoDB.|
