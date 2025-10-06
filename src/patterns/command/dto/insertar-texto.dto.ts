import { IsInt, IsString, IsNotEmpty, Min } from 'class-validator';

export class InsertarTextoDto {
  @IsInt()
  @Min(0)
  pos: number;

  @IsString()
  @IsNotEmpty()
  texto: string;
}
