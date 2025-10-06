import { ICommand } from './icommand.interface';
import { Documento } from '../receiver';

/**
 * Concrete Command: Insertar Texto
 * Inserta texto en una posición específica del documento
 */
export class InsertarTextoCommand implements ICommand {
  private readonly receiver: Documento;
  private readonly pos: number;
  private readonly texto: string;

  constructor(receiver: Documento, pos: number, texto: string) {
    this.receiver = receiver;
    this.pos = pos;
    this.texto = texto;
  }

  execute(): void {
    this.receiver.insertar(this.pos, this.texto);
  }

  undo(): void {
    // Para deshacer, borramos el texto que insertamos
    const hasta = this.pos + this.texto.length;
    this.receiver.borrar(this.pos, hasta);
  }

  getDescription(): string {
    return `Insertar "${this.texto}" en posición ${this.pos}`;
  }
}
