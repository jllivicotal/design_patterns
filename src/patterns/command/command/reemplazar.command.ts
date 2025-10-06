import { ICommand } from './icommand.interface';
import { Documento } from '../receiver';

/**
 * Concrete Command: Reemplazar Texto
 * Reemplaza un fragmento de texto en el documento
 */
export class ReemplazarCommand implements ICommand {
  private readonly receiver: Documento;
  private readonly desde: number;
  private readonly len: number;
  private readonly nuevo: string;
  private backup: string = '';

  constructor(receiver: Documento, desde: number, len: number, nuevo: string) {
    this.receiver = receiver;
    this.desde = desde;
    this.len = len;
    this.nuevo = nuevo;
  }

  execute(): void {
    // Guardamos el texto que vamos a reemplazar
    this.backup = this.receiver.reemplazar(this.desde, this.len, this.nuevo);
  }

  undo(): void {
    // Restauramos el texto original
    this.receiver.reemplazar(this.desde, this.nuevo.length, this.backup);
  }

  getDescription(): string {
    return `Reemplazar ${this.len} caracteres desde ${this.desde} con "${this.nuevo}"`;
  }
}
