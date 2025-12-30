export interface DetalleReserva {
  id_detalle?: number;
  id_reserva: number;
  nro_asiento: number;
  precio: number;
}

export interface DetalleReservaResponse {
  success: boolean;
  data?: DetalleReserva | DetalleReserva[];
  count?: number;
  mensaje?: string;
  error?: string;
}
