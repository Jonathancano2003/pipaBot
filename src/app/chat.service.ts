import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Chat {
  id: number;
  titulo: string;
  resumen: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private backendUrl = 'https://pipabot.nite.black/api/gemini/receive';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, imageBase64?: string, imageMime?: string) {
    return this.http.post(this.backendUrl, {
      message,
      image_base64: imageBase64,
      image_mime: imageMime
    });
  }

  resetChat() {
    return this.http.post('https://pipabot.nite.black/api/gemini/reset', {});
  }

  getChatsFromBackend() {
    return this.http.get<Chat[]>('https://pipabot.nite.black/api/chats');
  }

  addChat(titulo: string, resumen: string, mensajes: any[]) {
    return this.http.post('https://pipabot.nite.black/api/chats', {
      titulo,
      resumen,
      mensajes
    });
  }

  getChatById(id: number) {
    return this.http.get<any>(`https://pipabot.nite.black/api/chats/${id}`);
  }
  setContext(mensajes: any[]) {
    return this.http.post('https://pipabot.nite.black/api/gemini/context', { mensajes });
  }
  getQuickReplies() {
    return this.http.get<{ id: number, text: string }[]>('https://pipabot.nite.black/api/quick-replies');
  }
  
  addQuickReply(text: string) {
    return this.http.post('https://pipabot.nite.black/api/quick-replies', { text });
  }
  
  deleteQuickReply(id: number) {
    return this.http.delete(`https://pipabot.nite.black/api/quick-replies/${id}`);
  }
  
  
}
