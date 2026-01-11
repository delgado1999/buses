import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // ======================
  // LOGIN (IGUAL AL BACK)
  // ======================
  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      email,
      password
    });
  }

  // ======================
  // GUARDAR SESIÓN
  // ======================
  guardarSesion(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('rol', res.usuario.rol);
    localStorage.setItem('usuario', JSON.stringify(res.usuario));
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }

  esAdmin(): boolean {
    return localStorage.getItem('rol') === 'ADMIN';
  }

  esVendedor(): boolean {
    return localStorage.getItem('rol') === 'VENDEDOR';
  }

  obtenerUsuario() {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }
}
