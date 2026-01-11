import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.interface';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css'
})
export class ClienteListComponent implements OnInit {

  clientes: Cliente[] = [];

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.clienteService.listar().subscribe(resp => {
      this.clientes = resp.data as Cliente[];
    });
  }

  eliminar(id: number) {
    if (confirm('¿Deseas eliminar este cliente?')) {
      this.clienteService.eliminar(id).subscribe(() => {
        this.listar();
      });
    }
  }
}

