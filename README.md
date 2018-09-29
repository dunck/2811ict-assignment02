# Summary
This is a solution for Assignment 1 in 2811ICT - Web Programming. It was created by Ryoma Ohira and I have adapted it for Assignment 2.


# Installation
## Node Server
Change directory to **server** and run **npm install**. Run server by running **node server.js** and the Node server will start listening on port 3000. Node server is set up to accept CORS from **localhost:4200**. 

## Angular App
Change directory to **chat-app** and run **npm install**. You can run the Angular server by **ng serve**. As CORS is set up on the Node server, this will still allow you send data between the Angular chat app and the node server. **ng build** will create the distributable, compiled version of the Angular app. The Node server will already be preconfigured to run **dist/index.html**.