import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { ClienteService } from '../../services/cliente.service';
import { VendedorService } from '../../services/vendedor.service';
import { BusService } from '../../services/bus.service';
import { CiudadService } from '../../services/cuidad.service';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reserva-form.component.html',
  styleUrls: ['./reserva-form.component.css']
})
export class ReservaFormComponent implements OnInit {

  reservaForm!: FormGroup;
  isEditMode = false;
  reservaId: number | null = null;
  error = '';

  clientes: any[] = [];
  vendedores: any[] = [];
  buses: any[] = [];
  ciudades: any[] = [];

  // Modal de asientos
  mostrarModal = false;
  asientos: number[] = [];
  ocupados: number[] = [];
  asientosSeleccionados: number[] = [];

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private clienteService: ClienteService,
    private vendedorService: VendedorService,
    private busService: BusService,
    private ciudadService: CiudadService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.reservaForm = this.fb.group({
      codigo_reserva: [{ value: this.generarCodigoReserva(), disabled: true }],
      fecha_reserva: ['', Validators.required],
      id_cliente: ['', Validators.required],
      id_vendedor: ['', Validators.required],
      id_bus: ['', Validators.required],
      id_ciudad_origen: ['', Validators.required],
      id_ciudad_destino: ['', Validators.required],
      monto_total: ['', [Validators.required, Validators.min(1)]],
      estado: ['PENDIENTE', Validators.required]
    });

    this.cargarSelects();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.reservaId = +params['id'];
        this.cargarReserva(this.reservaId);
      }
    });
  }

  cargarSelects() {
    this.clienteService.listar().subscribe(res =>
      this.clientes = Array.isArray(res.data) ? res.data : res.data ? [res.data] : []
    );

    this.vendedorService.listar().subscribe(res =>
      this.vendedores = Array.isArray(res.data) ? res.data : res.data ? [res.data] : []
    );

    this.busService.listar().subscribe(res =>
      this.buses = Array.isArray(res.data) ? res.data : res.data ? [res.data] : []
    );

    this.ciudadService.listar().subscribe(res =>
      this.ciudades = Array.isArray(res.data) ? res.data : res.data ? [res.data] : []
    );
  }

  cargarReserva(id: number) {
    this.reservaService.obtener(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const reserva = Array.isArray(res.data) ? res.data[0] : res.data;

          this.reservaForm.patchValue(reserva);

          this.reservaForm.get('codigo_reserva')?.disable();
        }
      },
      error: () => this.error = 'Error al cargar la reserva'
    });
  }

  verAsientos() {
    const busId = this.reservaForm.get('id_bus')?.value;
    if (!busId) return;

    this.busService.obtenerAsientos(busId).subscribe(res => {
      if (res.success) {
        this.asientos = Array.from({ length: res.totalAsientos }, (_, i) => i + 1);
        this.ocupados = res.ocupados || [];
        this.asientosSeleccionados = [];
        this.mostrarModal = true;
      }
    }, error => {
      console.error('Error al obtener asientos', error);
    });
  }

  seleccionarAsiento(nro: number) {
    if (this.ocupados.includes(nro)) return;

    const index = this.asientosSeleccionados.indexOf(nro);
    if (index > -1) {
      this.asientosSeleccionados.splice(index, 1);
    } else {
      this.asientosSeleccionados.push(nro);
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  generarCodigoReserva(): string {
    const fecha = new Date();
    const y = fecha.getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);

    return `RES-${y}-${random}`;
  }


  onSubmit() {

    if (
      this.reservaForm.value.id_ciudad_origen ===
      this.reservaForm.value.id_ciudad_destino
    ) {
      this.error = 'La ciudad de origen y destino no pueden ser iguales';
      return;
    }

    if (this.reservaForm.invalid) {
      this.error = 'Complete todos los campos';
      return;
    }

    const data = {
      ...this.reservaForm.getRawValue(),
      asientos: this.asientosSeleccionados
    };

    if (this.isEditMode && this.reservaId) {
      this.reservaService.actualizar(this.reservaId, data).subscribe({
        next: () => this.router.navigate(['/reservas']),
        error: () => this.error = 'Error al actualizar la reserva'
      });
    } else {
      this.reservaService.crear(data).subscribe({
        next: () => this.router.navigate(['/reservas']),
        error: () => this.error = 'Error al crear la reserva'
      });
    }
  }
}


