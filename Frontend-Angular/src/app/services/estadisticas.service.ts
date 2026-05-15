import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface EstadisticasGlobales {
  Voluntarios_Activos: number;
  Eventos_Finalizados: number;
  Total_Basura: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService extends ApiService {
  getEstadisticasGlobales(): Observable<EstadisticasGlobales> {
    return this.http.get<EstadisticasGlobales>(`${this.baseUrl}/estadisticas/globales`);
  }
}
