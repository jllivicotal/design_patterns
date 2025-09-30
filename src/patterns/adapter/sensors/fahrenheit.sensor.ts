/**
 * Adaptee 2: Sensor que mide en grados Fahrenheit
 * Este sensor necesita un adaptador para convertir a °C
 */
export class FahrenheitSensor {
  constructor(
    private readonly blockId: string,
    private readonly temperatureF: number,
  ) {}

  /**
   * Lee la temperatura en grados Fahrenheit
   */
  readFahrenheit(): number {
    return this.temperatureF;
  }

  getBlockId(): string {
    return this.blockId;
  }
}