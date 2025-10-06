import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateDatosAlumnoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsString()
  @IsNotEmpty()
  matricula: string;

  @IsString()
  @IsNotEmpty()
  carrera: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
