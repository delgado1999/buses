import { Routes } from '@angular/router';

import { VendedorListComponent } from './components/vendedor-list/vendedor-list.component';
import { ClienteListComponent } from './components/cliente-list/cliente-list.component';
import { BusListComponent } from './components/bus-list/bus-list.component';
import { ReservaListComponent } from './components/reserva-list/reserva-list.component';
import { DetalleReservaListComponent } from './components/detalle-reserva-list/detalle-reserva-list.component';
import { CiudadListComponent } from './components/ciudad-list/ciudad-list.component';


export const routes: Routes = [
  { path: '', redirectTo: 'vendedores', pathMatch: 'full' },

  { path: 'vendedores', component: VendedorListComponent },
  { path: 'clientes', component: ClienteListComponent },
  { path: 'buses', component: BusListComponent },
  { path: 'ciudades', component: CiudadListComponent },
  { path: 'reservas', component: ReservaListComponent },
  { path: 'detalles-reserva', component: DetalleReservaListComponent },
];
