import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { IActivoServicio } from './activo.service.interface';
import { IActivoRepositorio } from '../repositories';
import { IActivoFijoFactory } from '../factories';
import { IActivoFijo } from '../models';
import { CrearActivoDto } from '../dtos';

@Injectable()
export class ActivoServicio implements IActivoServicio {
  constructor(
    @Inject('IActivoRepositorio')
    private readonly repository: IActivoRepositorio,
    @Inject('IActivoFijoFactory')
    private readonly factory: IActivoFijoFactory,
  ) {}

  async crear(dto: CrearActivoDto): Promise<IActivoFijo> {
    try {
      // Crear el activo usando el factory
      const activo = this.factory.crear(dto);
      
      // Guardar en el repositorio
      return await this.repository.crear(activo);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Error al crear el activo');
    }
  }

  async modificar(codigo: number, dto: CrearActivoDto): Promise<IActivoFijo> {
    try {
      // Verificar que el activo existe
      const existente = await this.repository.buscarPorId(codigo);
      if (!existente) {
        throw new NotFoundException(`Activo con código ${codigo} no encontrado`);
      }

      // Crear el nuevo activo usando el factory
      const activo = this.factory.crear(dto);
      
      // Actualizar en el repositorio
      return await this.repository.modificar(codigo, activo);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Error al modificar el activo');
    }
  }

  async eliminar(codigo: number): Promise<void> {
    try {
      const existente = await this.repository.buscarPorId(codigo);
      if (!existente) {
        throw new NotFoundException(`Activo con código ${codigo} no encontrado`);
      }

      await this.repository.eliminar(codigo);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el activo');
    }
  }

  async listar(): Promise<IActivoFijo[]> {
    try {
      return await this.repository.listar();
    } catch (error) {
      throw new BadRequestException('Error al listar los activos');
    }
  }
}