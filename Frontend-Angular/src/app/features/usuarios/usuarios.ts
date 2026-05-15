import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { LucideAngularModule, Search, Edit2, Trash2, ShieldAlert, Plus, X, Upload, Users, Info, Calendar, Mail, User, ShieldCheck, MapPin, CheckCircle, UserX, UserCheck } from 'lucide-angular';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ConfirmModalComponent],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class Usuarios implements OnInit {
  usuarioService = inject(UsuarioService);

  usuarios = signal<Usuario[]>([]);
  searchQuery = signal('');

  // Fake current admin ID for demonstration
  currentAdminId = 1;

  selectedUsuario = signal<Usuario | null>(null);
  showDetailModal = signal(false);

  showAddModal = signal(false);
  formData: any = {
    nombre: '',
    apellido: '',
    email: '',
    password_hash: '',
    rol: 'USER',
    activo: true,
    localidad: '',
    biografia: ''
  };

  showConfirmDelete = signal(false);
  userToDeleteId = signal<number | null>(null);

  showAlert = signal(false);
  alertConfig = signal({ title: '', message: '', type: 'info' as any });

  filteredUsuarios = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.usuarios().filter(u =>
      u.nombre.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.rol.toLowerCase().includes(query)
    );
  });

  readonly Search = Search;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;
  readonly ShieldAlert = ShieldAlert;
  readonly Plus = Plus;
  readonly X = X;
  readonly Upload = Upload;
  readonly Users = Users;
  readonly Info = Info;
  readonly Calendar = Calendar;
  readonly Mail = Mail;
  readonly User = User;
  readonly ShieldCheck = ShieldCheck;
  readonly MapPin = MapPin;
  readonly CheckCircle = CheckCircle;
  readonly UserX = UserX;
  readonly UserCheck = UserCheck;





  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => this.usuarios.set(data),
      error: (err) => console.error('Error loading users', err)
    });
  }

  viewDetail(usuario: Usuario) {
    this.selectedUsuario.set(usuario);
    this.showDetailModal.set(true);
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
    this.selectedUsuario.set(null);
  }

  deleteUser(id: number) {
    if (id === this.currentAdminId) {
      this.alertConfig.set({
        title: 'Acción Denegada',
        message: 'No puedes eliminarte a ti mismo del sistema.',
        type: 'warning'
      });
      this.showAlert.set(true);
      return;
    }

    this.userToDeleteId.set(id);
    this.showConfirmDelete.set(true);
  }

  confirmDelete() {
    const id = this.userToDeleteId();
    if (id !== null) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          this.usuarios.update(users => users.filter(u => u.id !== id));
          this.closeConfirmDelete();
          this.closeDetailModal();
        },
        error: (err) => {
          console.error('Error deleting user', err);
          this.closeConfirmDelete();
          this.alertConfig.set({
            title: 'Error al Eliminar',
            message: 'No se puede eliminar el usuario. Es posible que tenga eventos u otros datos relacionados vinculados a su cuenta.',
            type: 'warning'
          });
          this.showAlert.set(true);
        }
      });
    }
  }

  closeConfirmDelete() {
    this.showConfirmDelete.set(false);
    this.userToDeleteId.set(null);
  }

  editUser(usuario: Usuario) {
    this.formData = { ...usuario };
    this.showAddModal.set(true);
  }

  openAddModal() {
    this.formData = {
      nombre: '',
      apellido: '',
      email: '',
      password_hash: '',
      rol: 'USER',
      activo: true,
      localidad: '',
      biografia: ''
    };
    this.showAddModal.set(true);
  }

  toggleStatus(usuario: Usuario) {
    const nuevoActivo = !usuario.activo;

    this.usuarioService.patchActivo(usuario.id, nuevoActivo).subscribe({
      next: () => {
        const updatedUser = { ...usuario, activo: nuevoActivo };
        this.usuarios.update(users => users.map(u => u.id === usuario.id ? updatedUser : u));
        if (this.selectedUsuario()?.id === usuario.id) {
          this.selectedUsuario.set(updatedUser);
        }
      },
      error: (err) => {
        console.error('Error toggling user status', err);
        this.alertConfig.set({ title: 'Error', message: 'No se pudo cambiar el estado del usuario.', type: 'danger' });
        this.showAlert.set(true);
      }
    });
  }

  saveUsuario() {
    if (!this.formData.nombre || !this.formData.apellido || !this.formData.email || (!this.formData.id && !this.formData.password_hash)) {
      this.alertConfig.set({
        title: 'Campos Incompletos',
        message: 'Por favor, rellena todos los campos obligatorios (*).',
        type: 'warning'
      });
      this.showAlert.set(true);
      return;
    }

    console.log('Saving user data:', this.formData);
    const payload = new FormData();
    payload.append('usuario', new Blob([JSON.stringify(this.formData)], { type: 'application/json' }));

    if (this.formData.id) {
      this.usuarioService.updateUsuario(this.formData.id, payload).subscribe({
        next: (response) => {
          const updated = { ...this.formData };
          this.usuarios.update(users => users.map(u => u.id === this.formData.id ? { ...u, ...updated } : u));
          this.showAddModal.set(false);
          // Refresh list to ensure we have the latest state from DB
          this.loadUsuarios();

          if (this.selectedUsuario()?.id === this.formData.id) {
            this.selectedUsuario.set({ ...this.selectedUsuario()!, ...updated });
          }
        },
        error: (err) => {
          console.error('Error updating user', err);
          this.alertConfig.set({ title: 'Error', message: 'Error al actualizar usuario.', type: 'danger' });
          this.showAlert.set(true);
        }
      });
    } else {
      this.usuarioService.createUsuario(payload).subscribe({
        next: (response) => {
          const inserted = response.insertRealizado;
          this.usuarios.update(users => [inserted, ...users]);
          this.showAddModal.set(false);
        },
        error: (err) => {
          console.error('Error creating user', err);
          this.alertConfig.set({
            title: 'Error',
            message: 'Error al crear usuario. Verifica que el email no esté duplicado.',
            type: 'danger'
          });
          this.showAlert.set(true);
        }
      });
    }
  }
}
