export interface Reserva {
  id_reserva?: number;
  codigo_reserva: string;
  fecha_reserva: string;   // ISO date (yyyy-MM-dd)
  id_cliente: number;
  id_vendedor: number;
  id_bus: number;
  id_ciudad_origen: number;
  id_ciudad_destino: number;
  monto_total: number;
  estado?: string; // PENDIENTE | PAGADO | ANULADO, etc.
}

export interface ReservaResponse {
  success: boolean;
  data?: Reserva | Reserva[];
  count?: number;
  mensaje?: string;
  error?: string;
}
