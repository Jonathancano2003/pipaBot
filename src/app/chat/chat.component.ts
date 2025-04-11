import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, SidebarComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: { type: 'text' | 'image', content: string, sender: 'user' | 'machine', avatar?: string }[] = [];
  newMessage: string = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  userAvatar: string = 'assets/images/usuario.png';
  botAvatar: string = 'assets/images/maquina.png';

  showSidebar: boolean = false;
  modoOscuro: boolean = false;

  constructor(private chatService: ChatService, private router: Router) {}

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  isMobileScreen(): boolean {
    return window.innerWidth <= 576;
  }

  logout() {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/login']);
  }

  sendMessage() {
    const trimmedMessage = this.newMessage.trim();
  
    // Si no hay mensaje ni imagen, no hacemos nada
    if (!trimmedMessage && !this.selectedImage) return;
  
    // Agregar mensaje al chat
    if (trimmedMessage) {
      this.messages.push({
        type: 'text',
        content: trimmedMessage,
        sender: 'user',
        avatar: this.userAvatar
      });
    }
  
    // Si hay imagen, procesarla con FileReader
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const dataUrl: string = e.target.result;
        const base64Data = dataUrl.split(',')[1];
        const mimeType = dataUrl.match(/^data:(.*?);base64/)?.[1] || 'image/jpeg';
  
        // Mostrar preview en el chat
        this.messages.push({
          type: 'image',
          content: dataUrl,
          sender: 'user',
          avatar: this.userAvatar
        });
  
        // Enviar mensaje + imagen al backend
        this.enviarMensajeAlBackend(trimmedMessage, base64Data, mimeType);
  
        // Limpiar
        this.selectedImage = null;
        this.imagePreview = null;
        this.newMessage = '';
      };
      reader.readAsDataURL(this.selectedImage);
    } else {
      // Solo texto
      this.enviarMensajeAlBackend(trimmedMessage);
      this.newMessage = '';
    }
  }
  

  enviarMensajeAlBackend(messageContent: string, imageBase64Data?: string, mimeType?: string) {
    this.chatService.sendMessage(messageContent, imageBase64Data, mimeType).subscribe(
      (response: any) => {
        this.messages.push({ type: 'text', content: response.response, sender: 'machine', avatar: this.botAvatar });
      },
      (error) => {
        console.error('Error del backend:', error);
      }
    );
  }

  onImageSelected(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.selectedImage = archivo;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(archivo);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  resetConversation() {
    this.chatService.resetChat().subscribe(() => {
      this.messages = [];
    });
  }
}
