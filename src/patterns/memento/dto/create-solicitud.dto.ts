import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDatosAlumnoDto } from './create-datos-alumno.dto';

export class CreateAdjuntoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  tamanio: number;
}

export class CreateSolicitudDto {
  @ValidateNested()
  @Type(() => CreateDatosAlumnoDto)
  datosAlumno: CreateDatosAlumnoDto;

  @IsString()
  @IsNotEmpty()
  tipoCertificado: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAdjuntoDto)
  @IsOptional()
  adjuntos?: CreateAdjuntoDto[];
}
