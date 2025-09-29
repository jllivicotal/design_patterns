import { IsString } from 'class-validator';

export class AddToFolderDto {
  @IsString()
  folderPath: string;

  @IsString()
  itemName: string;
}