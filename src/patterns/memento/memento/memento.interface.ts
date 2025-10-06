/**
 * Interfaz angosta del Memento (visible al Caretaker)
 * Solo expone métodos de consulta, no permite acceder al estado interno
 */
export interface Memento {
  /**
   * Obtiene la etiqueta descriptiva del memento
   */
  getEtiqueta(): string;

  /**
   * Obtiene la fecha de creación del memento
   */
  getFecha(): Date;

  /**
   * Obtiene la versión del estado capturado
   */
  getVersion(): number;
}
