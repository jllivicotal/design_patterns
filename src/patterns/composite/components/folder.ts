import { FileComponent } from './file-component';

/**
 * Compuesto del Composite: Folder (Carpeta)
 * Puede contener archivos y otras carpetas
 */
export class Folder extends FileComponent {
  private children: FileComponent[] = [];

  constructor(name: string) {
    super(name);
  }

  /**
   * Agrega un componente hijo (archivo o carpeta)
   */
  add(child: FileComponent): void {
    this.children.push(child);
  }

  /**
   * Remueve un componente hijo
   */
  remove(child: FileComponent): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  /**
   * Obtiene todos los componentes hijos
   */
  getChildren(): FileComponent[] {
    return [...this.children]; // Retorna una copia para evitar mutaciones externas
  }

  /**
   * Calcula el tamaño total de la carpeta
   * Suma recursiva de todos los archivos contenidos
   */
  getSize(): number {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  /**
   * Representación en string de la carpeta
   */
  toString(): string {
    return `Folder: ${this.name} (${this.getSize()} bytes, ${this.children.length} items)`;
  }

  /**
   * Obtiene el número de elementos directos en la carpeta
   */
  getDirectItemCount(): number {
    return this.children.length;
  }

  /**
   * Obtiene el número total de archivos (recursivo)
   */
  getTotalFileCount(): number {
    let count = 0;
    for (const child of this.children) {
      if (child instanceof Folder) {
        count += child.getTotalFileCount();
      } else {
        count++;
      }
    }
    return count;
  }

  /**
   * Obtiene la estructura jerárquica de la carpeta
   */
  getStructure(indent: number = 0): string {
    const prefix = '  '.repeat(indent);
    let structure = `${prefix}📁 ${this.name}/ (${this.getSize()} bytes)\n`;
    
    for (const child of this.children) {
      if (child instanceof Folder) {
        structure += child.getStructure(indent + 1);
      } else {
        const icon = this.getFileIcon(child);
        structure += `${prefix}  ${icon} ${child.getName()} (${child.getSize()} bytes)\n`;
      }
    }
    
    return structure;
  }

  /**
   * Obtiene el ícono apropiado para el tipo de archivo
   */
  private getFileIcon(file: FileComponent): string {
    const name = file.constructor.name.toLowerCase();
    switch (name) {
      case 'pdffile': return '📄';
      case 'docxfile': return '📝';
      case 'xlsxfile': return '📊';
      default: return '📄';
    }
  }
}