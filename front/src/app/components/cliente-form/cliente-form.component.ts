import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent implements OnInit {

  clienteForm!: FormGroup;

  isEditMode: boolean = false;
  clienteId: number | null = null;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.clienteForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      telefono: [''],
      correo: ['', Validators.email],
      id_ciudad: ['']
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.clienteId = +params['id'];
        this.cargarCliente(this.clienteId);
      }
    });
  }

  cargarCliente(id: number) {
    this.clienteService.obtener(id).subscribe({
      next: (res) => {
        if (res.success && res.data && !Array.isArray(res.data)) {
          this.clienteForm.patchValue(res.data);
        }
      },
      error: () => {
        this.error = 'Error al cargar el cliente';
      }
    });
  }

  onSubmit() {
    if (this.clienteForm.invalid) {
      this.error = 'Complete correctamente el formulario';
      return;
    }

    const clienteData = this.clienteForm.value;

    if (this.isEditMode && this.clienteId) {
      this.clienteService.actualizar(this.clienteId, clienteData).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: () => this.error = 'Error al actualizar el cliente'
      });
    } else {
      this.clienteService.crear(clienteData).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: () => this.error = 'Error al registrar el cliente'
      });
    }
  }
}
