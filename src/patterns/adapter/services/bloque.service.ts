import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Bloque } from '@prisma/client';
import { CreateBloqueDto, UpdateBloqueDto } from '../dto';
import { BloquePrismaRepository, CreateBloqueData, UpdateBloqueData } from '../repositories';

/**
 * Servicio para el CRUD de bloques
 */
@Injectable()
export class BloqueService {
  constructor(private bloqueRepository: BloquePrismaRepository) {}

  /**
   * Obtiene todos los bloques
   */
  async findAll(): Promise<Bloque[]> {
    return this.bloqueRepository.findAll();
  }

  /**
   * Obtiene un bloque por ID
   */
  async findOne(id: number): Promise<Bloque> {
    const bloque = await this.bloqueRepository.findOne(id);
    if (!bloque) {
      throw new NotFoundException(`Bloque con ID ${id} no encontrado`);
    }
    return bloque;
  }

  /**
   * Obtiene un bloque por nombre
   */
  async findByNombre(nombre: string): Promise<Bloque> {
    const bloque = await this.bloqueRepository.findByNombre(nombre);
    if (!bloque) {
      throw new NotFoundException(`Bloque con nombre ${nombre} no encontrado`);
    }
    return bloque;
  }

  /**
   * Crea un nuevo bloque
   */
  async create(createBloqueDto: CreateBloqueDto): Promise<Bloque> {
    const data: CreateBloqueData = {
      nombre: createBloqueDto.nombre,
      tipoMedicion: this.normalizeTipoMedicion(createBloqueDto.tipoMedicion),
      temperatura: createBloqueDto.temperatura,
      fechaRegistro: new Date(),
    };

    return this.bloqueRepository.create(data);
  }

  /**
   * Actualiza un bloque existente
   */
  async update(id: number, updateBloqueDto: UpdateBloqueDto): Promise<Bloque> {
    await this.findOne(id); // Verificar que existe

    const data: UpdateBloqueData = {
      ...updateBloqueDto,
    };

    if (updateBloqueDto.tipoMedicion) {
      data.tipoMedicion = this.normalizeTipoMedicion(updateBloqueDto.tipoMedicion);
    }

    if (updateBloqueDto.temperatura !== undefined || updateBloqueDto.tipoMedicion) {
      data.fechaRegistro = new Date();
    }

    return this.bloqueRepository.update(id, data);
  }

  /**
   * Elimina un bloque
   */
  async remove(id: number): Promise<Bloque> {
    await this.findOne(id); // Verificar que existe
    return this.bloqueRepository.remove(id);
  }

  /**
   * Normaliza el tipo de medición a valores válidos del sistema
   */
  private normalizeTipoMedicion(tipo: string): 'CELSIUS' | 'FAHRENHEIT' {
    const normalized = (tipo || '').toUpperCase();
    if (normalized !== 'CELSIUS' && normalized !== 'FAHRENHEIT') {
      throw new BadRequestException(`Tipo de medición no soportado: ${tipo}`);
    }
    return normalized as 'CELSIUS' | 'FAHRENHEIT';
  }
}