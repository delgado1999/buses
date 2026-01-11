import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusResponse, Bus } from '../models/bus.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  private apiUrl = `${environment.apiUrl}/buses`;

  constructor(private http: HttpClient) {}

  listar(): Observable<BusResponse> {
    return this.http.get<BusResponse>(this.apiUrl);
  }

  obtener(id: number): Observable<BusResponse> {
    return this.http.get<BusResponse>(`${this.apiUrl}/${id}`);
  }
obtenerAsientos(id: number): Observable<{ success: boolean, totalAsientos: number, ocupados: number[] }> {
  return this.http.get<{ success: boolean, totalAsientos: number, ocupados: number[] }>(`${this.apiUrl}/${id}/asientos`);
}


  crear(bus: Bus): Observable<BusResponse> {
    return this.http.post<BusResponse>(this.apiUrl, bus);
  }

  actualizar(id: number, bus: Bus): Observable<BusResponse> {
    return this.http.put<BusResponse>(`${this.apiUrl}/${id}`, bus);
  }

  eliminar(id: number): Observable<BusResponse> {
    return this.http.delete<BusResponse>(`${this.apiUrl}/${id}`);
  }
}
