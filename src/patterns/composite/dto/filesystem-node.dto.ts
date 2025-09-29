export interface FileSystemNodeDto {
  name: string;
  type: 'file' | 'folder';
  size: number;
  fileType?: 'PDF' | 'DOCX' | 'XLSX';
  children?: FileSystemNodeDto[];
  path: string;
}