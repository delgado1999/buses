import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CiudadService } from '../../services/cuidad.service';


@Component({
  selector: 'app-ciudad-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ciudad-form.component.html',
  styleUrl: './ciudad-form.component.css'
})
export class CiudadFormComponent implements OnInit {

  ciudadForm!: FormGroup;

  isEditMode: boolean = false;
  ciudadId: number | null = null;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private ciudadService: CiudadService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.ciudadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      estado: ['ACTIVO', Validators.required]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.ciudadId = +params['id'];
        this.cargarCiudad(this.ciudadId);
      }
    });
  }

  cargarCiudad(id: number) {
    this.ciudadService.obtener(id).subscribe({
      next: (res) => {
        if (res.success && res.data && !Array.isArray(res.data)) {
          this.ciudadForm.patchValue(res.data);
        }
      },
      error: () => {
        this.error = 'Error al cargar la ciudad';
      }
    });
  }

  onSubmit() {
    if (this.ciudadForm.invalid) {
      this.error = 'Complete correctamente el formulario';
      return;
    }

    const ciudadData = this.ciudadForm.value;

    if (this.isEditMode && this.ciudadId) {
      this.ciudadService.actualizar(this.ciudadId, ciudadData).subscribe({
        next: () => this.router.navigate(['/ciudades']),
        error: () => this.error = 'Error al actualizar la ciudad'
      });
    } else {
      this.ciudadService.crear(ciudadData).subscribe({
        next: () => this.router.navigate(['/ciudades']),
        error: () => this.error = 'Error al registrar la ciudad'
      });
    }
  }
}

