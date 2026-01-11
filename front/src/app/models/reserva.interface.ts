import { DetalleReserva } from "./detalle-reserva.interface";

export interface Reserva {
  id_reserva?: number;
  codigo_reserva: string;
  fecha_reserva: string; 
  id_cliente: number;
  id_vendedor: number;
  id_bus: number;
  id_ciudad_origen: number;
  id_ciudad_destino: number;
  monto_total: number;
  estado?: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';

  // Campos para mostrar nombres en listados
  cliente: string;        // quitar el ?
  vendedor: string;       // quitar el ?
  bus: string;            // quitar el ?
  ciudad_origen: string;  // quitar el ?
  ciudad_destino: string; // quitar el ?
  asientos?: DetalleReserva[];
}


export interface ReservaResponse {
  success: boolean;
  data?: Reserva | Reserva[];
  count?: number;
  mensaje?: string;
  error?: string;
}


