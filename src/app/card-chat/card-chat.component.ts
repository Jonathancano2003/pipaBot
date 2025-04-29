import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Chat } from '../chat.service';

@Component({
  selector: 'app-card-chat',
  standalone: true,
  imports: [],
  templateUrl: './card-chat.component.html',
  styleUrls: ['./card-chat.component.css']
})
export class CardChatComponent {
  @Input() chat!: Chat;
  @Output() cargarChat = new EventEmitter<number>();

  onCargarChat() {
    this.cargarChat.emit(this.chat.id);
  }
}
