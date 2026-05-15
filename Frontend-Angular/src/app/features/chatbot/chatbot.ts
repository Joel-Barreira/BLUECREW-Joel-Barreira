import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, MessageCircle, X, Send, ExternalLink } from 'lucide-angular';
import { RouterModule } from '@angular/router';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  time: Date;
  link?: { label: string; url: string };
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss'
})
export class Chatbot implements AfterViewChecked {
  isOpen = signal(false);
  messages = signal<ChatMessage[]>([
    { text: '¡Hola! Soy tu asistente inteligente. ¿En qué te puedo ayudar hoy?', sender: 'bot', time: new Date() }
  ]);
  inputText = signal('');

  readonly MessageCircle = MessageCircle;
  readonly X = X;
  readonly Send = Send;
  readonly ExternalLink = ExternalLink;

  @ViewChild('chatBody') private chatBody!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen.set(!this.isOpen());
  }

  sendMessage() {
    const text = this.inputText().trim();
    if (!text) return;

    // Add user message
    this.messages.update(msgs => [...msgs, { text, sender: 'user', time: new Date() }]);
    this.inputText.set('');

    // Simulate bot response based on FAQs
    setTimeout(() => {
      this.generateResponse(text.toLowerCase());
    }, 600);
  }

  private generateResponse(query: string) {
    let responseText = "No estoy seguro de cómo ayudarte con eso. Puedes intentar preguntar sobre 'eventos', 'usuarios', 'noticias' o 'mensajes'.";
    let link: { label: string; url: string } | undefined;

    if (query.includes('evento')) {
      responseText = "Para gestionar eventos, ve a la sección de 'Eventos'. Allí podrás validar, rechazar o mover a pendiente los eventos registrados.";
      link = { label: 'Ir a Eventos', url: '/eventos' };
    } else if (query.includes('usuario')) {
      responseText = "Puedes gestionar usuarios desde la pestaña 'Usuarios'. Como administrador, tienes control total sobre los roles y el estado de las cuentas.";
      link = { label: 'Ir a Usuarios', url: '/usuarios' };
    } else if (query.includes('noticia')) {
      responseText = "Las noticias se gestionan en la sección 'Noticias', donde puedes crear nuevo contenido o cambiar su visibilidad.";
      link = { label: 'Ir a Noticias', url: '/noticias' };
    } else if (query.includes('mensaje')) {
      responseText = "En la sección de 'Contacto' puedes leer y gestionar todos los mensajes enviados por los usuarios a través de la web.";
      link = { label: 'Ir a Mensajes', url: '/contacto' };
    } else if (query.includes('hola') || query.includes('saludo')) {
      responseText = "¡Hola! ¿Necesitas ayuda con alguna sección del panel de administración?";
    }

    this.messages.update(msgs => [...msgs, { text: responseText, sender: 'bot', time: new Date(), link }]);
  }

  private scrollToBottom() {
    try {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }
}
