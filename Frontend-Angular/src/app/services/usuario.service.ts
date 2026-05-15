import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  activo: boolean;
  foto?: string;
  localidad?: string;
  biografia?: string;
  eventosCompletados?: number;
  crearEvento?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends ApiService {
  
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`);
  }

  updateUsuario(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/${id}`, data);
  }

  patchActivo(id: number, activo: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/usuarios/${id}/activo?activo=${activo}`, {});
  }

  createUsuario(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, formData);
  }
}
