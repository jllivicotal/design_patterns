import { FileComponent } from './file-component';

/**
 * Hoja del Composite: archivo PDF
 * Representa un archivo PDF con su tamaño específico
 */
export class PdfFile extends FileComponent {
  private size: number;

  constructor(name: string, size: number) {
    super(name);
    this.size = size;
  }

  /**
   * Retorna el tamaño del archivo PDF
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Representación en string del archivo PDF
   */
  toString(): string {
    return `PDF: ${this.name} (${this.size} bytes)`;
  }

  /**
   * Obtiene la extensión del archivo
   */
  getExtension(): string {
    return 'pdf';
  }

  /**
   * Obtiene el tipo de archivo
   */
  getType(): string {
    return 'PDF';
  }
}