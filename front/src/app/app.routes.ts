import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

import { VendedorListComponent } from './components/vendedor-list/vendedor-list.component';
import { ClienteListComponent } from './components/cliente-list/cliente-list.component';
import { BusListComponent } from './components/bus-list/bus-list.component';
import { ReservaListComponent } from './components/reserva-list/reserva-list.component';
import { DetalleReservaListComponent } from './components/detalle-reserva-list/detalle-reserva-list.component';
import { CiudadListComponent } from './components/ciudad-list/ciudad-list.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ReservaFormComponent } from './components/reserva-form/reserva-form.component';
import { ClienteFormComponent } from './components/cliente-form/cliente-form.component';
import { BusFormComponent } from './components/bus-form/bus-form.component';
import { CiudadFormComponent } from './components/ciudad-form/ciudad-form.component';
import { VendedorFormComponent } from './components/vendedor-form/vendedor-form.component';
import { ReporteReservasComponent } from './components/reporte-reservas/reporte-reservas.component';

export const routes: Routes = [
  // Ruta pública para login
  { path: 'login', component: LoginComponent },

  // Rutas protegidas dentro del Layout
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'vendedores', pathMatch: 'full' },

      { path: 'vendedores', component: VendedorListComponent },
      { path: 'vendedores/nuevo', component: VendedorFormComponent },
      { path: 'vendedores/editar/:id', component: VendedorFormComponent },

      { path: 'clientes', component: ClienteListComponent },
      { path: 'clientes/nuevo', component: ClienteFormComponent },
      { path: 'clientes/editar/:id', component: ClienteFormComponent },

      { path: 'buses', component: BusListComponent },
      { path: 'buses/nuevo', component: BusFormComponent },
      { path: 'buses/editar/:id', component: BusFormComponent },

      { path: 'ciudades', component: CiudadListComponent },
      { path: 'ciudades/nuevo', component: CiudadFormComponent },
      { path: 'ciudades/editar/:id', component: CiudadFormComponent },

      { path: 'reservas', component: ReservaListComponent },
      { path: 'reservas/nuevo', component: ReservaFormComponent },
      { path: 'reservas/editar/:id', component: ReservaFormComponent },

      { path: 'detalles-reserva', component: DetalleReservaListComponent },
      { path: 'reportes', component: ReporteReservasComponent }
    ]
  },

  // Cualquier ruta que no exista, redirige al login
  { path: '**', redirectTo: 'login' }
];
