import { Memento } from './memento.interface';
import { EstadoSolicitud } from '../value-objects';

/**
 * Interfaz ancha del Memento (visible solo al Originator)
 * Extiende la interfaz angosta y agrega acceso al estado interno
 */
export interface OriginatorMemento extends Memento {
  /**
   * Obtiene el estado interno (solo accesible por el Originator)
   */
  getEstado(): EstadoSolicitud;
}
