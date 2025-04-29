import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CardChatComponent } from '../card-chat/card-chat.component';
import { ChatService, Chat } from '../chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, CardChatComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  chats: Chat[] = [];
  @Output() chatSeleccionado = new EventEmitter<number>();
  @Output() nuevoChat = new EventEmitter<void>();

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.cargarChats();
  }

  cargarChats() {
    this.chatService.getChatsFromBackend().subscribe(data => {
      this.chats = data;
    });
  }

  seleccionarChat(id: number) {
    this.chatSeleccionado.emit(id);
  }

  crearNuevoChat() {
    this.nuevoChat.emit();
  }
}
