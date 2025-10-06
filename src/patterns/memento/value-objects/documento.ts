/**
 * Tipo de apoyo: Documento generado
 */
export class Documento {
  constructor(
    public readonly contenido: string,
    public readonly formato: string,
    public readonly fechaGeneracion: Date,
    public readonly firmado: boolean,
  ) {}

  toString(): string {
    return `Documento ${this.formato} - ${this.firmado ? 'FIRMADO' : 'SIN FIRMAR'} - ${this.fechaGeneracion.toISOString()}`;
  }
}
