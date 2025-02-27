import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    private backendUrl = 'http://localhost:8000/api/gemini/receive'; // URL CORRECTA: /api/gemini/receive

    constructor(private http: HttpClient) { }

    sendMessage(message: string, imageBase64?: string) { 
        return this.http.post(this.backendUrl, { message: message, imageBase64: imageBase64 }); 
    }
}