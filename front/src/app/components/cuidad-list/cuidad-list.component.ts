import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ciudad } from '../../models/ciudad.interface';
import { CiudadService } from '../../services/cuidad.service';

@Component({
  selector: 'app-ciudad-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ciudad-list.component.html'
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
}


