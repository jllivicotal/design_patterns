import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { 
  FileComponent, 
  Folder, 
  PdfFile, 
  DocxFile, 
  XlsxFile 
} from '../components';
import { 
  CreateFileDto, 
  CreateFolderDto, 
  AddToFolderDto, 
  FileSystemNodeDto 
} from '../dto';

/**
 * Servicio para manejar el sistema de archivos usando el patrón Composite
 */
@Injectable()
export class FileSystemService {
  private root: Folder;

  constructor() {
    // Inicializar con un sistema de archivos de ejemplo
    this.initializeFileSystem();
  }

  /**
   * Inicializa el sistema de archivos con datos de ejemplo
   */
  private initializeFileSystem(): void {
    this.root = new Folder('root');
    
    // Crear estructura de ejemplo
    const documents = new Folder('Documentos');
    const images = new Folder('Imagenes');
    const work = new Folder('Trabajo');
    
    // Archivos en Documentos
    documents.add(new PdfFile('manual.pdf', 2048000));
    documents.add(new DocxFile('carta.docx', 512000));
    documents.add(new XlsxFile('presupuesto.xlsx', 1024000));
    
    // Subcarpeta en Trabajo
    const reports = new Folder('Reportes');
    reports.add(new PdfFile('reporte_anual.pdf', 3072000));
    reports.add(new XlsxFile('ventas_q1.xlsx', 2560000));
    work.add(reports);
    work.add(new DocxFile('propuesta.docx', 768000));
    
    // Agregar carpetas principales al root
    this.root.add(documents);
    this.root.add(images);
    this.root.add(work);
  }

  /**
   * Obtiene el sistema de archivos completo
   */
  getFileSystem(): FileSystemNodeDto {
    return this.convertToDto(this.root, '/');
  }

  /**
   * Crea un nuevo archivo
   */
  createFile(createFileDto: CreateFileDto): FileComponent {
    let file: FileComponent;
    
    switch (createFileDto.type) {
      case 'PDF':
        file = new PdfFile(createFileDto.name, createFileDto.size);
        break;
      case 'DOCX':
        file = new DocxFile(createFileDto.name, createFileDto.size);
        break;
      case 'XLSX':
        file = new XlsxFile(createFileDto.name, createFileDto.size);
        break;
      default:
        throw new BadRequestException('Tipo de archivo no soportado');
    }
    
    return file;
  }

  /**
   * Crea una nueva carpeta
   */
  createFolder(createFolderDto: CreateFolderDto): Folder {
    return new Folder(createFolderDto.name);
  }

  /**
   * Agrega un elemento a una carpeta
   */
  addToFolder(addToFolderDto: AddToFolderDto): void {
    const folder = this.findFolder(addToFolderDto.folderPath);
    if (!folder) {
      throw new NotFoundException(`Carpeta no encontrada: ${addToFolderDto.folderPath}`);
    }

    const item = this.findItem(addToFolderDto.itemName);
    if (!item) {
      throw new NotFoundException(`Elemento no encontrado: ${addToFolderDto.itemName}`);
    }

    folder.add(item);
  }

  /**
   * Obtiene información de un elemento específico por ruta
   */
  getItemByPath(path: string): FileSystemNodeDto | null {
    const item = this.findItemByPath(path);
    if (!item) {
      return null;
    }
    return this.convertToDto(item, path);
  }

  /**
   * Obtiene el tamaño total del sistema de archivos
   */
  getTotalSize(): number {
    return this.root.getSize();
  }

  /**
   * Obtiene la estructura jerárquica como texto
   */
  getStructure(): string {
    return this.root.getStructure();
  }

  /**
   * Obtiene estadísticas del sistema de archivos
   */
  getStatistics() {
    return {
      totalSize: this.root.getSize(),
      totalFiles: this.root.getTotalFileCount(),
      totalFolders: this.countFolders(this.root),
      structure: this.root.getStructure()
    };
  }

  /**
   * Convierte un FileComponent a DTO
   */
  private convertToDto(component: FileComponent, path: string): FileSystemNodeDto {
    const isFolder = component instanceof Folder;
    
    const dto: FileSystemNodeDto = {
      name: component.getName(),
      type: isFolder ? 'folder' : 'file',
      size: component.getSize(),
      path: path
    };

    if (!isFolder) {
      // Es un archivo, determinar el tipo
      const constructor = component.constructor.name.toLowerCase();
      if (constructor.includes('pdf')) dto.fileType = 'PDF';
      else if (constructor.includes('docx')) dto.fileType = 'DOCX';
      else if (constructor.includes('xlsx')) dto.fileType = 'XLSX';
    } else {
      // Es una carpeta, agregar hijos
      const folder = component as Folder;
      dto.children = folder.getChildren().map((child, index) => 
        this.convertToDto(child, `${path}/${child.getName()}`)
      );
    }

    return dto;
  }

  /**
   * Busca una carpeta por ruta
   */
  private findFolder(path: string): Folder | null {
    const item = this.findItemByPath(path);
    return item instanceof Folder ? item : null;
  }

  /**
   * Busca un elemento por nombre (búsqueda simple)
   */
  private findItem(name: string): FileComponent | null {
    return this.searchInFolder(this.root, name);
  }

  /**
   * Busca un elemento por ruta completa
   */
  private findItemByPath(path: string): FileComponent | null {
    const parts = path.split('/').filter(part => part.length > 0);
    let current: FileComponent = this.root;

    for (const part of parts) {
      if (!(current instanceof Folder)) {
        return null;
      }
      
      const found = current.getChildren().find(child => child.getName() === part);
      if (!found) {
        return null;
      }
      current = found;
    }

    return current;
  }

  /**
   * Busca recursivamente en una carpeta
   */
  private searchInFolder(folder: Folder, name: string): FileComponent | null {
    // Buscar en hijos directos
    const direct = folder.getChildren().find(child => child.getName() === name);
    if (direct) {
      return direct;
    }

    // Buscar recursivamente en subcarpetas
    for (const child of folder.getChildren()) {
      if (child instanceof Folder) {
        const found = this.searchInFolder(child, name);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  /**
   * Cuenta el número total de carpetas
   */
  private countFolders(folder: Folder): number {
    let count = 1; // La carpeta actual
    
    for (const child of folder.getChildren()) {
      if (child instanceof Folder) {
        count += this.countFolders(child);
      }
    }
    
    return count;
  }
}