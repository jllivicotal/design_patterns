import { Injectable } from '@nestjs/common';
import { TemperatureService, BloqueService } from './services';

/**
 * Servicio principal del patrón Adapter
 * Coordina los servicios de temperatura y bloques
 */
@Injectable()
export class AdapterService {
  constructor(
    private temperatureService: TemperatureService,
    private bloqueService: BloqueService
  ) {}

  /**
   * Obtiene información general del patrón implementado
   */
  getPatternOverview() {
    return {
      pattern: 'Adapter Pattern',
      implementation: 'Temperature Sensor System',
      description: 'Unifica diferentes tipos de sensores de temperatura bajo una interfaz común',
      activeBlocks: this.temperatureService.getAvailableBlocks().length
    };
  }

  /**
   * Obtiene estadísticas del sistema
   */
  async getSystemStats() {
    const bloques = await this.bloqueService.findAll();
    const activeReadings = this.temperatureService.getAllReadings();
    
    return {
      totalBloques: bloques.length,
      activeSensors: activeReadings.length,
      averageTemperature: activeReadings.length > 0 
        ? Math.round((activeReadings.reduce((sum, reading) => sum + reading.valueC, 0) / activeReadings.length) * 100) / 100
        : 0
    };
  }
}
