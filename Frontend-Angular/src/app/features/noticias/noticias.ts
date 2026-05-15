import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoticiaService, Noticia } from '../../services/noticia.service';
import { LucideAngularModule, Search, Eye, EyeOff, Trash2, Newspaper, Info, Calendar, User } from 'lucide-angular';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ConfirmModalComponent],
  templateUrl: './noticias.html',
  styleUrl: './noticias.scss'
})
export class Noticias implements OnInit {
  noticiaService = inject(NoticiaService);

  noticias = signal<Noticia[]>([]);
  searchQuery = signal('');
  
  selectedNoticia = signal<Noticia | null>(null);
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


  filteredNoticias = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.noticias().filter(n => {
      const estadoStr = n.estadoVisibilidad ? 'publicada' : 'borrador';
      return n.titulo.toLowerCase().includes(query) || estadoStr.includes(query);
    });
  });

  readonly Trash2 = Trash2;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Calendar = Calendar;
  readonly Newspaper = Newspaper;
  readonly Search = Search;
  readonly User = User;
  readonly Info = Info;

  ngOnInit() {
    this.loadNoticias();
  }

  loadNoticias() {
    this.noticiaService.getNoticias().subscribe({
      next: (data) => this.noticias.set(data),
      error: (err) => console.error('Error loading news', err)
    });
  }

  viewDetail(noticia: Noticia) {
    this.selectedNoticia.set(noticia);
    this.showDetailModal.set(true);
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
    this.selectedNoticia.set(null);
  }

  toggleEstado(id: number, currentVisibilidad: boolean) {
    const nuevaVisibilidad = !currentVisibilidad;
    const msg = currentVisibilidad ? '¿Ocultar noticia como borrador?' : '¿Publicar esta noticia?';

    this.modalConfig.set({
      title: currentVisibilidad ? 'Mover a Borradores' : 'Publicar Noticia',
      message: msg,
      type: 'info',
      confirmText: currentVisibilidad ? 'Ocultar' : 'Publicar',
      action: () => {
        this.noticiaService.updateVisibilidad(id, nuevaVisibilidad).subscribe({
          next: () => {
            this.noticias.update(news => news.map(n =>
              n.idNoticia === id ? { ...n, estadoVisibilidad: nuevaVisibilidad } : n
            ));
            
            // Update selectedNoticia if it's the one being toggled
            const selected = this.selectedNoticia();
            if (selected && selected.idNoticia === id) {
              this.selectedNoticia.set({ ...selected, estadoVisibilidad: nuevaVisibilidad });
            }
            
            this.showConfirmModal.set(false);
          },
          error: (err) => {
            console.error('Error toggling news status', err);
            this.showConfirmModal.set(false);
          }
        });
      }
    });
    this.showConfirmModal.set(true);
  }

  deleteNoticia(id: number) {
    this.modalConfig.set({
      title: 'Eliminar Noticia',
      message: '¿Estás seguro de eliminar esta noticia permanentemente? Esta acción no se puede deshacer.',
      type: 'danger',
      confirmText: 'Eliminar',
      action: () => {
        this.noticiaService.deleteNoticia(id).subscribe({
          next: () => {
            this.noticias.update(news => news.filter(n => n.idNoticia !== id));
            this.showConfirmModal.set(false);
            this.closeDetailModal();
          },
          error: (err) => {
            console.error('Error deleting news', err);
            this.showConfirmModal.set(false);
          }
        });
      }
    });
    this.showConfirmModal.set(true);
  }

}
