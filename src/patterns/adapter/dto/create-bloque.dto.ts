import { IsString, IsNumber, IsIn } from 'class-validator';

/**
 * DTO para crear un nuevo bloque
 */
export class CreateBloqueDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsIn(['CELSIUS', 'FAHRENHEIT'])
  tipoMedicion: 'CELSIUS' | 'FAHRENHEIT';

  @IsNumber()
  temperatura: number;
}