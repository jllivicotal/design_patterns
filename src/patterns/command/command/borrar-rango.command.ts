import { ICommand } from './icommand.interface';
import { Documento } from '../receiver';

/**
 * Concrete Command: Borrar Rango
 * Borra un rango de texto del documento
 */
export class BorrarRangoCommand implements ICommand {
  private readonly receiver: Documento;
  private readonly desde: number;
  private readonly hasta: number;
  private backup: string = '';

  constructor(receiver: Documento, desde: number, hasta: number) {
    this.receiver = receiver;
    this.desde = desde;
    this.hasta = hasta;
  }

  execute(): void {
    // Guardamos el texto que vamos a borrar para poder deshacerlo
    this.backup = this.receiver.borrar(this.desde, this.hasta);
  }

  undo(): void {
    // Restauramos el texto que borramos
    this.receiver.insertar(this.desde, this.backup);
  }

  getDescription(): string {
    return `Borrar rango [${this.desde}, ${this.hasta}]`;
  }
}
