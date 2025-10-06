import { IsString, IsOptional } from 'class-validator';

export class UpdateSolicitudDto {
  @IsString()
  @IsOptional()
  tipoCertificado?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
