import { Expose, Transform } from 'class-transformer';
import { TipoActivo } from '../models';

export class ActivoResponseDto {
  @Expose()
  codigo: number;

  @Expose()
  nombre: string;

  @Expose()
  precio: number;

  @Expose()
  tipo: TipoActivo;

  @Expose()
  @Transform(({ obj }) => obj.valorActual())
  valorActual: number;

  @Expose()
  opciones?: {
    vidaUtilMeses?: number;
    marca?: string;
    modelo?: string;
    serie?: string;
    color?: string;
    dimensiones?: string;
    material?: string;
    placaVehiculo?: string;
  };

  // Campos específicos para Computador
  @Expose()
  cpu?: string;

  @Expose()
  ramGB?: number;

  // Campos específicos para Mesa
  @Expose()
  material?: string;

  // Campos específicos para AutoAF
  @Expose()
  placa?: string;

  // Campos específicos para Silla
  @Expose()
  ergonomica?: boolean;
}