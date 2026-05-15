import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, ShieldAlert } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '/estadisticas';
  readonly ShieldAlert = ShieldAlert;

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    // Redirigir al panel si ya está logueado como admin
    if (this.authService.currentUserValue && this.authService.isAdmin()) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Obtener return url de los parámetros de la ruta, si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/estadisticas';
  }

  // Getters para acceder fácil a los campos del formulario
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login({
      email: this.f['email'].value,
      password: this.f['password'].value
    }).subscribe({
      next: (response) => {
        // Verificar si es admin después del login
        if (this.authService.isAdmin()) {
          this.router.navigate([this.returnUrl]);
        } else {
          // Si no es admin, forzamos el logout y mostramos error
          this.authService.logout();
          this.error = 'Acceso denegado. No tienes permisos de administrador.';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Credenciales incorrectas o error de conexión.';
        this.loading = false;
      }
    });
  }
}
