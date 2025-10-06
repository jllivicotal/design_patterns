/**
 * Tipo de apoyo: Adjunto (archivo adjunto a la solicitud)
 */
export class Adjunto {
  constructor(
    public readonly nombre: string,
    public readonly tipo: string,
    public readonly url: string,
    public readonly tamanio: number,
  ) {}

  toString(): string {
    return `${this.nombre} (${this.tipo}, ${this.formatSize()})`;
  }

  private formatSize(): string {
    if (this.tamanio < 1024) {
      return `${this.tamanio} bytes`;
    } else if (this.tamanio < 1024 * 1024) {
      return `${(this.tamanio / 1024).toFixed(2)} KB`;
    } else {
      return `${(this.tamanio / (1024 * 1024)).toFixed(2)} MB`;
    }
  }
}
