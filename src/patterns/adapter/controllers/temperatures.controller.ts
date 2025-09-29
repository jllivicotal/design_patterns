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
  getAllReadings(): TemperatureReadingDTO[] {
    return this.temperatureService.getAllReadings();
  }

  /**
   * GET /temperatures/:blockId
   * Obtiene la lectura de temperatura de un bloque específico
   */
  @Get(':blockId')
  getReadingByBlock(@Param('blockId') blockId: string): TemperatureReadingDTO {
    const reading = this.temperatureService.getReadingByBlock(blockId);
    if (!reading) {
      throw new NotFoundException(`No se encontró sensor para el bloque: ${blockId}`);
    }
    return reading;
  }

  /**
   * GET /temperatures/blocks/available
   * Obtiene la lista de bloques con sensores disponibles
   */
  @Get('blocks/available')
  getAvailableBlocks(): { blocks: string[] } {
    return {
      blocks: this.temperatureService.getAvailableBlocks()
    };
  }
}