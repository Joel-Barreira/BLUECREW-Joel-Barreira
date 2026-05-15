import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService, Evento } from '../../services/evento.service';
import { LucideAngularModule, Search, CheckCircle, XCircle, Trash2, Archive, MapPin, CalendarDays, RotateCcw, Info, Calendar, Clock, Users } from 'lucide-angular';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ConfirmModalComponent],
  templateUrl: './eventos.html',
  styleUrl: './eventos.scss'
})
export class Eventos implements OnInit {
  eventoService = inject(EventoService);
  
  eventos = signal<Evento[]>([]);
  searchQuery = signal('');
  
  selectedEvento = signal<Evento | null>(null);
  showDetailModal = signal(false);

  showConfirmModal = signal(false);
  modalConfig = signal<{
    title: string;
    message: string;
    type: 'danger' | 'info' | 'success' | 'warning';
    confirmText: string;
    action: () => void;
  }>({
    title: '',
    message: '',
    type: 'danger',
    confirmText: 'Confirmar',
    action: () => {}
  });

  filteredEventos = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.eventos().filter(e => 
      e.titulo.toLowerCase().includes(query) || 
      e.ubicacion.toLowerCase().includes(query) ||
      (e.estadoEvento && e.estadoEvento.toLowerCase().includes(query))
    );
  });

  readonly Search = Search;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Trash2 = Trash2;
  readonly Archive = Archive;
  readonly MapPin = MapPin;
  readonly CalendarDays = CalendarDays;
  readonly RotateCcw = RotateCcw;
  readonly Info = Info;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Users = Users;


  ngOnInit() {
    this.loadEventos();
  }

  loadEventos() {
    this.eventoService.getEventos().subscribe({
      next: (data) => this.eventos.set(data),
      error: (err) => console.error('Error loading events', err)
    });
  }

  viewDetail(evento: Evento) {
    this.selectedEvento.set(evento);
    this.showDetailModal.set(true);
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
    this.selectedEvento.set(null);
  }

  updateEstado(id: number, estado: string) {
    this.modalConfig.set({
      title: 'Cambiar Estado',
      message: `¿Estás seguro de cambiar el estado a ${estado}?`,
      type: 'info',
      confirmText: 'Cambiar',
      action: () => {
        this.eventoService.patchEstado(id, estado).subscribe({
          next: () => {
            this.eventos.update(events => events.map(e =>
              e.idEvento === id ? { ...e, estadoEvento: estado } : e
            ));

            const selected = this.selectedEvento();
            if (selected?.idEvento === id) {
              this.selectedEvento.set({ ...selected, estadoEvento: estado });
            }

            this.showConfirmModal.set(false);
          },
          error: (err) => {
            console.error('Error updating event status', err);
            this.showConfirmModal.set(false);
          }
        });
      }
    });
    this.showConfirmModal.set(true);
  }

  deleteEvento(id: number) {
    this.modalConfig.set({
      title: 'Eliminar Evento',
      message: '¿Estás seguro de eliminar este evento permanentemente? Esta acción no se puede deshacer.',
      type: 'danger',
      confirmText: 'Eliminar',
      action: () => {
        this.eventoService.deleteEvento(id).subscribe({
          next: () => {
            this.eventos.update(events => events.filter(e => e.idEvento !== id));
            this.showConfirmModal.set(false);
            this.closeDetailModal();
          },
          error: (err) => {
            console.error('Error deleting event', err);
            this.showConfirmModal.set(false);
          }
        });
      }
    });
    this.showConfirmModal.set(true);
  }

}
