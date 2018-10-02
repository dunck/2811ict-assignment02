# ChatApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.2.

## Services
These services primary roles are to pipe parameters to their respective API routes and (usually) return some truthy value to the model. 5 services were created:
 * GroupService
    * Responsible for piping calls to appropriate API routes regarding group creation, deletion, and get requests.
 * UserService
    * Responsible for piping calls to appropriate API routes regarding user login attempts and role lookups.
 * WebSocketService
    * Exposes a socket initialisation function used for all clients connecting to the chat room.
 * ChatService
    * Responsible for piping calls to appropriate API routes regarding messages.
 * ImageService
    * Responsible for managing user profile pictures by piping uploaded images to the server.

## Components
4 components were created
 * LoginComponent
    * Exposes the user login page, and consumes a username/password. Only provides an extremely basic level of authentication.
 * HomeComponent
    * Controls the views of `ChannelsComponent` and `ChatComponent`, and also allows for profile picture management, groups management (if applicable), 
 * ChannelsComponent
    * Provides a view with a small column for users to choose a channel and to enter the chatroom.
 * ChatComponent
    * Provides a view with a small text input and large text reader area for users to chat with.