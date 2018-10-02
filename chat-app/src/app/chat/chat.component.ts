import { Component, OnInit, Input } from '@angular/core';
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
  public chatHistory: Object[] = [];

  constructor(private chat: ChatService) {
    this.message = "";
    // this.chatHistory = chat.getHistory();
  }

  ngOnInit() {
    console.log("Hey");
    this.chat.getHistory().subscribe(
      (data: Object[]) => { console.log(data); this.chatHistory = data }
    )
    this.chat.messages.subscribe(msg => {
      console.log(this.chatHistory);
      if(msg.type == 'new-message') {
        this.chatHistory.push(msg.data);
      }
      else {
        this.chatHistory.push(msg);
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
