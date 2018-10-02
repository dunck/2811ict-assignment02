import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { GroupService } from '../group.service';
import { ChatService } from '../chat.service';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public user;
  public selectedGroup;
  public selectedChannel;
  public groups = [];
  public channels = [];
  public newGroupName: String;
  public newChannelName: String;
  public selectedFile = null;
  public imagePath = "";

  constructor(private _imageService: ImageService, private router: Router, private _groupService: GroupService) { }

  ngOnInit() {
    if (sessionStorage.getItem('user') === null) {
      // User has not logged in, reroute to login
      this.router.navigate(['/login']);
    } else {
      let user = JSON.parse(sessionStorage.getItem('user'));
      this.user = user;
      this.getGroups();
    }
  }

  onFileSelected(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];
  }

  uploadImage() {
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    fd.append('username', this.user.username);
    this._imageService.uploadImage(fd).subscribe(
      res => {
        console.log(res);
      }
    )
  }

  createChannel(event) {
    event.preventDefault();
    if (this.newChannelName != undefined && this.newChannelName != '') {
      console.log(`Creating channel '${this.newChannelName}' under '${this.selectedGroup.name}'.`);
      this._groupService.createChannel(this.selectedGroup.name, this.newChannelName).subscribe(
        () => this.refreshChannels()
      );
    }
  }

  refreshChannels() {
    console.log(`Getting channels for '${this.selectedGroup.name}'.`);
    this._groupService.getChannels(this.user.username, this.selectedGroup, this.user.permissions).subscribe(
      (data: Object[]) => {
        console.log(`Refreshed channels:`);
        console.log(data);
        this.channels = data;
      }
    );
  }

  createGroup(event) {
    event.preventDefault();
    console.log(`Creating group: ${this.newGroupName}.`);
    this._groupService.createGroup(this.newGroupName).subscribe(
      () => {
        console.log(`Group created.`);
        this.getGroups();
      },
      error => {
        console.error(error);
      }
    )
  }

  deleteGroup(groupName) {
    console.log(`Deleting group: '${groupName}'.`)
    this._groupService.deleteGroup(groupName).subscribe(
      () => {
        console.log(`Group deleted.`)
        this.getGroups();
      }, error => {
        console.error(error)
      }
    )
  }
  deleteChannel(channelName) {
    console.log(`Deleting channel: '${channelName}'.`)
    this._groupService.deleteChannel(channelName).subscribe(
      () => {
        console.log(`Channel deleted.`)
        this.refreshChannels();
      }, error => {
        console.error(error)
      }
    )
  }

  getGroups() {
    console.log("Gathering group info.");
    let data = {
      'username': JSON.parse(sessionStorage.getItem('user')).username
    }
    this._groupService.getGroups(data).subscribe(
      data => {
        this.groups = data['groups'];
        if (this.groups.length > 0) {
          this.openGroup(this.groups[0].name);
          if (this.groups[0].channels > 0) {
            this.channelChangedHandler(this.groups[0].channels[0].name);
          }
        }
      },
      error => {
        console.error(error);
      }
    )
  }

  logout() {
    console.log("Logging out.");
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  // Determine which group is currently selected and pass onto the child panel
  openGroup(name) {
    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].name == name) {
        this.selectedGroup = this.groups[i];
        sessionStorage.setItem("selectedGroup", this.selectedGroup.name);
        sessionStorage.setItem("selectedChannel", "");
      }
    }
    this._groupService.getChannels(this.user.username, this.selectedGroup, this.user.permissions).subscribe(
      (data: any[]) => {
        this.channels = data
      }
    );
    // this.channels = this.selectedGroup.channels;
  }

  // Responsible for handling the event call by the child component
  channelChangedHandler(name) {
    let found: boolean = false;
    for (let i = 0; i < this.channels.length; i++) {
      if (this.channels[i].name == name) {
        this.selectedChannel = this.channels[i];
        sessionStorage.setItem("selectedChannel", this.selectedChannel.name);
        found = true;
      }
    }
    return found;
  }
}
