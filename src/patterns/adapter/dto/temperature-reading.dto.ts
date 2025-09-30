/**
 * DTO para las lecturas de temperatura expuestas por la API
 */
export class TemperatureReadingDTO {
  blockId: string;
  valueC: number; // valor normalizado en °C
  timestamp: Date;
  originalValue: number;
  originalUnit: 'CELSIUS' | 'FAHRENHEIT';
  blockDbId?: number;

  constructor(
    blockId: string,
    valueC: number,
    timestamp: Date | undefined,
    originalValue: number,
    originalUnit: 'CELSIUS' | 'FAHRENHEIT',
    blockDbId?: number,
  ) {
    this.blockId = blockId;
    this.valueC = valueC;
    this.timestamp = timestamp || new Date();
    this.originalValue = originalValue;
    this.originalUnit = originalUnit;
    this.blockDbId = blockDbId;
  }
}