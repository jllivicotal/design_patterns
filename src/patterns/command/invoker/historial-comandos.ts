import { ICommand, MacroCommand } from '../command';

/**
 * Interfaz para entradas del log
 */
export interface LogEntry {
  operacion: string;
  timestamp: string;
  detalles: string;
}

/**
 * Invoker: Historial de Comandos
 * Centraliza la ejecución, undo/redo, logging y gestión de macros
 */
export class HistorialComandos {
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];
  private macros: Map<string, MacroCommand> = new Map();
  private macroActual: MacroCommand | null = null;
  private log: LogEntry[] = [];

  /**
   * Ejecuta un comando y lo agrega al historial
   */
  ejecutar(cmd: ICommand): void {
    cmd.execute();
    
    // Agregar al historial de undo
    this.undoStack.push(cmd);
    
    // Limpiar el historial de redo (nueva acción invalida el redo)
    this.redoStack = [];
    
    // Logging
    const descripcion = cmd.getDescription?.() || 'Comando sin descripción';
    this.log.push({
      operacion: 'EJECUTAR',
      timestamp: new Date().toISOString(),
      detalles: descripcion,
    });
    
    // Si estamos grabando un macro, agregar el comando
    if (this.macroActual) {
      this.macroActual.add(cmd);
    }
  }

  /**
   * Deshace el último comando ejecutado
   */
  undo(): void {
    if (this.undoStack.length === 0) {
      throw new Error('No hay comandos para deshacer');
    }

    const cmd = this.undoStack.pop()!;
    cmd.undo();
    
    // Mover a la pila de redo
    this.redoStack.push(cmd);
    
    // Logging
    const descripcion = cmd.getDescription?.() || 'Comando sin descripción';
    this.log.push({
      operacion: 'UNDO',
      timestamp: new Date().toISOString(),
      detalles: descripcion,
    });
  }

  /**
   * Rehace el último comando deshecho
   */
  redo(): void {
    if (this.redoStack.length === 0) {
      throw new Error('No hay comandos para rehacer');
    }

    const cmd = this.redoStack.pop()!;
    cmd.execute();
    
    // Mover de vuelta a la pila de undo
    this.undoStack.push(cmd);
    
    // Logging
    const descripcion = cmd.getDescription?.() || 'Comando sin descripción';
    this.log.push({
      operacion: 'REDO',
      timestamp: new Date().toISOString(),
      detalles: descripcion,
    });
  }

  /**
   * Inicia la grabación de un macro
   */
  grabarMacro(nombre: string): void {
    if (this.macroActual) {
      throw new Error('Ya hay un macro en grabación. Finalice el anterior primero.');
    }
    
    this.macroActual = new MacroCommand(nombre);
    this.log.push({
      operacion: 'MACRO',
      timestamp: new Date().toISOString(),
      detalles: `Iniciando grabación: "${nombre}"`,
    });
  }

  /**
   * Agrega un paso al macro actual (alternativa a ejecutar durante grabación)
   */
  agregarPaso(nombre: string, cmd: ICommand): void {
    if (!this.macroActual) {
      throw new Error('No hay un macro en grabación');
    }
    
    this.macroActual.add(cmd);
    this.log.push({
      operacion: 'MACRO',
      timestamp: new Date().toISOString(),
      detalles: `Paso agregado: ${nombre}`,
    });
  }

  /**
   * Finaliza la grabación del macro y lo guarda
   */
  finalizarMacro(): void {
    if (!this.macroActual) {
      throw new Error('No hay un macro en grabación');
    }

    const nombre = this.macroActual.getNombre();
    this.macros.set(nombre, this.macroActual);
    this.log.push({
      operacion: 'MACRO',
      timestamp: new Date().toISOString(),
      detalles: `Macro guardado: "${nombre}" con ${this.macroActual.getComandos().length} pasos`,
    });
    this.macroActual = null;
  }

  /**
   * Cancela la grabación del macro actual
   */
  cancelarMacro(): void {
    if (!this.macroActual) {
      throw new Error('No hay un macro en grabación');
    }

    const nombre = this.macroActual.getNombre();
    this.log.push({
      operacion: 'MACRO',
      timestamp: new Date().toISOString(),
      detalles: `Grabación cancelada: "${nombre}"`,
    });
    this.macroActual = null;
  }

  /**
   * Ejecuta un macro previamente guardado
   */
  ejecutarMacro(nombre: string): void {
    const macro = this.macros.get(nombre);
    if (!macro) {
      throw new Error(`Macro no encontrado: "${nombre}"`);
    }

    this.ejecutar(macro);
  }

  /**
   * Elimina un macro guardado
   */
  eliminarMacro(nombre: string): void {
    if (!this.macros.has(nombre)) {
      throw new Error(`Macro no encontrado: "${nombre}"`);
    }

    this.macros.delete(nombre);
    this.log.push({
      operacion: 'MACRO',
      timestamp: new Date().toISOString(),
      detalles: `Macro eliminado: "${nombre}"`,
    });
  }

  /**
   * Lista todos los macros disponibles
   */
  listarMacros(): Array<{ nombre: string; comandos: number; fechaCreacion: string }> {
    return Array.from(this.macros.entries()).map(([nombre, macro]) => ({
      nombre,
      comandos: macro.getComandos().length,
      fechaCreacion: macro.getFechaCreacion(),
    }));
  }

  /**
   * Obtiene información del historial
   */
  getInfo(): {
    totalComandos: number;
    puedeDeshacer: boolean;
    puedeRehacer: boolean;
    grabandoMacro: boolean;
    nombreMacroActual: string | null;
    macrosDisponibles: number;
  } {
    return {
      totalComandos: this.undoStack.length,
      puedeDeshacer: this.undoStack.length > 0,
      puedeRehacer: this.redoStack.length > 0,
      macrosDisponibles: this.macros.size,
      grabandoMacro: this.macroActual !== null,
      nombreMacroActual: this.macroActual?.getNombre() || null,
    };
  }

  /**
   * Obtiene el log de operaciones
   */
  getLog(): LogEntry[] {
    return [...this.log]; // Retorna una copia
  }

  /**
   * Limpia el log
   */
  limpiarLog(): void {
    this.log = [];
  }

  /**
   * Limpia todo el historial
   */
  limpiarHistorial(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.log.push({
      operacion: 'HISTORIAL',
      timestamp: new Date().toISOString(),
      detalles: 'Historial limpiado',
    });
  }

  /**
   * Verifica si hay comandos para deshacer
   */
  puedeDeshacer(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Verifica si hay comandos para rehacer
   */
  puedeRehacer(): boolean {
    return this.redoStack.length > 0;
  }
}
