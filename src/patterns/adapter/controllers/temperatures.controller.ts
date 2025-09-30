import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { TemperatureService } from '../services';
import { TemperatureReadingDTO } from '../dto';

/**
 * Controlador para el sistema de temperatura (Patrón Adapter)
 */
@Controller('temperatures')
export class TemperaturesController {
  constructor(private temperatureService: TemperatureService) {}

  /**
   * GET /temperatures
   * Obtiene todas las lecturas de temperatura
   */
  @Get()
  async getAllReadings(): Promise<TemperatureReadingDTO[]> {
    return this.temperatureService.getAllReadings();
  }

  /**
   * GET /temperatures/blocks/available
   * Obtiene la lista de bloques con sensores disponibles
   */
  @Get('blocks/available')
  async getAvailableBlocks(): Promise<{
    blocks: Array<{ id: number; name: string; tipoMedicion: 'CELSIUS' | 'FAHRENHEIT' }>;
  }> {
    const blocks = await this.temperatureService.getAvailableBlocks();
    return { blocks };
  }

  /**
   * GET /temperatures/:blockId
   * Obtiene la lectura de temperatura de un bloque específico
   */
  @Get(':blockId')
  async getReadingByBlock(@Param('blockId') blockId: string): Promise<TemperatureReadingDTO> {
    const reading = await this.temperatureService.getReadingByBlock(blockId);
    if (!reading) {
      throw new NotFoundException(`No se encontró sensor para el bloque: ${blockId}`);
    }
    return reading;
  }
}