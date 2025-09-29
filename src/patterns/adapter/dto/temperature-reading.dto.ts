/**
 * DTO para las lecturas de temperatura expuestas por la API
 */
export class TemperatureReadingDTO {
  blockId: string;
  valueC: number; // valor normalizado en °C
  timestamp: Date;

  constructor(blockId: string, valueC: number, timestamp?: Date) {
    this.blockId = blockId;
    this.valueC = valueC;
    this.timestamp = timestamp || new Date();
  }
}