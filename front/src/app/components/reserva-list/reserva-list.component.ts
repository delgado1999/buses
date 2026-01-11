import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../services/reserva.service';
import { Reserva } from '../../models/reserva.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reserva-list.component.html',
  styleUrl: './reserva-list.component.css'
})
export class ReservaListComponent implements OnInit {

  reservas: Reserva[] = [];

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.reservaService.listar().subscribe({
      next: (resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.reservas = resp.data;
        } else {
          this.reservas = [];
        }
      },
      error: () => {
        alert('Error al cargar reservas');
      }
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Está seguro de eliminar esta reserva?')) {
      return;
    }

    this.reservaService.eliminar(id).subscribe({
      next: () => {
        this.listar(); // refresca la tabla
      },
      error: () => {
        alert('Error al eliminar la reserva');
      }
    });
  }
}
