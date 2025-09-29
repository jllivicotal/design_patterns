/**
 * Adaptee 2: Sensor que mide en grados Fahrenheit
 * Este sensor necesita un adaptador para convertir a °C
 */
export class FahrenheitSensor {
  private blockId: string;

  constructor(blockId: string) {
    this.blockId = blockId;
  }

  /**
   * Lee la temperatura en grados Fahrenheit
   * Simula la lectura de un sensor físico
   */
  readFahrenheit(): number {
    // Simula una lectura de temperatura entre 59°F y 95°F (equivalente a 15°C - 35°C)
    return Math.round((59 + Math.random() * 36) * 100) / 100;
  }

  getBlockId(): string {
    return this.blockId;
  }
}