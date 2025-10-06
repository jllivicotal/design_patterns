import { IsInt, Min } from 'class-validator';

export class BorrarRangoDto {
  @IsInt()
  @Min(0)
  desde: number;

  @IsInt()
  @Min(0)
  hasta: number;
}
