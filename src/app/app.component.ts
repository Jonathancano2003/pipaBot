import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [FormsModule, ChatComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'pipBot';
}