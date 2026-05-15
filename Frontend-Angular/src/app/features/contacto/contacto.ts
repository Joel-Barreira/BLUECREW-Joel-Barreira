import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactoService, MensajeContacto } from '../../services/contacto.service';
import { LucideAngularModule, Search, Mail, Trash2, Calendar, X, MapPin } from 'lucide-angular';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ConfirmModalComponent],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss'
})
export class Contacto implements OnInit {
  contactoService = inject(ContactoService);
  
  mensajes = signal<MensajeContacto[]>([]);
  searchQuery = signal('');
  selectedMensaje = signal<MensajeContacto | null>(null);
  showModal = signal(false);
  showConfirmDelete = signal(false);
  mensajeToDeleteId = signal<number | null>(null);

  filteredMensajes = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.mensajes().filter(m => 
      m.nombre.toLowerCase().includes(query) || 
      m.email.toLowerCase().includes(query) ||
      m.mensaje.toLowerCase().includes(query)
    );
  });

  readonly Search = Search;
  readonly Mail = Mail;
  readonly Trash2 = Trash2;
  readonly Calendar = Calendar;
  readonly X = X;
  readonly MapPin = MapPin;

  ngOnInit() {
    this.loadMensajes();
  }

  loadMensajes() {
    this.contactoService.getMensajes().subscribe({
      next: (data) => this.mensajes.set(data),
      error: (err) => console.error('Error loading messages', err)
    });
  }

  deleteMensaje(id: number) {
    this.mensajeToDeleteId.set(id);
    this.showConfirmDelete.set(true);
  }

  confirmDelete() {
    const id = this.mensajeToDeleteId();
    if (id !== null) {
      this.contactoService.deleteMensaje(id).subscribe({
        next: () => {
          this.mensajes.update(msjs => msjs.filter(m => m.id !== id));
          this.closeConfirmDelete();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error deleting message', err);
          this.closeConfirmDelete();
        }
      });
    }
  }

  closeConfirmDelete() {
    this.showConfirmDelete.set(false);
    this.mensajeToDeleteId.set(null);
  }

  viewDetail(mensaje: MensajeContacto) {
    this.selectedMensaje.set(mensaje);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedMensaje.set(null);
  }
}
