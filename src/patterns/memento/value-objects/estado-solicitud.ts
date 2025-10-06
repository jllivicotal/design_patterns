import { DatosAlumno } from './datos-alumno';
import { Adjunto } from './adjunto';

/**
 * Value Object: Estado completo de una solicitud de certificado
 * Encapsula todos los datos necesarios para representar el estado interno
 */
export class EstadoSolicitud {
  constructor(
    public readonly datosAlumno: DatosAlumno,
    public readonly tipoCertificado: string,
    public readonly observaciones: string,
    public readonly adjuntos: Adjunto[],
    public readonly generado: boolean = false,
    public readonly firmado: boolean = false,
  ) {}

  /**
   * Crea una copia profunda del estado
   */
  clone(): EstadoSolicitud {
    return new EstadoSolicitud(
      this.datosAlumno,
      this.tipoCertificado,
      this.observaciones,
      [...this.adjuntos],
      this.generado,
      this.firmado,
    );
  }

  /**
   * Crea un nuevo estado con el flag de generado activado
   */
  marcarComoGenerado(): EstadoSolicitud {
    return new EstadoSolicitud(
      this.datosAlumno,
      this.tipoCertificado,
      this.observaciones,
      this.adjuntos,
      true,
      this.firmado,
    );
  }

  /**
   * Crea un nuevo estado con el flag de firmado activado
   */
  marcarComoFirmado(): EstadoSolicitud {
    return new EstadoSolicitud(
      this.datosAlumno,
      this.tipoCertificado,
      this.observaciones,
      this.adjuntos,
      this.generado,
      true,
    );
  }

  toString(): string {
    return `Solicitud de ${this.tipoCertificado} para ${this.datosAlumno.toString()} - ` +
      `${this.generado ? 'Generado' : 'No generado'} - ${this.firmado ? 'Firmado' : 'Sin firmar'}`;
  }
}
