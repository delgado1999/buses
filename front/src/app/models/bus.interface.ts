export interface Bus {
  id_bus?: number;
  placa: string;
  modelo?: string;
  nro_asientos: number;
  estado?: string;
}

export interface BusResponse {
  success: boolean;
  data?: Bus | Bus[];
  count?: number;
  mensaje?: string;
  error?: string;
}
