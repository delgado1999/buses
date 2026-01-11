import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VendedorService } from '../../services/vendedor.service';

@Component({
  selector: 'app-vendedor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './vendedor-form.component.html',
  styleUrl: './vendedor-form.component.css'
})
export class VendedorFormComponent implements OnInit {

  vendedorForm!: FormGroup;

  isEditMode: boolean = false;
  vendedorId: number | null = null;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private vendedorService: VendedorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.vendedorForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      usuario: ['', [Validators.required, Validators.minLength(4)]],
      password: [''],
      estado: ['ACTIVO', Validators.required]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.vendedorId = +params['id'];
        this.cargarVendedor(this.vendedorId);
      }
    });
  }

  cargarVendedor(id: number) {
    this.vendedorService.obtener(id).subscribe({
      next: (res) => {
        if (res.success && res.data && !Array.isArray(res.data)) {
          // ⚠️ No cargar password
          const { password, ...rest } = res.data;
          this.vendedorForm.patchValue(rest);
        }
      },
      error: () => {
        this.error = 'Error al cargar el vendedor';
      }
    });
  }

  onSubmit() {
    if (this.vendedorForm.invalid) {
      this.error = 'Complete correctamente el formulario';
      return;
    }

    const vendedorData = this.vendedorForm.value;

    // Si está editando y no escribió password → no enviar
    if (this.isEditMode && !vendedorData.password) {
      delete vendedorData.password;
    }

    if (this.isEditMode && this.vendedorId) {
      this.vendedorService.actualizar(this.vendedorId, vendedorData).subscribe({
        next: () => this.router.navigate(['/vendedores']),
        error: () => this.error = 'Error al actualizar el vendedor'
      });
    } else {
      this.vendedorService.crear(vendedorData).subscribe({
        next: () => this.router.navigate(['/vendedores']),
        error: () => this.error = 'Error al registrar el vendedor'
      });
    }
  }
}

