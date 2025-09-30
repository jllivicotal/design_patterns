import { Injectable } from '@nestjs/common';
import { TemperatureSensor } from '../interfaces';
import { TemperatureReadingDTO } from '../dto';
import { CelsiusAdapter, FahrenheitAdapter } from '../adapters';
import { CelsiusSensor, FahrenheitSensor } from '../sensors';
import { Bloque } from '@prisma/client';
import { BloquePrismaRepository } from '../repositories';

/**
 * Servicio de dominio para el sistema de temperatura
 * Maneja los sensores a través de la interfaz unificada TemperatureSensor
 */
@Injectable()
export class TemperatureService {
  constructor(private readonly bloqueRepository: BloquePrismaRepository) {}

  /**
   * Obtiene todas las lecturas normalizadas en °C
   */
  async getAllReadings(): Promise<TemperatureReadingDTO[]> {
    const bloques = await this.bloqueRepository.findAll();
    return bloques.map((bloque) => this.buildReadingFromBloque(bloque));
  }

  /**
   * Obtiene la lectura para un bloque identificado por su nombre (ID lógico)
   */
  async getReadingByBlock(blockId: string): Promise<TemperatureReadingDTO | null> {
    const numericId = Number(blockId);
    let bloque: Bloque | null = null;

    if (!Number.isNaN(numericId)) {
      bloque = await this.bloqueRepository.findOne(numericId);
    }

    if (!bloque) {
      bloque = await this.bloqueRepository.findByNombre(blockId);
    }

    if (!bloque) {
      return null;
    }

    return this.buildReadingFromBloque(bloque);
  }

  /**
   * Obtiene el listado de bloques disponibles en el sistema
   */
  async getAvailableBlocks(): Promise<Array<{ id: number; name: string; tipoMedicion: 'CELSIUS' | 'FAHRENHEIT' }>> {
    const bloques = await this.bloqueRepository.findAll();
    return bloques.map((bloque) => ({
      id: bloque.id,
      name: bloque.nombre,
      tipoMedicion: this.resolveUnit(bloque.tipoMedicion),
    }));
  }

  /**
   * Crea el DTO de lectura utilizando los adaptadores apropiados
   */
  private buildReadingFromBloque(bloque: Bloque): TemperatureReadingDTO {
    const sensor = this.createSensor(bloque);
    const normalizedValue = sensor.getTemperatureC();
    const originalUnit = this.resolveUnit(bloque.tipoMedicion);

    return new TemperatureReadingDTO(
      sensor.getBlockId(),
      normalizedValue,
      bloque.fechaRegistro,
      bloque.temperatura,
      originalUnit,
      bloque.id,
    );
  }

  /**
   * Genera el adaptador correcto según el tipo de medición del bloque
   */
  private createSensor(bloque: Bloque): TemperatureSensor {
    const blockIdentifier = bloque.nombre;
    const tipoMedicion = (bloque.tipoMedicion || '').toUpperCase();

    if (tipoMedicion === 'FAHRENHEIT') {
      const sensor = new FahrenheitSensor(blockIdentifier, bloque.temperatura);
      return new FahrenheitAdapter(sensor);
    }

    // Por defecto tratamos como Celsius
    const sensor = new CelsiusSensor(blockIdentifier, bloque.temperatura);
    return new CelsiusAdapter(sensor);
  }

  private resolveUnit(tipoMedicion?: string): 'CELSIUS' | 'FAHRENHEIT' {
    const normalized = (tipoMedicion || 'CELSIUS').toUpperCase();
    return normalized === 'FAHRENHEIT' ? 'FAHRENHEIT' : 'CELSIUS';
  }
}