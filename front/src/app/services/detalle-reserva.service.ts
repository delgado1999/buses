import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetalleReserva, DetalleReservaResponse } from '../models/detalle-reserva.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetalleReservaService {

  private apiUrl = `${environment.apiUrl}/detalle-reserva`;

  constructor(private http: HttpClient) {}

  listarPorReserva(idReserva: number): Observable<DetalleReservaResponse> {
    return this.http.get<DetalleReservaResponse>(`${this.apiUrl}/reserva/${idReserva}`);
  }

  crear(detalle: DetalleReserva): Observable<DetalleReservaResponse> {
    return this.http.post<DetalleReservaResponse>(this.apiUrl, detalle);
  }
}

