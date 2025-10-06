import { Memento, OriginatorMemento, SolicitudMemento } from '../memento';
import { EstadoSolicitud, DatosAlumno, Adjunto, Documento } from '../value-objects';

/**
 * Originator: Solicitud de Certificado
 * Es el objeto cuyo estado interno queremos guardar y restaurar
 */
export class SolicitudCertificado {
  private estadoActual: EstadoSolicitud;
  private version: number = 0;

  constructor(
    datosAlumno: DatosAlumno,
    tipoCertificado: string,
    observaciones: string = '',
    adjuntos: Adjunto[] = [],
  ) {
    this.estadoActual = new EstadoSolicitud(
      datosAlumno,
      tipoCertificado,
      observaciones,
      adjuntos,
    );
  }

  /**
   * Crea un memento capturando el estado actual
   */
  crearMemento(etiqueta: string): Memento {
    this.version++;
    return new SolicitudMemento(this.estadoActual, etiqueta, this.version);
  }

  /**
   * Restaura el estado desde un memento
   * Solo acepta OriginatorMemento (interfaz ancha)
   */
  restaurar(memento: OriginatorMemento): void {
    this.estadoActual = memento.getEstado();
    this.version = memento.getVersion();
  }

  /**
   * Genera el documento de certificado
   */
  generar(): void {
    if (this.estadoActual.generado) {
      throw new Error('El certificado ya ha sido generado');
    }
    this.estadoActual = this.estadoActual.marcarComoGenerado();
  }

  /**
   * Firma el documento generado
   */
  firmar(): void {
    if (!this.estadoActual.generado) {
      throw new Error('Debe generar el certificado antes de firmarlo');
    }
    if (this.estadoActual.firmado) {
      throw new Error('El certificado ya ha sido firmado');
    }
    this.estadoActual = this.estadoActual.marcarComoFirmado();
  }

  /**
   * Visualiza el documento actual
   */
  visualizar(): Documento {
    const contenido = this.generarContenido();
    return new Documento(
      contenido,
      'PDF',
      new Date(),
      this.estadoActual.firmado,
    );
  }

  /**
   * Actualiza los datos del alumno
   */
  actualizarDatosAlumno(datosAlumno: DatosAlumno): void {
    this.estadoActual = new EstadoSolicitud(
      datosAlumno,
      this.estadoActual.tipoCertificado,
      this.estadoActual.observaciones,
      this.estadoActual.adjuntos,
      this.estadoActual.generado,
      this.estadoActual.firmado,
    );
  }

  /**
   * Actualiza el tipo de certificado
   */
  actualizarTipoCertificado(tipoCertificado: string): void {
    this.estadoActual = new EstadoSolicitud(
      this.estadoActual.datosAlumno,
      tipoCertificado,
      this.estadoActual.observaciones,
      this.estadoActual.adjuntos,
      this.estadoActual.generado,
      this.estadoActual.firmado,
    );
  }

  /**
   * Actualiza las observaciones
   */
  actualizarObservaciones(observaciones: string): void {
    this.estadoActual = new EstadoSolicitud(
      this.estadoActual.datosAlumno,
      this.estadoActual.tipoCertificado,
      observaciones,
      this.estadoActual.adjuntos,
      this.estadoActual.generado,
      this.estadoActual.firmado,
    );
  }

  /**
   * Agrega un adjunto
   */
  agregarAdjunto(adjunto: Adjunto): void {
    const nuevosAdjuntos = [...this.estadoActual.adjuntos, adjunto];
    this.estadoActual = new EstadoSolicitud(
      this.estadoActual.datosAlumno,
      this.estadoActual.tipoCertificado,
      this.estadoActual.observaciones,
      nuevosAdjuntos,
      this.estadoActual.generado,
      this.estadoActual.firmado,
    );
  }

  /**
   * Obtiene el estado actual (solo para visualización)
   */
  getEstadoActual(): EstadoSolicitud {
    return this.estadoActual;
  }

  /**
   * Obtiene la versión actual
   */
  getVersion(): number {
    return this.version;
  }

  /**
   * Genera el contenido del documento
   */
  private generarContenido(): string {
    const { datosAlumno, tipoCertificado, observaciones } = this.estadoActual;
    return `
CERTIFICADO: ${tipoCertificado}

Alumno: ${datosAlumno.nombre} ${datosAlumno.apellido}
Matrícula: ${datosAlumno.matricula}
Carrera: ${datosAlumno.carrera}
Email: ${datosAlumno.email}

Observaciones: ${observaciones || 'N/A'}

Estado: ${this.estadoActual.generado ? 'GENERADO' : 'BORRADOR'}
${this.estadoActual.firmado ? 'FIRMADO DIGITALMENTE' : ''}
    `.trim();
  }
}
