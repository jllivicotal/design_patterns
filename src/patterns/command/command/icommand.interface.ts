/**
 * Interfaz Command
 * Define el contrato para todos los comandos ejecutables
 */
export interface ICommand {
  /**
   * Ejecuta el comando
   */
  execute(): void;

  /**
   * Deshace el comando
   */
  undo(): void;

  /**
   * Obtiene una descripción del comando (opcional para logging)
   */
  getDescription?(): string;
}
