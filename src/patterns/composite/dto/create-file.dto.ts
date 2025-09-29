import { IsString, IsNumber, IsIn, Min } from 'class-validator';

export class CreateFileDto {
  @IsString()
  name: string;

  @IsString()
  @IsIn(['PDF', 'DOCX', 'XLSX'])
  type: 'PDF' | 'DOCX' | 'XLSX';

  @IsNumber()
  @Min(0)
  size: number;
}