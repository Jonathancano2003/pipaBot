import { Component, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('chatMessages') chatMessagesContainer!: ElementRef;

  messages: { type: 'text' | 'image', content: string, sender: 'user' | 'machine', avatar?: string, timestamp?: Date }[] = [];
  newMessage: string = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  userAvatar: string = 'assets/images/usuario.png';
  botAvatar: string = 'assets/images/maquina.png';

  showSidebar: boolean = false;
  modoOscuro: boolean = false;
  isTyping: boolean = false;

  // QUICK REPLIES
  quickReplies: string[] = [];
  // ----------- MENÚ DE COMANDOS -----------
  commands = [
    { cmd: '/help', desc: 'Mostrar ayuda sobre comandos' },
    { cmd: '/clear', desc: 'Reiniciar chat actual' },
    { cmd: '/about', desc: 'Información sobre PipaBot' }
  ];
  showCommandMenu = false;
  filteredCommands: any[] = [];
  commandMenuIndex = 0;
  // ----------------------------------------

  constructor(private chatService: ChatService, private router: Router) {
    // Cargar respuestas rápidas del backend
    this.chatService.getQuickReplies().subscribe({
      next: (res: any) => { this.quickReplies = res.map((r: any) => r.text); }
    });
  }

  toggleSidebar() { this.showSidebar = !this.showSidebar; }

  isMobileScreen(): boolean { return window.innerWidth <= 576; }

  logout() {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/login']);
  }

  // Detectar '/' para mostrar menú de comandos
  onInputChange(event: any) {
    const value = event.target.value;
    if (value.startsWith('/')) {
      this.filteredCommands = this.commands.filter(cmd => cmd.cmd.startsWith(value));
      this.showCommandMenu = this.filteredCommands.length > 0;
      this.commandMenuIndex = 0;
    } else {
      this.showCommandMenu = false;
    }
  }

  onInputKeydown(event: KeyboardEvent) {
    if (!this.showCommandMenu) return;
    if (event.key === 'ArrowDown') {
      this.commandMenuIndex = (this.commandMenuIndex + 1) % this.filteredCommands.length;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.commandMenuIndex = (this.commandMenuIndex - 1 + this.filteredCommands.length) % this.filteredCommands.length;
      event.preventDefault();
    } else if (event.key === 'Enter') {
      if (this.showCommandMenu) {
        this.selectCommand(this.filteredCommands[this.commandMenuIndex]);
        event.preventDefault();
      }
    } else if (event.key === 'Escape') {
      this.showCommandMenu = false;
    }
  }

  selectCommand(cmd: { cmd: string, desc: string }) {
    this.newMessage = cmd.cmd + ' ';
    this.showCommandMenu = false;
  }

  sendMessage() {
    const trimmedMessage = this.newMessage.trim();
    if (!trimmedMessage && !this.selectedImage) return;

    // Comandos rápidos
    if (trimmedMessage.startsWith('/')) {
      this.handleCommand(trimmedMessage);
      this.newMessage = '';
      return;
    }

    if (trimmedMessage) {
      this.messages.push({
        type: 'text',
        content: trimmedMessage,
        sender: 'user',
        avatar: this.userAvatar,
        timestamp: new Date()
      });
    }

    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const dataUrl: string = e.target.result;
        const base64Data = dataUrl.split(',')[1];
        const mimeType = dataUrl.match(/^data:(.*?);base64/)?.[1] || 'image/jpeg';
        this.messages.push({
          type: 'image',
          content: dataUrl,
          sender: 'user',
          avatar: this.userAvatar,
          timestamp: new Date()
        });
        this.enviarMensajeAlBackend(trimmedMessage, base64Data, mimeType);
        this.selectedImage = null;
        this.imagePreview = null;
        this.newMessage = '';
        this.scrollToBottom();
      };
      reader.readAsDataURL(this.selectedImage);
    } else {
      this.enviarMensajeAlBackend(trimmedMessage);
      this.newMessage = '';
      this.scrollToBottom();
    }
  }

  // Manejar comandos
  handleCommand(command: string) {
    if (command.startsWith('/help')) {
      this.messages.push({
        type: 'text',
        content: 'Comandos disponibles:\n' +
          this.commands.map(c => `${c.cmd}: ${c.desc}`).join('\n'),
        sender: 'machine',
        avatar: this.botAvatar,
        timestamp: new Date()
      });
    } else if (command.startsWith('/clear')) {
      this.resetConversation();
      this.messages.push({
        type: 'text',
        content: '🧹 ¡El chat ha sido reiniciado!',
        sender: 'machine',
        avatar: this.botAvatar,
        timestamp: new Date()
      });
    } else if (command.startsWith('/about')) {
      this.messages.push({
        type: 'text',
        content: 'PipaBot es tu asistente AI personalizado 🤖.',
        sender: 'machine',
        avatar: this.botAvatar,
        timestamp: new Date()
      });
    } else {
      this.messages.push({
        type: 'text',
        content: `Comando no reconocido: ${command}`,
        sender: 'machine',
        avatar: this.botAvatar,
        timestamp: new Date()
      });
    }
    this.scrollToBottom();
  }

  enviarMensajeAlBackend(messageContent: string, imageBase64Data?: string, mimeType?: string) {
    if (!messageContent && !imageBase64Data) return;
    this.isTyping = true;
    this.chatService.sendMessage(messageContent, imageBase64Data, mimeType).subscribe(
      (response: any) => {
        this.messages.push({
          type: 'text',
          content: response.response,
          sender: 'machine',
          avatar: this.botAvatar,
          timestamp: new Date()
        });
        this.isTyping = false;
        this.scrollToBottom();
      },
      (error) => {
        console.error('Error del backend:', error);
        this.isTyping = false;
      }
    );
  }

  guardarChat() {
    const titulo = prompt('Ponle un título al chat:') || 'Sin título';
    const resumen = this.messages.length > 0 ? this.messages[0].content.substring(0, 50) : 'Sin resumen';
    const mensajes = this.messages;
    this.chatService.addChat(titulo, resumen, mensajes).subscribe(() => {
      console.log('Chat guardado exitosamente');
    });
  }

  onImageSelected(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.selectedImage = archivo;
      const reader = new FileReader();
      reader.onload = (e: any) => { this.imagePreview = e.target.result; };
      reader.readAsDataURL(archivo);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  resetConversation() {
    this.messages = [];
    this.newMessage = '';
    this.selectedImage = null;
    this.imagePreview = null;
    this.chatService.setContext([]).subscribe(() => {
      console.log('Contexto del backend reiniciado');
    });
    this.scrollToBottom();
  }

  cargarChat(id: number) {
    this.chatService.getChatById(id).subscribe(data => {
      if (data && data.mensajes) {
        this.messages = data.mensajes;
        this.chatService.setContext(data.mensajes).subscribe({
          next: () => console.log('✅ Contexto restaurado en el backend'),
          error: (err) => console.error('❌ Error al enviar contexto al backend', err)
        });
        this.scrollToBottom();
      }
    });
  }

  nuevoChat() {
    this.resetConversation();
  }

  private scrollToBottom() {
    setTimeout(() => {
      const container = this.chatMessagesContainer?.nativeElement;
      container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }, 50);
  }

  usarRespuestaRapida(texto: string) {
    this.newMessage = texto;
    this.sendMessage();
  }
}
