/**
 * Adaptee 1: Sensor que ya mide en grados Celsius
 * Este sensor no necesita conversión ya que entrega directamente en °C
 */
export class CelsiusSensor {
  constructor(
    private readonly blockId: string,
    private readonly temperatureC: number,
  ) {}

  /**
   * Lee la temperatura directamente en grados Celsius
   */
  readCelsius(): number {
    return this.temperatureC;
  }

  getBlockId(): string {
    return this.blockId;
  }
}