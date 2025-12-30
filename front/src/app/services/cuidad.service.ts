import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ciudad, CiudadResponse } from '../models/ciudad.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

  private apiUrl = `${environment.apiUrl}/ciudades`;

  constructor(private http: HttpClient) {}

  listar(): Observable<CiudadResponse> {
    return this.http.get<CiudadResponse>(this.apiUrl);
  }

  obtener(id: number): Observable<CiudadResponse> {
    return this.http.get<CiudadResponse>(`${this.apiUrl}/${id}`);
  }

  crear(ciudad: Ciudad): Observable<CiudadResponse> {
    return this.http.post<CiudadResponse>(this.apiUrl, ciudad);
  }

  actualizar(id: number, ciudad: Ciudad): Observable<CiudadResponse> {
    return this.http.put<CiudadResponse>(`${this.apiUrl}/${id}`, ciudad);
  }

  eliminar(id: number): Observable<CiudadResponse> {
    return this.http.delete<CiudadResponse>(`${this.apiUrl}/${id}`);
  }
}

