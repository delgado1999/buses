export interface Cliente {
  id_cliente?: number;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono?: string | null;
  correo?: string | null;
  id_ciudad?: number | null;
}

export interface ClienteResponse {
  success: boolean;
  data?: Cliente | Cliente[];
  count?: number;
  mensaje?: string;
  error?: string;
}
