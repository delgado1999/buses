import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BusService } from '../../services/bus.service';
import { Bus } from '../../models/bus.interface';

@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bus-list.component.html',
  styleUrl: './bus-list.component.css'
})
export class BusListComponent implements OnInit {

  buses: Bus[] = [];

  constructor(private busService: BusService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.busService.listar().subscribe(resp => {
      if (resp.success && Array.isArray(resp.data)) {
        this.buses = resp.data;
      } else {
        this.buses = [];
      }
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Está seguro de eliminar este bus?')) {
      return;
    }

    this.busService.eliminar(id).subscribe({
      next: () => this.listar(),
      error: () => alert('Error al eliminar el bus')
    });
  }
}


