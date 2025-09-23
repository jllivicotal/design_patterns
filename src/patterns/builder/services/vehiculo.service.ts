import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { IVehiculoServicio } from './vehiculo.service.interface';
import { IVehiculoRepositorio } from '../repositories';
import { Vehiculo } from '../models';

@Injectable()
export class VehiculoServicio implements IVehiculoServicio {
  constructor(
    @Inject('IVehiculoRepositorio')
    private readonly repository: IVehiculoRepositorio,
  ) {}

  async crear(vehiculo: Vehiculo): Promise<Vehiculo> {
    try {
      // Validar que la placa no esté duplicada
      const existente = await this.buscarPorPlaca(vehiculo.getPlaca());
      if (existente) {
        throw new BadRequestException(`Ya existe un vehículo con la placa ${vehiculo.getPlaca()}`);
      }

      return await this.repository.crear(vehiculo);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el vehículo');
    }
  }

  async modificar(codigo: number, vehiculo: Vehiculo): Promise<Vehiculo> {
    try {
      // Verificar que el vehículo existe
      const existente = await this.repository.buscarPorId(codigo);
      if (!existente) {
        throw new NotFoundException(`Vehículo con código ${codigo} no encontrado`);
      }

      // Validar que la placa no esté duplicada (excepto para el mismo vehículo)
      const vehiculoConMismaPlaca = await this.buscarPorPlaca(vehiculo.getPlaca());
      if (vehiculoConMismaPlaca && vehiculoConMismaPlaca.getCodigo() !== codigo) {
        throw new BadRequestException(`Ya existe otro vehículo con la placa ${vehiculo.getPlaca()}`);
      }

      return await this.repository.modificar(codigo, vehiculo);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al modificar el vehículo');
    }
  }

  async eliminar(codigo: number): Promise<void> {
    try {
      const existente = await this.repository.buscarPorId(codigo);
      if (!existente) {
        throw new NotFoundException(`Vehículo con código ${codigo} no encontrado`);
      }

      await this.repository.eliminar(codigo);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el vehículo');
    }
  }

  async listar(): Promise<Vehiculo[]> {
    try {
      return await this.repository.listar();
    } catch (error) {
      throw new BadRequestException('Error al listar los vehículos');
    }
  }

  async buscarPorId(codigo: number): Promise<Vehiculo | null> {
    try {
      return await this.repository.buscarPorId(codigo);
    } catch (error) {
      throw new BadRequestException('Error al buscar el vehículo');
    }
  }

  private async buscarPorPlaca(placa: string): Promise<Vehiculo | null> {
    const vehiculos = await this.repository.listar();
    return vehiculos.find(v => v.getPlaca() === placa) || null;
  }
}