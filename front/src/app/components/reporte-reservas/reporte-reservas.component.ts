import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva.service';
import { ClienteService } from '../../services/cliente.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DetalleReserva } from '../../models/detalle-reserva.interface';

@Component({
  selector: 'app-reporte-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-reservas.component.html',
  styleUrls: ['./reporte-reservas.component.css']
})
export class ReporteReservasComponent implements OnInit {

  reservas: any[] = [];
  clientes: any[] = [];
  error: string = '';

  filtros = {
    clienteId: '',
    estado: '',
    fechaInicio: '',
    fechaFin: ''
  };

  constructor(
    private reservaService: ReservaService,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.cargarClientes();
    this.cargarReporte();
  }

  // =====================
  // Cargar reservas
  // =====================
  cargarReporte() {
    this.reservaService.obtenerReporte(this.filtros).subscribe({
      next: (res) => this.reservas = res.reservas || [],
      error: () => this.error = 'Error al cargar reporte'
    });
  }

  // =====================
  // Cargar clientes
  // =====================
  cargarClientes() {
  this.clienteService.listar().subscribe({
    next: (res) => {
      if (res.success && Array.isArray(res.data)) {
        this.clientes = res.data;
      } else {
        this.clientes = [];
        console.warn('No hay clientes disponibles', res.mensaje);
      }
    },
    error: (err) => {
      console.error('Error al cargar clientes', err);
      this.error = 'Error al cargar clientes';
    }
  });
}

  // =====================
  // Limpiar filtros
  // =====================
  limpiarFiltros() {
    this.filtros = { clienteId: '', estado: '', fechaInicio: '', fechaFin: '' };
    this.cargarReporte();
  }

  // =====================
  // Exportar a Excel
  // =====================
  exportarExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reservas.map(r => ({
      Código: r.codigo_reserva,
      Cliente: `${r.cliente_nombres} ${r.cliente_apellidos}`,
      Vendedor: `${r.vendedor_nombres} ${r.vendedor_apellidos}`,
      Bus: `${r.bus_placa} - ${r.bus_modelo}`,
      Origen: r.ciudad_origen,
      Destino: r.ciudad_destino,
      Fecha: r.fecha_reserva,
      Monto: r.monto_total,
      Estado: r.estado,
      Asientos: (r.asientos ?? []).map((a: DetalleReserva) => a.nro_asiento).join(', ')
    })));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reservas');
    XLSX.writeFile(wb, 'reporte_reservas.xlsx');
  }

  // =====================
  // Exportar a PDF
  // =====================
  exportarPDF() {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Código', 'Cliente', 'Vendedor', 'Bus', 'Origen', 'Destino', 'Fecha', 'Monto', 'Estado', 'Asientos']],
      body: this.reservas.map(r => [
        r.codigo_reserva,
        `${r.cliente_nombres} ${r.cliente_apellidos}`,
        `${r.vendedor_nombres} ${r.vendedor_apellidos}`,
        `${r.bus_placa} - ${r.bus_modelo}`,
        r.ciudad_origen,
        r.ciudad_destino,
        r.fecha_reserva,
        r.monto_total,
        r.estado,
        (r.asientos ?? []).map((a: DetalleReserva) => a.nro_asiento).join(', ')
      ])
    });
    doc.save('reporte_reservas.pdf');
  }

  // =====================
  // Helper para Asientos
  // =====================
  isLast(item: any, array: any[]): boolean {
    return array.indexOf(item) === array.length - 1;
  }

}
