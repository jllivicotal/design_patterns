import { TemperatureSensor } from '../interfaces';
import { FahrenheitSensor } from '../sensors';

/**
 * Adapter para sensor de Fahrenheit
 * Convierte °F a °C para unificar la interfaz
 */
export class FahrenheitAdapter implements TemperatureSensor {
  private sensor: FahrenheitSensor;

  constructor(sensor: FahrenheitSensor) {
    this.sensor = sensor;
  }

  /**
   * Obtiene la temperatura convertida de °F a °C
   * Fórmula: (F - 32) * 5/9
   */
  getTemperatureC(): number {
    const fahrenheit = this.sensor.readFahrenheit();
    const celsius = (fahrenheit - 32) * 5 / 9;
    return Math.round(celsius * 100) / 100; // Redondeo a 2 decimales
  }

  /**
   * Obtiene el ID del bloque
   */
  getBlockId(): string {
    return this.sensor.getBlockId();
  }
}