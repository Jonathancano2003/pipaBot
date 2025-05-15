import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://pipabot.nite.black/api';  // Cambia a la URL pública si lo subes

  constructor(private http: HttpClient) {}

  // Obtener el prompt actual
  getPrompt(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/prompt`);
  }

  // Guardar el nuevo prompt
  setPrompt(prompt: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/prompt`, { prompt });
  }

  // Restaurar el prompt por defecto
  resetPrompt(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/prompt/reset`);
  }

  // Obtener el historial de prompts
  getPromptHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prompt/history`);
  }

  deletePrompt(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/prompt/${id}`);
  }

  // ============ RESPUESTAS RÁPIDAS =============
  getQuickReplies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/quick-replies`);
  }

  addQuickReply(text: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/quick-replies`, { text });
  }

  deleteQuickReply(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/quick-replies/${id}`);
  }
}
