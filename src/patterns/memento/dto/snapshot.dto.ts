import { IsString, IsNotEmpty } from 'class-validator';

export class SnapshotDto {
  @IsString()
  @IsNotEmpty()
  etiqueta: string;
}
