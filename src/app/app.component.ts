import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from "./login/login.component";
import { RouterOutlet } from '@angular/router'; // 👈 necesario para usar rutas

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [FormsModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'] // ✅ corregido aquí
})
export class AppComponent {
    title = 'pipBot';
}
