import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva, ReservaResponse } from '../models/reserva.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) { }

  listar(): Observable<ReservaResponse> {
    return this.http.get<ReservaResponse>(this.apiUrl);
  }

  obtener(id: number): Observable<ReservaResponse> {
    return this.http.get<ReservaResponse>(`${this.apiUrl}/${id}`);
  }

  crear(reserva: Reserva): Observable<ReservaResponse> {
    return this.http.post<ReservaResponse>(this.apiUrl, reserva);
  }

  actualizar(id: number, reserva: Reserva): Observable<ReservaResponse> {
    return this.http.put<ReservaResponse>(`${this.apiUrl}/${id}`, reserva);
  }

  eliminar(id: number): Observable<ReservaResponse> {
    return this.http.delete<ReservaResponse>(`${this.apiUrl}/${id}`);
  }
  obtenerAsientosDisponibles(id_bus: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bus/${id_bus}/asientos-disponibles`);
  }
  obtenerReporte(filtros?: any): Observable<any> {
  let params = {};
  if (filtros) {
    params = {
      ...(filtros.clienteId && { clienteId: filtros.clienteId }),
      ...(filtros.estado && { estado: filtros.estado }),
      ...(filtros.fechaInicio && { fechaInicio: filtros.fechaInicio }),
      ...(filtros.fechaFin && { fechaFin: filtros.fechaFin }),
    };
  }
  return this.http.get<any>(`${this.apiUrl}/reportes`, { params });
}


}
