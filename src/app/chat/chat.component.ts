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
    if (this.newMessage.trim() !== '' || this.selectedImage) {
      let messageContent: string = '';
      if (this.newMessage.trim() !== '') {
        this.messages.push({ type: 'text', content: this.newMessage, sender: 'user', avatar: this.userAvatar });
        messageContent = this.newMessage;
        this.newMessage = '';
      }

      if (this.selectedImage) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const dataUrl: string = e.target.result;
          const base64Data = dataUrl.split(',')[1];
          const mimeType = dataUrl.match(/^data:(.*?);base64/)?.[1] || 'image/jpeg';

          this.messages.push({ type: 'image', content: dataUrl, sender: 'user', avatar: this.userAvatar });
          this.selectedImage = null;

          this.enviarMensajeAlBackend(messageContent, base64Data, mimeType);
        };
        reader.readAsDataURL(this.selectedImage);
        return;
      }

      this.enviarMensajeAlBackend(messageContent, undefined, undefined);
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
    this.selectedImage = event.target.files[0];
  }

  resetConversation() {
    this.chatService.resetChat().subscribe(() => {
      this.messages = [];
    });
  }
}
