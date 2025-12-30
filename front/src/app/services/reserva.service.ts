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

  constructor(private http: HttpClient) {}

  listar(): Observable<ReservaResponse> {
    return this.http.get<ReservaResponse>(this.apiUrl);
  }

  obtener(id: number): Observable<ReservaResponse> {
    return this.http.get<ReservaResponse>(`${this.apiUrl}/${id}`);
  }

  crear(reserva: Reserva): Observable<ReservaResponse> {
    return this.http.post<ReservaResponse>(this.apiUrl, reserva);
  }

  eliminar(id: number): Observable<ReservaResponse> {
    return this.http.delete<ReservaResponse>(`${this.apiUrl}/${id}`);
  }
}

