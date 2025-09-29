import { TemperatureSensor } from '../interfaces';
import { CelsiusSensor } from '../sensors';

/**
 * Adapter para sensor de Celsius
 * Como el sensor ya mide en °C, no necesita conversión
 */
export class CelsiusAdapter implements TemperatureSensor {
  private sensor: CelsiusSensor;

  constructor(sensor: CelsiusSensor) {
    this.sensor = sensor;
  }

  /**
   * Obtiene la temperatura en °C (sin conversión)
   */
  getTemperatureC(): number {
    return this.sensor.readCelsius();
  }

  /**
   * Obtiene el ID del bloque
   */
  getBlockId(): string {
    return this.sensor.getBlockId();
  }
}