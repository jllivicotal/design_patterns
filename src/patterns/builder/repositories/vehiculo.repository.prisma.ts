import { Injectable } from '@nestjs/common';
import { IVehiculoRepositorio } from './vehiculo.repository.interface';
import { Vehiculo, Auto, Camioneta, Camion, TipoVehiculo } from '../models';
import { VehiculoBuilder } from '../builders';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class VehiculoRepositorioPrisma implements IVehiculoRepositorio {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async crear(vehiculo: Vehiculo): Promise<Vehiculo> {
    const data = this.vehiculoToData(vehiculo, true);
    try {
      const created = await this.prisma.vehiculo.create({
        data,
        include: { propietario: true },
      });
      return this.dataToVehiculo(created);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002' && (error.meta as any)?.target?.includes('placa')) {
          throw new Error(`Ya existe un vehículo con la placa ${vehiculo.getPlaca()}`);
        }
        if (error.code === 'P2003') {
          throw new Error('El propietario especificado no existe');
        }
      }
      throw error;
    }
  }

  async modificar(codigo: number, vehiculo: Vehiculo): Promise<Vehiculo> {
    const data = this.vehiculoToData(vehiculo);
    try {
      const updated = await this.prisma.vehiculo.update({
        where: { codigo },
        data,
        include: { propietario: true },
      });
      return this.dataToVehiculo(updated);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002' && (error.meta as any)?.target?.includes('placa')) {
          throw new Error(`Ya existe otro vehículo con la placa ${vehiculo.getPlaca()}`);
        }
        if (error.code === 'P2025') {
          throw new Error(`Vehículo con código ${codigo} no encontrado`);
        }
      }
      throw error;
    }
  }

  async eliminar(codigo: number): Promise<void> {
    await this.prisma.vehiculo.delete({
      where: { codigo },
    });
  }

  async listar(): Promise<Vehiculo[]> {
    const vehiculos = await this.prisma.vehiculo.findMany({
      include: {
        propietario: true,
      },
    });

    return vehiculos.map(vehiculo => this.dataToVehiculo(vehiculo));
  }

  async buscarPorId(codigo: number): Promise<Vehiculo | null> {
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { codigo },
      include: {
        propietario: true,
      },
    });

    return vehiculo ? this.dataToVehiculo(vehiculo) : null;
  }

  async buscarPorPlaca(placa: string): Promise<Vehiculo | null> {
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { placa },
      include: { propietario: true },
    });
    return vehiculo ? this.dataToVehiculo(vehiculo) : null;
  }

  private vehiculoToData(vehiculo: Vehiculo, isCreate = false): any {
    // Si estamos creando y el código es 0 (valor por defecto del builder), lo omitimos
    // para permitir que la BD (autoincrement) asigne el valor.
    const includeCodigo = !isCreate || vehiculo.getCodigo() > 0;

    const baseData: any = {
      nombre: vehiculo.getNombre(),
      pais: vehiculo.getPais(),
      placa: vehiculo.getPlaca(),
      tipo: vehiculo.getTipo(),
      propietarioId: vehiculo.getPropietarioId() ?? undefined,
    };

    if (includeCodigo) {
      baseData.codigo = vehiculo.getCodigo();
    }

    switch (vehiculo.getTipo()) {
      case TipoVehiculo.AUTO:
        const auto = vehiculo as Auto;
        return {
          ...baseData,
          numPuertas: auto.getNumPuertas(),
          traccion: null,
          capacidadTon: null,
        };

      case TipoVehiculo.CAMIONETA:
        const camioneta = vehiculo as Camioneta;
        return {
          ...baseData,
          numPuertas: null,
          traccion: camioneta.getTraccion(),
          capacidadTon: null,
        };

      case TipoVehiculo.CAMION:
        const camion = vehiculo as Camion;
        return {
          ...baseData,
          numPuertas: null,
          traccion: null,
          capacidadTon: camion.getCapacidadTon(),
        };

      default:
        throw new Error(`Tipo de vehículo no soportado: ${vehiculo.getTipo()}`);
    }
  }

  private dataToVehiculo(data: any): Vehiculo {
    const builder = new VehiculoBuilder()
      .setCodigo(data.codigo)
      .setNombre(data.nombre)
      .setPais(data.pais)
      .setPlaca(data.placa)
      .setTipo(data.tipo);

    if (data.propietarioId) {
      builder.setPropietarioId(data.propietarioId);
    }

    switch (data.tipo) {
      case TipoVehiculo.AUTO:
        builder.setNumPuertas(data.numPuertas);
        break;

      case TipoVehiculo.CAMIONETA:
        builder.setTraccion(data.traccion);
        break;

      case TipoVehiculo.CAMION:
        builder.setCapacidadTon(data.capacidadTon);
        break;

      default:
        throw new Error(`Tipo de vehículo no soportado: ${data.tipo}`);
    }

    return builder.build();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}