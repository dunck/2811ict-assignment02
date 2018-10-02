import { Component, OnInit, Input } from '@angular/core';
import { parse } from 'querystring';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  providers: [ChatService],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() channel;
  public message: String;
  public chatHistory: Object[];

  constructor(private chat: ChatService) {
    this.message = "";
    this.chatHistory = [];
  }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      console.log(this.chatHistory);
      if(msg.type == 'new-message') {
        this.chatHistory.push(msg.data);
      }
      // console.log(msg);
    })
  }
  
  sendMessage() {
    console.log("Sending message.");
    let username = JSON.parse(sessionStorage.getItem('user')).username;
    let channel = sessionStorage.getItem('selectedChannel');
    let group = sessionStorage.getItem('selectedGroup');
    this.chat.sendMsg({
      "message": this.message,
      "username": username,
      "group": group,
      "channel": channel
    });

    // Clear message after it has been sent.
    this.message = "";
  }
}
