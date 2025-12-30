export interface Vendedor {
  id_vendedor?: number;
  nombres: string;
  apellidos: string;
  usuario: string;
  password?: string;   // solo para crear / actualizar
  estado?: string;     // ACTIVO / INACTIVO
}

export interface VendedorResponse {
  success: boolean;
  data?: Vendedor | Vendedor[];
  count?: number;
  mensaje?: string;
  error?: string;
}
