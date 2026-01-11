export interface Ciudad {
  id_ciudad: number;
  nombre: string;
  estado: string;
}

export interface CiudadResponse {
  success: boolean;
  data?: Ciudad | Ciudad[];
  count?: number;
  mensaje?: string;
  error?: string;
}
