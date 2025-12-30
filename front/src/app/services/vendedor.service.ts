import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendedor, VendedorResponse } from '../models/vendedor.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {

  private apiUrl = `${environment.apiUrl}/vendedores`;

  constructor(private http: HttpClient) {}

  listar(): Observable<VendedorResponse> {
    return this.http.get<VendedorResponse>(this.apiUrl);
  }

  obtener(id: number): Observable<VendedorResponse> {
    return this.http.get<VendedorResponse>(`${this.apiUrl}/${id}`);
  }

  crear(vendedor: Vendedor): Observable<VendedorResponse> {
    return this.http.post<VendedorResponse>(this.apiUrl, vendedor);
  }

  actualizar(id: number, vendedor: Vendedor): Observable<VendedorResponse> {
    return this.http.put<VendedorResponse>(`${this.apiUrl}/${id}`, vendedor);
  }

  eliminar(id: number): Observable<VendedorResponse> {
    return this.http.delete<VendedorResponse>(`${this.apiUrl}/${id}`);
  }
}

