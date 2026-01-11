import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Ciudad } from '../../models/ciudad.interface';
import { CiudadService } from '../../services/cuidad.service';

@Component({
  selector: 'app-ciudad-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ciudad-list.component.html',
  styleUrl: './ciudad-list.component.css'
})
export class CiudadListComponent implements OnInit {

  ciudades: Ciudad[] = [];

  constructor(private ciudadService: CiudadService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.ciudadService.listar().subscribe(resp => {
      this.ciudades = resp.data as Ciudad[];
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta ciudad?')) {
      this.ciudadService.eliminar(id).subscribe(() => {
        this.listar();
      });
    }
  }
}


