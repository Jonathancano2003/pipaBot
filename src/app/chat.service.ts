import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private backendUrl = 'http://localhost:8000/api/gemini/receive';

  constructor(private http: HttpClient) { }

  sendMessage(message: string, imageBase64?: string, imageMime?: string) {
    return this.http.post(this.backendUrl, {
      message,
      image_base64: imageBase64,
      image_mime: imageMime
    });
  }
  resetChat() {
    return this.http.post('http://localhost:8000/api/gemini/reset', {});
  }



}