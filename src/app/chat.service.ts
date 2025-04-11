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

  private backendUrl = 'http://127.0.0.1:8000/api/gemini/receive';

  private mockChats: Chat[] = [
    { id: 1, titulo: 'Imagen prueba', resumen: 'Probando imágenes en el chat', fecha: '2025-04-01' },
    { id: 2, titulo: 'Prueba oscura', resumen: 'Tema oscuro implementado', fecha: '2025-03-30' },
    { id: 3, titulo: 'Estilo estilo', resumen: 'prueba ', fecha: '2025-03-28' }
  ];

  constructor(private http: HttpClient) { }

  sendMessage(message: string, imageBase64?: string, imageMime?: string) {
    return this.http.post(this.backendUrl, {
      message,
      image_base64: imageBase64,
      image_mime: imageMime
    });
  }

  resetChat() {
    return this.http.post('http://127.0.0.1:8000/api/gemini/reset', {});
  }

  // NUEVO: devolver mock de chats
  getChats(): Chat[] {
    return this.mockChats;
  }
}
