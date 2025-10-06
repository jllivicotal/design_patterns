import { Injectable } from '@nestjs/common';
import { SolicitudCertificado } from './originator';
import { HistorialSolicitudes } from './caretaker';
import { DatosAlumno, Adjunto } from './value-objects';
import { CreateSolicitudDto, UpdateSolicitudDto, CreateAdjuntoDto } from './dto';

/**
 * Servicio que maneja las solicitudes de certificado
 * Encapsula el uso del patrón Memento
 */
@Injectable()
export class MementoService {
  private solicitudActual: SolicitudCertificado | null = null;
  private historial: HistorialSolicitudes | null = null;

  /**
   * Crea una nueva solicitud de certificado
   * Si ya existe una, la reemplaza (esto permite crear múltiples solicitudes)
   */
  crearSolicitud(createSolicitudDto: CreateSolicitudDto): any {
    const datosAlumno = new DatosAlumno(
      createSolicitudDto.datosAlumno.nombre,
      createSolicitudDto.datosAlumno.apellido,
      createSolicitudDto.datosAlumno.matricula,
      createSolicitudDto.datosAlumno.carrera,
      createSolicitudDto.datosAlumno.email,
    );

    const adjuntos = (createSolicitudDto.adjuntos || []).map(
      (adj) => new Adjunto(adj.nombre, adj.tipo, adj.url, adj.tamanio),
    );

    // Crear nueva solicitud (reemplaza la anterior si existe)
    this.solicitudActual = new SolicitudCertificado(
      datosAlumno,
      createSolicitudDto.tipoCertificado,
      createSolicitudDto.observaciones || '',
      adjuntos,
    );

    // Crear nuevo historial
    this.historial = new HistorialSolicitudes(this.solicitudActual);

    // Crear snapshot inicial
    this.historial.snapshot('Estado inicial');

    return this.obtenerEstadoActual();
  }

  /**
   * Actualiza la solicitud actual
   */
  actualizarSolicitud(updateSolicitudDto: UpdateSolicitudDto, etiqueta?: string): any {
    this.verificarSolicitudActiva();

    if (updateSolicitudDto.tipoCertificado) {
      this.solicitudActual!.actualizarTipoCertificado(updateSolicitudDto.tipoCertificado);
    }

    if (updateSolicitudDto.observaciones !== undefined) {
      this.solicitudActual!.actualizarObservaciones(updateSolicitudDto.observaciones);
    }

    // Crear snapshot después de la actualización
    this.historial!.snapshot(etiqueta || 'Actualización de solicitud');

    return this.obtenerEstadoActual();
  }

  /**
   * Agrega un adjunto a la solicitud
   */
  agregarAdjunto(adjuntoDto: CreateAdjuntoDto, etiqueta?: string): any {
    this.verificarSolicitudActiva();

    const adjunto = new Adjunto(
      adjuntoDto.nombre,
      adjuntoDto.tipo,
      adjuntoDto.url,
      adjuntoDto.tamanio,
    );

    this.solicitudActual!.agregarAdjunto(adjunto);

    // Crear snapshot
    this.historial!.snapshot(etiqueta || `Adjunto agregado: ${adjuntoDto.nombre}`);

    return this.obtenerEstadoActual();
  }

  /**
   * Genera el certificado
   */
  generarCertificado(etiqueta?: string): any {
    this.verificarSolicitudActiva();

    this.solicitudActual!.generar();

    // Crear snapshot
    this.historial!.snapshot(etiqueta || 'Certificado generado');

    return this.obtenerEstadoActual();
  }

  /**
   * Firma el certificado
   */
  firmarCertificado(etiqueta?: string): any {
    this.verificarSolicitudActiva();

    this.solicitudActual!.firmar();

    // Crear snapshot
    this.historial!.snapshot(etiqueta || 'Certificado firmado');

    return this.obtenerEstadoActual();
  }

  /**
   * Visualiza el documento actual
   */
  visualizarDocumento(): any {
    this.verificarSolicitudActiva();

    const documento = this.solicitudActual!.visualizar();

    return {
      contenido: documento.contenido,
      formato: documento.formato,
      fechaGeneracion: documento.fechaGeneracion,
      firmado: documento.firmado,
    };
  }

  /**
   * Crea un snapshot manual
   */
  crearSnapshot(etiqueta: string): any {
    this.verificarSolicitudActiva();

    this.historial!.snapshot(etiqueta);

    return {
      mensaje: 'Snapshot creado correctamente',
      etiqueta,
      info: this.historial!.getInfo(),
    };
  }

  /**
   * Deshace la última operación
   */
  undo(): any {
    this.verificarSolicitudActiva();
    this.historial!.undo();
    return this.obtenerEstadoActual();
  }

