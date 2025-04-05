import { Component, Input } from '@angular/core';
import { Chat } from '../chat.service'; // ← CORRECTO

@Component({
  selector: 'app-card-chat',
  standalone: true,
  imports: [],
  templateUrl: './card-chat.component.html',
  styleUrls: ['./card-chat.component.css']
})
export class CardChatComponent {
  @Input() chat!: Chat;
}
