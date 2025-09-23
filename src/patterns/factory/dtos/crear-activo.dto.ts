import { IsNumber, IsString, IsEnum, IsOptional, IsBoolean, IsInt, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { TipoActivo } from '../models';

export class OpcionesActivoDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  vidaUtilMeses?: number;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  serie?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  dimensiones?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  placaVehiculo?: string;
}

export class CrearActivoDto {
  @IsNumber()
  @Type(() => Number)
  codigo: number;

  @IsString()
  nombre: string;

  @IsNumber()
  @Type(() => Number)
  precio: number;

  @IsEnum(TipoActivo)
  tipo: TipoActivo;

  @IsOptional()
  @ValidateNested()
  @Type(() => OpcionesActivoDto)
  opciones?: OpcionesActivoDto;

  // Campos específicos para Computador
  @IsOptional()
  @IsString()
  cpu?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  ramGB?: number;

  // Campos específicos para Mesa
  @IsOptional()
  @IsString()
  material?: string;

  // Campos específicos para AutoAF
  @IsOptional()
  @IsString()
  placa?: string;

  // Campos específicos para Silla
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  ergonomica?: boolean;
}