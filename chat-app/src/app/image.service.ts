// image.service.ts
// ImageService
// Exposes functions for managing profile images.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http:HttpClient) { }

  uploadImage(data) {
    return this.http.post('http://localhost:3000/api/images/upload', data);
  }
}
