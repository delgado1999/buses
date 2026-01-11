import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        // Guardamos sesión
        this.authService.guardarSesion(res);

        // Redirigir al LayoutComponent
        this.router.navigate(['/']); 
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
      }
    });
  }
}