  /**
   * Rehace la última operación deshecha
   */
  redo(): any {
    this.verificarSolicitudActiva();
    this.historial!.redo();
    return this.obtenerEstadoActual();
  }

  /**
   * Lista el historial completo (undo + redo)
   */
  listarHistorial(): any {
    // Si no hay solicitud activa, devolver historial vacío
    if (!this.solicitudActual || !this.historial) {
      return {
        snapshots: [],
        capacidadMaxima: 50,
        posicionActual: 0,
      };
    }

    const info = this.historial.getInfo();
    
    // Combinar mementos de undo y redo en orden
    const todosLosMementos = [
      ...info.mementos,  // Snapshots en undo (pasado y presente)
      ...info.mementosRedo.reverse(),  // Snapshots en redo (futuro), invertidos para orden cronológico
    ];
    
    // Transformar al formato esperado por el frontend
    return {
      snapshots: todosLosMementos.map((memento) => {
        const estado = (memento as any).getEstado();
        return {
          id: memento.getVersion(),
          etiqueta: memento.getEtiqueta(),
          timestamp: memento.getFecha().toISOString(),
          estado: this.serializarEstado(estado),
        };
      }),
      capacidadMaxima: info.capacidadMaxima,
      posicionActual: info.undoDisponibles - 1, // Posición actual (0-indexed)
    };
  }

  /**
   * Limpia el historial
   */
  limpiarHistorial(): any {
    this.verificarSolicitudActiva();

    this.historial!.limpiar();

    return {
      mensaje: 'Historial limpiado correctamente',
    };
  }

  /**
   * Establece la capacidad máxima del historial
   */
  setCapacidadMaxima(capacidad: number): any {
    this.verificarSolicitudActiva();

    this.historial!.setMaxCapacidad(capacidad);

    return {
      mensaje: `Capacidad máxima establecida en ${capacidad}`,
      info: this.historial!.getInfo(),
    };
  }

  /**
   * Obtiene el estado actual de la solicitud
   */
  obtenerEstadoActual(): any {
    // Si no hay solicitud activa, devolver estado vacío
    if (!this.solicitudActual || !this.historial) {
      return {
        solicitud: null,
        puedeDeshacer: false,
        puedeRehacer: false,
        historial: {
          actual: 0,
          total: 0,
          capacidadMaxima: 50,
        },
      };
    }

    const estado = this.solicitudActual.getEstadoActual();
    const info = this.historial.getInfo();

    return {
      solicitud: {
        datosAlumno: {
          nombre: estado.datosAlumno.nombre,
          apellido: estado.datosAlumno.apellido,
          matricula: estado.datosAlumno.matricula,
          carrera: estado.datosAlumno.carrera,
          email: estado.datosAlumno.email,
        },
        tipoCertificado: estado.tipoCertificado,
        observaciones: estado.observaciones,
        adjuntos: estado.adjuntos.map((adj) => ({
          nombre: adj.nombre,
          tipo: adj.tipo,
          url: adj.url,
          tamanio: adj.tamanio,
        })),
        estado: estado.firmado ? 'firmado' : estado.generado ? 'generado' : 'borrador',
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
      },
      puedeDeshacer: info.undoDisponibles > 1, // Necesita más de 1 para poder volver atrás
      puedeRehacer: info.redoDisponibles > 0,
      historial: {
        actual: info.undoDisponibles, // La posición actual es la cima de undo
        total: info.undoDisponibles + info.redoDisponibles, // Total de snapshots
        capacidadMaxima: info.capacidadMaxima,
      },
    };
  }

  /**
   * Verifica que exista una solicitud activa
   */
  private verificarSolicitudActiva(): void {
    if (!this.solicitudActual || !this.historial) {
      throw new Error('No hay una solicitud activa. Debe crear una solicitud primero.');
    }
  }

  /**
   * Serializa el estado de una solicitud a objeto plano
   */
  private serializarEstado(estado: any): any {
    return {
      datosAlumno: {
        nombre: estado.datosAlumno.nombre,
        apellido: estado.datosAlumno.apellido,
        matricula: estado.datosAlumno.matricula,
        carrera: estado.datosAlumno.carrera,
        email: estado.datosAlumno.email,
      },
      tipoCertificado: estado.tipoCertificado,
      observaciones: estado.observaciones,
      adjuntos: estado.adjuntos.map((adj: any) => ({
        nombre: adj.nombre,
        tipo: adj.tipo,
        url: adj.url,
        tamanio: adj.tamanio,
      })),
      estado: estado.firmado ? 'firmado' : estado.generado ? 'generado' : 'borrador',
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString(),
    };
  }
}
