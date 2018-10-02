// chat.service.ts
// ChatService
// Exposes functions for piping messages to/from the server.

import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs-compat/Rx';`z`

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: Subject<any>;

  constructor(private wsService: WebsocketService, private http: HttpClient) {
    this.messages = <Subject<any>>wsService
      .connect()
      .map((response: any): any => {
        return response;
      })
  }

  // Sends 'msg' to the socket.
  sendMsg(msg) {
    this.messages.next(msg);
  }

  // Gets the chat history from the Express server.
  getHistory() {
    return this.http.get('http://localhost:3000/api/chat');
  }
}