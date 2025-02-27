import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from '../chat.service';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent {
    messages: { type: 'text' | 'image', content: string, sender: 'user' | 'machine' }[] = [];
    newMessage: string = '';
    selectedImage: File | null = null;

    constructor(private chatService: ChatService) { }

    sendMessage() {
        if (this.newMessage.trim() !== '' || this.selectedImage) {
            let messageContent: string = '';
            let imageBase64Data: string | undefined = undefined;

            if (this.newMessage.trim() !== '') {
                this.messages.push({ type: 'text', content: this.newMessage, sender: 'user' });
                messageContent = this.newMessage;
                this.newMessage = '';
            }
            if (this.selectedImage) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    console.log('Base64:', e.target.result);
                    this.messages.push({ type: 'image', content: e.target.result, sender: 'user' });
                    imageBase64Data = e.target.result as string; // Castear a string
                    this.selectedImage = null;

                    this.enviarMensajeAlBackend(messageContent, imageBase64Data);
                };
                reader.readAsDataURL(this.selectedImage);
                return;
            }

            if (messageContent) {
                this.enviarMensajeAlBackend(messageContent, imageBase64Data); // imageBase64Data será undefined si no hay imagen
            }
        }
    }

    enviarMensajeAlBackend(messageContent: string, imageBase64Data: string | undefined) {
        this.chatService.sendMessage(messageContent, imageBase64Data).subscribe(
            (response: any) => {
                console.log('Respuesta del backend:', response);
                this.messages.push({ type: 'text', content: response.response, sender: 'machine' });
            },
            (error) => {
                console.error('Error del backend:', error);
            }
        );
    }


    onImageSelected(event: any) {
        this.selectedImage = event.target.files[0];
    }

    
}