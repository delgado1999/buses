import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleReservaService } from '../../services/detalle-reserva.service';
import { DetalleReserva } from '../../models/detalle-reserva.interface';

@Component({
  selector: 'app-detalle-reserva-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-reserva-list.component.html'
})
export class DetalleReservaListComponent implements OnInit {

  detalles: DetalleReserva[] = [];
  idReserva = 1; // prueba

  constructor(private detalleService: DetalleReservaService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.detalleService.listarPorReserva(this.idReserva).subscribe(resp => {
      this.detalles = resp.data as DetalleReserva[];
    });
  }
}



