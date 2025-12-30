import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../services/reserva.service';
import { Reserva } from '../../models/reserva.interface';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserva-list.component.html'
})
export class ReservaListComponent implements OnInit {

  reservas: Reserva[] = [];

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.reservaService.listar().subscribe(resp => {
      this.reservas = resp.data as Reserva[];
    });
  }
}

