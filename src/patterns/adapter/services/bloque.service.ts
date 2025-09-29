import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBloqueDto, UpdateBloqueDto } from '../dto';
import { BloquePrismaRepository } from '../repositories';

/**
 * Servicio para el CRUD de bloques
 */
@Injectable()
export class BloqueService {
  constructor(private bloqueRepository: BloquePrismaRepository) {}

  /**
   * Obtiene todos los bloques
   */
  async findAll() {
    return this.bloqueRepository.findAll();
  }

  /**
   * Obtiene un bloque por ID
   */
  async findOne(id: number) {
    const bloque = await this.bloqueRepository.findOne(id);
    if (!bloque) {
      throw new NotFoundException(`Bloque con ID ${id} no encontrado`);
    }
    return bloque;
  }

  /**
   * Crea un nuevo bloque
   */
  async create(createBloqueDto: CreateBloqueDto) {
    return this.bloqueRepository.create(createBloqueDto);
  }

  /**
   * Actualiza un bloque existente
   */
  async update(id: number, updateBloqueDto: UpdateBloqueDto) {
    await this.findOne(id); // Verificar que existe
    return this.bloqueRepository.update(id, updateBloqueDto);
  }

  /**
   * Elimina un bloque
   */
  async remove(id: number) {
    await this.findOne(id); // Verificar que existe
    return this.bloqueRepository.remove(id);
  }
}