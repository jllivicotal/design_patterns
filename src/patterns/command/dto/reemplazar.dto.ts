import { IsInt, IsString, IsNotEmpty, Min } from 'class-validator';

export class ReemplazarDto {
  @IsInt()
  @Min(0)
  desde: number;

  @IsInt()
  @Min(0)
  len: number;

  @IsString()
  @IsNotEmpty()
  nuevo: string;
}
