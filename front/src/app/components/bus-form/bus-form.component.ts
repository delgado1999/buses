import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BusService } from '../../services/bus.service';

@Component({
  selector: 'app-bus-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './bus-form.component.html',
  styleUrl: './bus-form.component.css'
})
export class BusFormComponent implements OnInit {

  busForm!: FormGroup;

  isEditMode: boolean = false;
  busId: number | null = null;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private busService: BusService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.busForm = this.fb.group({
      placa: ['', [Validators.required, Validators.minLength(6)]],
      modelo: [''],
      nro_asientos: ['', [Validators.required, Validators.min(10)]],
      estado: ['ACTIVO', Validators.required]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.busId = +params['id'];
        this.cargarBus(this.busId);
      }
    });
  }

  cargarBus(id: number) {
    this.busService.obtener(id).subscribe({
      next: (res) => {
        if (res.success && res.data && !Array.isArray(res.data)) {
          this.busForm.patchValue(res.data);
        }
      },
      error: () => {
        this.error = 'Error al cargar el bus';
      }
    });
  }

  onSubmit() {
    if (this.busForm.invalid) {
      this.error = 'Complete correctamente el formulario';
      return;
    }

    const busData = this.busForm.value;

    if (this.isEditMode && this.busId) {
      this.busService.actualizar(this.busId, busData).subscribe({
        next: () => this.router.navigate(['/buses']),
        error: () => this.error = 'Error al actualizar el bus'
      });
    } else {
      this.busService.crear(busData).subscribe({
        next: () => this.router.navigate(['/buses']),
        error: () => this.error = 'Error al registrar el bus'
      });
    }
  }
}

