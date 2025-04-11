import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://127.0.0.1:8000/api';  // Asegúrate de usar la URL correcta

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
  
}
