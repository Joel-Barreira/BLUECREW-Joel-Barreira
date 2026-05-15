import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
}

export interface Evento {
  idEvento: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estadoEvento: string; // 'PENDIENTE', 'APROBADO', 'RECHAZADO', 'ARCHIVADO'
  ubicacion: string;
  imagen?: string;
  participantes?: number;
  finalizado?: boolean;
  materialNecesario?: string;
  categoria?: Categoria;
}

@Injectable({
  providedIn: 'root'
})
export class EventoService extends ApiService {
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/eventos`);
  }

  deleteEvento(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/eventos/${id}`);
  }

  updateEvento(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/eventos/${id}`, formData);
  }

  patchEstado(id: number, estado: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/eventos/${id}/estado?estado=${estado}`, {});
  }

  createEvento(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/eventos`, formData);
  }
}
