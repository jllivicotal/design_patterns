import { ICommand } from './icommand.interface';

/**
 * Composite Command: Macro Command
 * Agrupa múltiples comandos y los ejecuta como uno solo
 */
export class MacroCommand implements ICommand {
  private comandos: ICommand[] = [];
  private nombre: string;
  private fechaCreacion: string;

  constructor(nombre: string) {
    this.nombre = nombre;
    this.fechaCreacion = new Date().toISOString();
  }

  /**
   * Agrega un comando al macro
   */
  add(cmd: ICommand): void {
    this.comandos.push(cmd);
  }

  /**
   * Ejecuta todos los comandos en orden
   */
  execute(): void {
    for (const cmd of this.comandos) {
      cmd.execute();
    }
  }

  /**
   * Deshace todos los comandos en orden inverso
   */
  undo(): void {
    // Deshacer en orden inverso
    for (let i = this.comandos.length - 1; i >= 0; i--) {
      this.comandos[i].undo();
    }
  }

  getDescription(): string {
    return `Macro "${this.nombre}" con ${this.comandos.length} comandos`;
  }

  /**
   * Obtiene el nombre del macro
   */
  getNombre(): string {
    return this.nombre;
  }

  /**
   * Obtiene la lista de comandos
   */
  getComandos(): ICommand[] {
    return [...this.comandos]; // Retorna una copia
  }

  /**
   * Obtiene la fecha de creación del macro
   */
  getFechaCreacion(): string {
    return this.fechaCreacion;
  }

  /**
   * Limpia todos los comandos del macro
   */
  limpiar(): void {
    this.comandos = [];
  }
}
