import { Memento, OriginatorMemento } from '../memento';
import { SolicitudCertificado } from '../originator';

/**
 * Caretaker: Historial de Solicitudes
 * Administra los mementos sin conocer su contenido interno
 * Implementa funcionalidad de Undo/Redo con pilas
 */
export class HistorialSolicitudes {
  private originator: SolicitudCertificado;
  private pilaUndo: Memento[] = [];
  private pilaRedo: Memento[] = [];
  private maxCapacidad: number = 50;

  constructor(originator: SolicitudCertificado, maxCapacidad: number = 50) {
    this.originator = originator;
    this.maxCapacidad = maxCapacidad;
  }

  /**
   * Guarda un snapshot del estado actual con una etiqueta descriptiva
   */
  snapshot(etiqueta: string): void {
    const memento = this.originator.crearMemento(etiqueta);
    
    // Agregar a la pila de undo
    this.pilaUndo.push(memento);
    
    // Limpiar la pila de redo (nueva acción invalida el historial de redo)
    this.pilaRedo = [];
    
    // Limitar la capacidad de la pila
    if (this.pilaUndo.length > this.maxCapacidad) {
      this.pilaUndo.shift(); // Eliminar el más antiguo
    }
  }

  /**
   * Deshace la última operación
   * Mueve el snapshot actual a la pila de redo y restaura el anterior
   */
  undo(): void {
    if (this.pilaUndo.length <= 1) {
      throw new Error('No hay operaciones para deshacer (necesitas al menos 2 snapshots)');
    }

    // Sacar el estado actual (última posición) y moverlo a redo
    const estadoActual = this.pilaUndo.pop()!;
    this.pilaRedo.push(estadoActual);

    // Ahora restaurar el que quedó en la cima del undo (sin sacarlo)
    const mementoAnterior = this.pilaUndo[this.pilaUndo.length - 1];
    this.originator.restaurar(mementoAnterior as OriginatorMemento);

    // Limitar la capacidad de la pila de redo
    if (this.pilaRedo.length > this.maxCapacidad) {
      this.pilaRedo.shift();
    }
  }

  /**
   * Rehace la última operación deshecha
   * Mueve el snapshot de redo de vuelta a undo y lo restaura
   */
  redo(): void {
    if (this.pilaRedo.length === 0) {
      throw new Error('No hay operaciones para rehacer');
    }

    // Sacar el memento de redo y ponerlo de vuelta en undo
    const mementoSiguiente = this.pilaRedo.pop()!;
    this.pilaUndo.push(mementoSiguiente);

    // Restaurar ese memento
    this.originator.restaurar(mementoSiguiente as OriginatorMemento);

    // Limitar la capacidad de la pila de undo
    if (this.pilaUndo.length > this.maxCapacidad) {
      this.pilaUndo.shift();
    }
  }

  /**
   * Establece la capacidad máxima de las pilas
   */
  setMaxCapacidad(n: number): void {
    if (n < 1) {
      throw new Error('La capacidad máxima debe ser al menos 1');
    }
    this.maxCapacidad = n;

    // Ajustar las pilas si exceden la nueva capacidad
    while (this.pilaUndo.length > this.maxCapacidad) {
      this.pilaUndo.shift();
    }
    while (this.pilaRedo.length > this.maxCapacidad) {
      this.pilaRedo.shift();
    }
  }

  /**
   * Lista todos los mementos disponibles
   * Solo expone la interfaz angosta (Memento)
   */
  listar(): Memento[] {
    return [...this.pilaUndo]; // Retorna una copia
  }

  /**
   * Obtiene información completa del historial incluyendo los mementos
   */
  getInfo(): {
    undoDisponibles: number;
    redoDisponibles: number;
    capacidadMaxima: number;
    historial: Array<{ etiqueta: string; fecha: Date; version: number }>;
    mementos: Memento[]; // Mementos de undo
    mementosRedo: Memento[]; // Mementos de redo
  } {
    return {
      undoDisponibles: this.pilaUndo.length,
      redoDisponibles: this.pilaRedo.length,
      capacidadMaxima: this.maxCapacidad,
      historial: this.pilaUndo.map((m) => ({
        etiqueta: m.getEtiqueta(),
        fecha: m.getFecha(),
        version: m.getVersion(),
      })),
      mementos: this.pilaUndo, // Incluir los mementos completos de undo
      mementosRedo: this.pilaRedo, // Incluir los mementos completos de redo
    };
  }

  /**
   * Limpia todo el historial
   */
  limpiar(): void {
    this.pilaUndo = [];
    this.pilaRedo = [];
  }

  /**
   * Verifica si hay operaciones disponibles para deshacer
   */
  puedeDeshacer(): boolean {
    return this.pilaUndo.length > 0;
  }

  /**
   * Verifica si hay operaciones disponibles para rehacer
   */
  puedeRehacer(): boolean {
    return this.pilaRedo.length > 0;
  }
}
