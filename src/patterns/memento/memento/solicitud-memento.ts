import { OriginatorMemento } from './originator-memento.interface';
import { EstadoSolicitud } from '../value-objects';

/**
 * Concrete Memento: Implementación del memento para solicitudes de certificado
 * Implementa tanto la interfaz angosta (Memento) como la ancha (OriginatorMemento)
 */
export class SolicitudMemento implements OriginatorMemento {
  private readonly estado: EstadoSolicitud;
  private readonly fecha: Date;
  private readonly etiqueta: string;
  private readonly version: number;

  constructor(estado: EstadoSolicitud, etiqueta: string, version: number) {
    this.estado = estado.clone(); // Copia profunda del estado
    this.fecha = new Date();
    this.etiqueta = etiqueta;
    this.version = version;
  }

  /**
   * Métodos de la interfaz angosta (accesibles por el Caretaker)
   */
  getFecha(): Date {
    return this.fecha;
  }

  getEtiqueta(): string {
    return this.etiqueta;
  }

  getVersion(): number {
    return this.version;
  }

  /**
   * Método de la interfaz ancha (solo accesible por el Originator)
   * Protegido para enfatizar que solo el Originator debería usarlo
   */
  getEstado(): EstadoSolicitud {
    return this.estado.clone(); // Retorna una copia para evitar mutaciones
  }

  toString(): string {
    return `Memento v${this.version}: "${this.etiqueta}" - ${this.fecha.toISOString()}`;
  }
}
