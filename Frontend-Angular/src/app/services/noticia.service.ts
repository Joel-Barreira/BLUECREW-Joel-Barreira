import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
}

export interface Noticia {
  idNoticia: number;
  titulo: string;
  descripcion: string;
  fechaPublicacion?: string;
  estadoAprobacionNoticia: string; // 'PENDIENTE', 'APROBADO', 'RECHAZADO'
  estadoVisibilidad: boolean; // true = 'PUBLICADA', false = 'BORRADOR'
  imagen?: string;
  categoria?: Categoria;
  citaDestacada?: string;
  autor?: { id: number; nombre: string; apellido: string };
}

@Injectable({
  providedIn: 'root'
})
export class NoticiaService extends ApiService {
  getNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(`${this.baseUrl}/noticias`);
  }

  deleteNoticia(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/noticias/${id}`);
  }

  updateNoticia(noticia: Noticia): Observable<any> {
    return this.http.put(`${this.baseUrl}/noticias`, noticia);
  }

  updateVisibilidad(id: number, estado: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/noticias/${id}/visibilidad?estado=${estado}`, {});
  }

  patchEstadoAprobacion(id: number, estado: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/noticias/${id}/estado?estado=${estado}`, {});
  }

  createNoticia(noticia: Partial<Noticia>): Observable<any> {
    return this.http.post(`${this.baseUrl}/noticias`, noticia);
  }
}
