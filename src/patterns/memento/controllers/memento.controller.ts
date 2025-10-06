import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MementoService } from '../memento.service';
import {
  CreateSolicitudDto,
  UpdateSolicitudDto,
  CreateAdjuntoDto,
  SnapshotDto,
} from '../dto';

/**
 * Controlador para el patrón Memento
 * Gestiona las solicitudes de certificado con funcionalidad de Undo/Redo
 */
@Controller('memento')
export class MementoController {
  constructor(private readonly mementoService: MementoService) {}

  /**
   * POST /memento/solicitud
   * Crea una nueva solicitud de certificado
   */
  @Post('solicitud')
  crearSolicitud(@Body() createSolicitudDto: CreateSolicitudDto) {
    return this.mementoService.crearSolicitud(createSolicitudDto);
  }

  /**
   * PUT /memento/solicitud
   * Actualiza la solicitud actual
   */
  @Put('solicitud')
  actualizarSolicitud(@Body() updateSolicitudDto: UpdateSolicitudDto) {
    return this.mementoService.actualizarSolicitud(updateSolicitudDto);
  }

  /**
   * POST /memento/adjunto
   * Agrega un adjunto a la solicitud
   */
  @Post('adjunto')
  agregarAdjunto(@Body() adjuntoDto: CreateAdjuntoDto) {
    return this.mementoService.agregarAdjunto(adjuntoDto);
  }

  /**
   * POST /memento/generar
   * Genera el certificado
   */
  @Post('generar')
  generarCertificado() {
    return this.mementoService.generarCertificado();
  }

  /**
   * POST /memento/firmar
   * Firma el certificado
   */
  @Post('firmar')
  firmarCertificado() {
    return this.mementoService.firmarCertificado();
  }

  /**
   * GET /memento/visualizar
   * Visualiza el documento actual
   */
  @Get('visualizar')
  visualizarDocumento() {
    return this.mementoService.visualizarDocumento();
  }

  /**
   * GET /memento/estado
   * Obtiene el estado actual de la solicitud
   */
  @Get('estado')
  obtenerEstado() {
    return this.mementoService.obtenerEstadoActual();
  }

  /**
   * POST /memento/snapshot
   * Crea un snapshot manual del estado actual
   */
  @Post('snapshot')
  crearSnapshot(@Body() snapshotDto: SnapshotDto) {
    return this.mementoService.crearSnapshot(snapshotDto.etiqueta);
  }

  /**
   * POST /memento/undo
   * Deshace la última operación
   */
  @Post('undo')
  undo() {
    return this.mementoService.undo();
  }

  /**
   * POST /memento/redo
   * Rehace la última operación deshecha
   */
  @Post('redo')
  redo() {
    return this.mementoService.redo();
  }

  /**
   * GET /memento/historial
   * Lista el historial de snapshots
   */
  @Get('historial')
  listarHistorial() {
    return this.mementoService.listarHistorial();
  }

  /**
   * POST /memento/historial/limpiar
   * Limpia el historial
   */
  @Post('historial/limpiar')
  limpiarHistorial() {
    return this.mementoService.limpiarHistorial();
  }

  /**
   * PUT /memento/historial/capacidad/:capacidad
   * Establece la capacidad máxima del historial
   */
  @Put('historial/capacidad/:capacidad')
  setCapacidadMaxima(@Param('capacidad', ParseIntPipe) capacidad: number) {
    return this.mementoService.setCapacidadMaxima(capacidad);
  }

  /**
   * GET /memento/info
   * Obtiene información general del patrón
   */
  @Get('info')
  getPatternInfo() {
    return {
      pattern: 'Memento',
      description: 'Sistema de solicitudes de certificado con funcionalidad de Undo/Redo',
      components: {
        originator: 'SolicitudCertificado - El objeto cuyo estado se guarda',
        memento: 'SolicitudMemento - Captura del estado en un momento específico',
        caretaker: 'HistorialSolicitudes - Administrador del historial de estados',
      },
      features: [
        'Crear y editar solicitudes de certificado',
        'Generar y firmar documentos',
        'Deshacer/rehacer cambios ilimitados',
        'Historial con etiquetas descriptivas',
        'Capacidad configurable del historial',
      ],
    };
  }
}
