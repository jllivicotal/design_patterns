import { IsString, IsInt, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TipoVehiculo } from '../models';

export class ActualizarVehiculoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsOptional()
  @IsString()
  placa?: string;

  @IsOptional()
  @IsEnum(TipoVehiculo)
  tipo?: TipoVehiculo;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  propietarioId?: number;

  // Propiedades específicas para Auto
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  numPuertas?: number;

  // Propiedades específicas para Camioneta
  @IsOptional()
  @IsString()
  traccion?: string;

  // Propiedades específicas para Camion
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  capacidadTon?: number;
}