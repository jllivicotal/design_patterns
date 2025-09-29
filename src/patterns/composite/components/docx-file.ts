import { FileComponent } from './file-component';

/**
 * Hoja del Composite: archivo DOCX
 * Representa un documento de Word con su tamaño específico
 */
export class DocxFile extends FileComponent {
  private size: number;

  constructor(name: string, size: number) {
    super(name);
    this.size = size;
  }

  /**
   * Retorna el tamaño del archivo DOCX
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Representación en string del archivo DOCX
   */
  toString(): string {
    return `DOCX: ${this.name} (${this.size} bytes)`;
  }

  /**
   * Obtiene la extensión del archivo
   */
  getExtension(): string {
    return 'docx';
  }

  /**
   * Obtiene el tipo de archivo
   */
  getType(): string {
    return 'DOCX';
  }
}