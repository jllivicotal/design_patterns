/**
 * Adaptee 1: Sensor que ya mide en grados Celsius
 * Este sensor no necesita conversión ya que entrega directamente en °C
 */
export class CelsiusSensor {
  private blockId: string;

  constructor(blockId: string) {
    this.blockId = blockId;
  }

  /**
   * Lee la temperatura directamente en grados Celsius
   * Simula la lectura de un sensor físico
   */
  readCelsius(): number {
    // Simula una lectura de temperatura entre 15°C y 35°C
    return Math.round((15 + Math.random() * 20) * 100) / 100;
  }

  getBlockId(): string {
    return this.blockId;
  }
}