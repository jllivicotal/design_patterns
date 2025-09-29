import { FileComponent } from './file-component';

/**
 * Hoja del Composite: archivo XLSX
 * Representa una hoja de cálculo de Excel con su tamaño específico
 */
export class XlsxFile extends FileComponent {
  private size: number;

  constructor(name: string, size: number) {
    super(name);
    this.size = size;
  }

  /**
   * Retorna el tamaño del archivo XLSX
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Representación en string del archivo XLSX
   */
  toString(): string {
    return `XLSX: ${this.name} (${this.size} bytes)`;
  }

  /**
   * Obtiene la extensión del archivo
   */
  getExtension(): string {
    return 'xlsx';
  }

  /**
   * Obtiene el tipo de archivo
   */
  getType(): string {
    return 'XLSX';
  }
}