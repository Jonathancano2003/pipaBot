import { Component, OnInit } from '@angular/core';
import { CardChatComponent } from '../card-chat/card-chat.component';
import { ChatService, Chat } from '../chat.service';
import { CommonModule } from '@angular/common'; // ✅ NECESARIO PARA *ngFor

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, CardChatComponent], // ✅ AÑADIDO
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  chats: Chat[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chats = this.chatService.getChats();
  }
}
