import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http:HttpClient) { }

  uploadImage(data) {
    // console.log(`Uploading image for ${user.username}.`);
    return this.http.post('http://localhost:3000/api/images/upload', data);
  }
}
