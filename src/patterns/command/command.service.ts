import { Injectable } from '@nestjs/common';
import { Documento } from './receiver';
import { HistorialComandos } from './invoker';
import {
  InsertarTextoCommand,
  BorrarRangoCommand,
  ReemplazarCommand,
} from './command';
import {
  InsertarTextoDto,
  BorrarRangoDto,
  ReemplazarDto,
  MacroDto,
} from './dto';

/**
 * Servicio del patrón Command
 * Actúa como punto de entrada para el editor de texto
 */
@Injectable()
export class CommandService {
  private documento: Documento;
  private historial: HistorialComandos;

  constructor() {
    this.documento = new Documento('');
    this.historial = new HistorialComandos();
  }

  /**
   * Inserta texto en el documento
   */
  insertarTexto(dto: InsertarTextoDto) {
    const comando = new InsertarTextoCommand(this.documento, dto.pos, dto.texto);
    this.historial.ejecutar(comando);
    
    return {
      mensaje: 'Texto insertado exitosamente',
      texto: this.documento.getTexto(),
      longitud: this.documento.getLongitud(),
    };
  }

  /**
   * Borra un rango de texto del documento
   */
  borrarRango(dto: BorrarRangoDto) {
    const comando = new BorrarRangoCommand(this.documento, dto.desde, dto.hasta);
    this.historial.ejecutar(comando);
    
    return {
      mensaje: 'Rango borrado exitosamente',
      texto: this.documento.getTexto(),
      longitud: this.documento.getLongitud(),
    };
  }

  /**
   * Reemplaza texto en el documento
   */
  reemplazar(dto: ReemplazarDto) {
    const comando = new ReemplazarCommand(this.documento, dto.desde, dto.len, dto.nuevo);
    this.historial.ejecutar(comando);
    
    return {
      mensaje: 'Texto reemplazado exitosamente',
      texto: this.documento.getTexto(),
      longitud: this.documento.getLongitud(),
    };
  }

  /**
   * Deshace la última operación
   */
  undo() {
    this.historial.undo();
    
    return {
      mensaje: 'Operación deshecha',
      texto: this.documento.getTexto(),
      longitud: this.documento.getLongitud(),
    };
  }

  /**
   * Rehace la última operación deshecha
   */
  redo() {
    this.historial.redo();
    
    return {
      mensaje: 'Operación rehecha',
      texto: this.documento.getTexto(),
      longitud: this.documento.getLongitud(),
    };
  }

  /**
   * Obtiene el texto actual del documento
   */
  getTexto() {
    return {
      texto: this.documento.getTexto(),
      longitud: this.documento.getLongitud(),
    };
  }

  /**
   * Inicia la grabación de un macro
   */
  grabarMacro(dto: MacroDto) {
    this.historial.grabarMacro(dto.nombre);
    
    return {
      mensaje: `Iniciada grabación del macro "${dto.nombre}"`,
      info: this.historial.getInfo(),
    };
  }

  /**
   * Finaliza la grabación del macro actual
   */
  finalizarMacro() {
    this.historial.finalizarMacro();
    
    return {
      mensaje: 'Macro finalizado y guardado',
      info: this.historial.getInfo(),
    };
  }

  /**
   * Cancela la grabación del macro actual
   */
  cancelarMacro() {
    this.historial.cancelarMacro();
    
    return {
      mensaje: 'Grabación de macro cancelada',
      info: this.historial.getInfo(),
    };
  }

  /**
   * Ejecuta un macro guardado
   */
  ejecutarMacro(dto: MacroDto) {
    this.historial.ejecutarMacro(dto.nombre);
    
    return {
      mensaje: `Macro "${dto.nombre}" ejecutado`,
      texto: this.documento.getTexto(),
      longitud: this.documento.getLongitud(),
    };
  }

  /**
   * Elimina un macro guardado
   */
  eliminarMacro(dto: MacroDto) {
    this.historial.eliminarMacro(dto.nombre);
    
    return {
      mensaje: `Macro "${dto.nombre}" eliminado`,
      macros: this.historial.listarMacros(),
    };
  }

  /**
   * Lista todos los macros disponibles
   */
  listarMacros() {
    return {
      macros: this.historial.listarMacros(),
    };
  }

  /**
   * Obtiene información del historial
   */
  getInfo() {
    return this.historial.getInfo();
  }

  /**
   * Obtiene el log de operaciones
   */
  getLog() {
    return {
      log: this.historial.getLog(),
    };
  }

  /**
   * Limpia el historial de comandos
   */
  limpiarHistorial() {
    this.historial.limpiarHistorial();
    
    return {
      mensaje: 'Historial limpiado',
      info: this.historial.getInfo(),
    };
  }

  /**
   * Limpia el log de operaciones
   */
  limpiarLog() {
    this.historial.limpiarLog();
    
    return {
      mensaje: 'Log limpiado',
    };
  }

  /**
   * Limpia el documento completo
   */
  limpiarDocumento() {
    const textoAnterior = this.documento.limpiar();
    
    return {
      mensaje: 'Documento limpiado',
      caracteresEliminados: textoAnterior.length,
      texto: this.documento.getTexto(),
    };
  }

  /**
   * Reinicia completamente el editor
   */
  reiniciar() {
    this.documento = new Documento('');
    this.historial = new HistorialComandos();
    
    return {
      mensaje: 'Editor reiniciado completamente',
    };
  }
}
