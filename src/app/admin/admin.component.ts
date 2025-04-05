// src/app/admin/admin.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  prompt: string = '';
  status: string = '';

  constructor(private http: HttpClient) {}

  updatePrompt() {
    if (!this.prompt.trim()) {
      this.status = 'El prompt no puede estar vacío.';
      return;
    }

    this.http.post('https://pipabot.nite.black/api/gemini/update-prompt', {

      prompt: this.prompt,
    }).subscribe({
      next: () => this.status = 'Prompt actualizado correctamente ✅',
      error: () => this.status = '❌ Error al actualizar el prompt'
    });
  }
}
