import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface MensajeContacto {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  direccion?: string;
  mensaje: string;
  fechaCreacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactoService extends ApiService {
  getMensajes(): Observable<MensajeContacto[]> {
    return this.http.get<MensajeContacto[]>(`${this.baseUrl}/contactos`);
  }

  deleteMensaje(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/contactos/${id}`);
  }
}
