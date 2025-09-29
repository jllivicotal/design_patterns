export interface TemperatureSensor {
  /**
   * Obtiene la temperatura en grados Celsius (interfaz unificada)
   */
  getTemperatureC(): number;
  
  /**
   * Obtiene el ID del bloque donde está el sensor
   */
  getBlockId(): string;
}