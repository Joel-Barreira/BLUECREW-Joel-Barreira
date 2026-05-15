import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, AlertTriangle, Info, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="modal-backdrop fade show"></div>
    <div class="modal fade show d-block" tabindex="-1" (click)="onCancel()">
      <div class="modal-dialog modal-dialog-centered" (click)="$event.stopPropagation()">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="modal-header border-0 bg-light p-4">
            <div class="d-flex align-items-center gap-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center bg-opacity-10" 
                   [ngClass]="getIconBgClass()"
                   style="width: 40px; height: 40px;">
                <lucide-icon [img]="getIcon()" [ngClass]="getIconTextClass()" size="20"></lucide-icon>
              </div>
              <h2 class="modal-title h5 mb-0 fw-bold text-secondary">{{ title }}</h2>
            </div>
            <button type="button" class="btn-close shadow-none" (click)="onCancel()"></button>
          </div>

          <div class="modal-body p-4">
            <p class="mb-0 text-muted fs-6">{{ message }}</p>
          </div>

          <div class="modal-footer border-0 p-4 pt-0 gap-2">
            <button 
              *ngIf="showCancel"
              type="button"
              class="btn btn-light rounded-pill px-4" 
              (click)="onCancel()">
              {{ cancelText }}
            </button>
            <button 
              type="button"
              class="btn rounded-pill px-4 shadow-sm" 
              [ngClass]="getConfirmButtonClass()"
              (click)="onConfirm()">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ConfirmModalComponent {
  @Input() title: string = 'Confirmar';
  @Input() message: string = '¿Estás seguro de realizar esta acción?';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() type: 'danger' | 'info' | 'success' | 'warning' = 'danger';
  @Input() showCancel: boolean = true;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  readonly X = X;
  readonly AlertTriangle = AlertTriangle;
  readonly Info = Info;
  readonly CheckCircle = CheckCircle;

  getIcon() {
    switch (this.type) {
      case 'danger':
      case 'warning':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      default:
        return Info;
    }
  }

  getIconBgClass() {
    switch (this.type) {
      case 'danger': return 'bg-danger';
      case 'warning': return 'bg-warning';
      case 'success': return 'bg-success';
      default: return 'bg-primary';
    }
  }

  getIconTextClass() {
    switch (this.type) {
      case 'danger': return 'text-danger';
      case 'warning': return 'text-warning';
      case 'success': return 'text-success';
      default: return 'text-primary';
    }
  }

  getConfirmButtonClass() {
    switch (this.type) {
      case 'danger': return 'btn-danger';
      case 'success': return 'btn-success';
      case 'warning': return 'btn-warning';
      default: return 'btn-primary';
    }
  }

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
