/**
 * Componente abstracto base para el patrón Composite
 * Define la interfaz común para archivos y carpetas
 */
export abstract class FileComponent {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Obtiene el nombre del componente
   */
  getName(): string {
    return this.name;
  }

  /**
   * Obtiene el tamaño del componente
   * Para archivos: tamaño del archivo
   * Para carpetas: suma recursiva de todos los archivos contenidos
   */
  abstract getSize(): number;

  /**
   * Representación en string del componente
   */
  abstract toString(): string;

  /**
   * Operaciones opcionales para componentes compuestos
   * Por defecto lanzan error (solo implementadas en Folder)
   */
  add(child: FileComponent): void {
    throw new Error('Operación no soportada en este tipo de componente');
  }

  remove(child: FileComponent): void {
    throw new Error('Operación no soportada en este tipo de componente');
  }

  getChildren(): FileComponent[] {
    throw new Error('Operación no soportada en este tipo de componente');
  }
}