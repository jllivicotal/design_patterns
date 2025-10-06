import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CommandService } from '../command.service';
import {
  InsertarTextoDto,
  BorrarRangoDto,
  ReemplazarDto,
  MacroDto,
} from '../dto';

/**
 * Controlador para el patrón Command
 * Simula una UI de editor de texto con comandos
 */
@Controller('command')
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  /**
   * POST /command/insertar
   * Inserta texto en el documento
   */
  @Post('insertar')
  insertarTexto(@Body() dto: InsertarTextoDto) {
    return this.commandService.insertarTexto(dto);
  }

  /**
   * POST /command/borrar
   * Borra un rango de texto
   */
  @Post('borrar')
  borrarRango(@Body() dto: BorrarRangoDto) {
    return this.commandService.borrarRango(dto);
  }

  /**
   * POST /command/reemplazar
   * Reemplaza texto en el documento
   */
  @Post('reemplazar')
  reemplazar(@Body() dto: ReemplazarDto) {
    return this.commandService.reemplazar(dto);
  }

  /**
   * POST /command/undo
   * Deshace la última operación
   */
  @Post('undo')
  undo() {
    return this.commandService.undo();
  }

  /**
   * POST /command/redo
   * Rehace la última operación deshecha
   */
  @Post('redo')
  redo() {
    return this.commandService.redo();
  }

  /**
   * GET /command/texto
   * Obtiene el texto actual del documento
   */
  @Get('texto')
  getTexto() {
    return this.commandService.getTexto();
  }

  /**
   * GET /command/info
   * Obtiene información del historial
   */
  @Get('info')
  getInfo() {
    return this.commandService.getInfo();
  }

  /**
   * GET /command/log
   * Obtiene el log de operaciones
   */
  @Get('log')
  getLog() {
    return this.commandService.getLog();
  }

  /**
   * POST /command/historial/limpiar
   * Limpia el historial de comandos
   */
  @Post('historial/limpiar')
  limpiarHistorial() {
    return this.commandService.limpiarHistorial();
  }

  /**
   * POST /command/log/limpiar
   * Limpia el log de operaciones
   */
  @Post('log/limpiar')
  limpiarLog() {
    return this.commandService.limpiarLog();
  }

  /**
   * POST /command/documento/limpiar
   * Limpia el documento completo
   */
  @Post('documento/limpiar')
  limpiarDocumento() {
    return this.commandService.limpiarDocumento();
  }

  /**
   * POST /command/reiniciar
   * Reinicia completamente el editor
   */
  @Post('reiniciar')
  reiniciar() {
    return this.commandService.reiniciar();
  }

  /**
   * POST /command/macro/grabar
   * Inicia la grabación de un macro
   */
  @Post('macro/grabar')
  grabarMacro(@Body() dto: MacroDto) {
    return this.commandService.grabarMacro(dto);
  }

  /**
   * POST /command/macro/finalizar
   * Finaliza la grabación del macro actual
   */
  @Post('macro/finalizar')
  finalizarMacro() {
    return this.commandService.finalizarMacro();
  }

  /**
   * POST /command/macro/cancelar
   * Cancela la grabación del macro actual
   */
  @Post('macro/cancelar')
  cancelarMacro() {
    return this.commandService.cancelarMacro();
  }

  /**
   * POST /command/macro/ejecutar
   * Ejecuta un macro guardado
   */
  @Post('macro/ejecutar')
  ejecutarMacro(@Body() dto: MacroDto) {
    return this.commandService.ejecutarMacro(dto);
  }

  /**
   * GET /command/macro
   * Lista todos los macros disponibles
   */
  @Get('macro')
  listarMacros() {
    return this.commandService.listarMacros();
  }

  /**
   * DELETE /command/macro/:nombre
   * Elimina un macro guardado
   */
  @Delete('macro/:nombre')
  eliminarMacro(@Param('nombre') nombre: string) {
    return this.commandService.eliminarMacro({ nombre });
  }

  /**
   * GET /command/pattern-info
   * Información sobre el patrón Command
   */
  @Get('pattern-info')
  getPatternInfo() {
    return {
      pattern: 'Command',
      description: 'Editor de texto con comandos desacoplados y funcionalidad de Undo/Redo',
      components: {
        command: 'ICommand - Interfaz que encapsula una operación',
        concreteCommands: [
          'InsertarTextoCommand - Inserta texto',
          'BorrarRangoCommand - Borra un rango',
          'ReemplazarCommand - Reemplaza texto',
          'MacroCommand - Agrupa comandos (Composite)',
        ],
        receiver: 'Documento - Objeto que realiza las operaciones reales',
        invoker: 'HistorialComandos - Ejecuta comandos y gestiona historial',
        client: 'CommandController - Crea y ejecuta comandos',
      },
      features: [
        'Undo/Redo ilimitado',
        'Macros (grabación y ejecución)',
        'Logging de operaciones',
        'Comandos desacoplados del receptor',
        'Composite pattern para macros',
      ],
    };
  }
}
