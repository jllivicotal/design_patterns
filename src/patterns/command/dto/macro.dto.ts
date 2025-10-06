import { IsString, IsNotEmpty } from 'class-validator';

export class MacroDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
