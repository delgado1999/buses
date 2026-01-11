import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VendedorService } from '../../services/vendedor.service';
import { Vendedor } from '../../models/vendedor.interface';

@Component({
  selector: 'app-vendedor-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vendedor-list.component.html',
  styleUrl: './vendedor-list.component.css'
})
export class VendedorListComponent implements OnInit {

  vendedores: Vendedor[] = [];

  constructor(private vendedorService: VendedorService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.vendedorService.listar().subscribe(resp => {
      if (resp.success && Array.isArray(resp.data)) {
        this.vendedores = resp.data;
      } else {
        this.vendedores = [];
      }
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Está seguro de eliminar este vendedor?')) {
      return;
    }

    this.vendedorService.eliminar(id).subscribe({
      next: () => {
        this.listar();
      },
      error: () => {
        alert('Error al eliminar vendedor');
      }
    });
  }
}


