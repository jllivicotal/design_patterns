import { Injectable } from '@nestjs/common';
import { TemperatureSensor } from '../interfaces';
import { TemperatureReadingDTO } from '../dto';
import { CelsiusAdapter, FahrenheitAdapter } from '../adapters';
import { CelsiusSensor, FahrenheitSensor } from '../sensors';

/**
 * Servicio de dominio para el sistema de temperatura
 * Maneja los sensores a través de la interfaz unificada TemperatureSensor
 */
@Injectable()
export class TemperatureService {
  private sensors: TemperatureSensor[] = [];

  constructor() {
    // Inicializar con algunos sensores de ejemplo
    this.initializeSensors();
  }

  /**
   * Inicializa sensores de ejemplo para demostrar el patrón Adapter
   */
  private initializeSensors() {
    // Sensor Celsius en Bloque A
    const celsiusSensor = new CelsiusSensor('BLOQUE-A');
    const celsiusAdapter = new CelsiusAdapter(celsiusSensor);
    this.registerSensor(celsiusAdapter);

    // Sensor Fahrenheit en Bloque B
    const fahrenheitSensor = new FahrenheitSensor('BLOQUE-B');
    const fahrenheitAdapter = new FahrenheitAdapter(fahrenheitSensor);
    this.registerSensor(fahrenheitAdapter);
  }

  /**
   * Registra un nuevo sensor en el sistema
   */
  registerSensor(sensor: TemperatureSensor): void {
    this.sensors.push(sensor);
  }

  /**
   * Obtiene todas las lecturas de temperatura de todos los sensores
   */
  getAllReadings(): TemperatureReadingDTO[] {
    return this.sensors.map(sensor => new TemperatureReadingDTO(
      sensor.getBlockId(),
      sensor.getTemperatureC()
    ));
  }

  /**
   * Obtiene la lectura de temperatura de un bloque específico
   */
  getReadingByBlock(blockId: string): TemperatureReadingDTO | null {
    const sensor = this.sensors.find(s => s.getBlockId() === blockId);
    if (!sensor) {
      return null;
    }
    
    return new TemperatureReadingDTO(
      sensor.getBlockId(),
      sensor.getTemperatureC()
    );
  }

  /**
   * Obtiene la lista de bloques disponibles
   */
  getAvailableBlocks(): string[] {
    return this.sensors.map(sensor => sensor.getBlockId());
  }
}