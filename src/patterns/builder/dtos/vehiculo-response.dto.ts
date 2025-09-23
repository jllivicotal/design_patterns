import { Expose, Transform } from 'class-transformer';
import { TipoVehiculo } from '../models';

export class VehiculoResponseDto {
  @Expose()
  codigo: number;

  @Expose()
  nombre: string;

  @Expose()
  pais: string;

  @Expose()
  placa: string;

  @Expose()
  tipo: TipoVehiculo;

  @Expose()
  propietarioId?: number;

  @Expose()
  @Transform(({ obj }) => obj.getCostoMatricula())
  costoMatricula: number;

  // Propiedades específicas para Auto
  @Expose()
  numPuertas?: number;

  // Propiedades específicas para Camioneta
  @Expose()
  traccion?: string;

  // Propiedades específicas para Camion
  @Expose()
  capacidadTon?: number;
}