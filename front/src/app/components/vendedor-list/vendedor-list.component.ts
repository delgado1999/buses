import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendedorService } from '../../services/vendedor.service';
import { Vendedor } from '../../models/vendedor.interface';

@Component({
  selector: 'app-vendedor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendedor-list.component.html'
})
export class VendedorListComponent implements OnInit {

  vendedores: Vendedor[] = [];

  constructor(private vendedorService: VendedorService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.vendedorService.listar().subscribe(resp => {
      this.vendedores = resp.data as Vendedor[];
    });
  }
}

