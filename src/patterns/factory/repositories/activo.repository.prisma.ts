import { Injectable } from '@nestjs/common';
import { IActivoRepositorio } from './activo.repository.interface';
import { IActivoFijo, TipoActivo, OpcionesActivo, Computador, Mesa, AutoAF, Silla } from '../models';
import { ActivoFijoFactorySimple } from '../factories';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ActivoRepositorioPrisma implements IActivoRepositorio {
  private prisma: PrismaClient;
  private factory: ActivoFijoFactorySimple;

  constructor() {
    this.prisma = new PrismaClient();
    this.factory = new ActivoFijoFactorySimple();
  }

  async crear(activo: IActivoFijo): Promise<IActivoFijo> {
    const data = this.activoToData(activo);
    
    const created = await this.prisma.activoFijo.create({
      data,
    });

    return this.dataToActivo(created);
  }

  async modificar(codigo: number, activo: IActivoFijo): Promise<IActivoFijo> {
    const data = this.activoToData(activo);
    
    const updated = await this.prisma.activoFijo.update({
      where: { codigo },
      data,
    });

    return this.dataToActivo(updated);
  }

  async eliminar(codigo: number): Promise<void> {
    await this.prisma.activoFijo.delete({
      where: { codigo },
    });
  }

  async listar(): Promise<IActivoFijo[]> {
    const activos = await this.prisma.activoFijo.findMany();
    return activos.map(activo => this.dataToActivo(activo));
  }

  async buscarPorId(codigo: number): Promise<IActivoFijo | null> {
    const activo = await this.prisma.activoFijo.findUnique({
      where: { codigo },
    });

    return activo ? this.dataToActivo(activo) : null;
  }

  private activoToData(activo: IActivoFijo): any {
    const opciones = activo.getOpciones();
    
    const baseData = {
      codigo: activo.getCodigo(),
      nombre: activo.getNombre(),
      precio: activo.getPrecio(),
      tipo: this.getTipoFromActivo(activo),
      vidaUtilMeses: opciones?.vidaUtilMeses,
      marca: opciones?.marca,
      modelo: opciones?.modelo,
      serie: opciones?.serie,
      color: opciones?.color,
      dimensiones: opciones?.dimensiones,
      material: opciones?.material,
      placaVehiculo: opciones?.placaVehiculo,
    };

    if (activo instanceof Computador) {
      return {
        ...baseData,
        cpu: activo.getCpu(),
        ramGB: activo.getRamGB(),
        materialMesa: null,
        placa: null,
        ergonomica: null,
      };
    } else if (activo instanceof Mesa) {
      return {
        ...baseData,
        cpu: null,
        ramGB: null,
        materialMesa: activo.getMaterial(),
        placa: null,
        ergonomica: null,
      };
    } else if (activo instanceof AutoAF) {
      return {
        ...baseData,
        cpu: null,
        ramGB: null,
        materialMesa: null,
        placa: activo.getPlaca(),
        ergonomica: null,
      };
    } else if (activo instanceof Silla) {
      return {
        ...baseData,
        cpu: null,
        ramGB: null,
        materialMesa: null,
        placa: null,
        ergonomica: activo.isErgonomica(),
      };
    }

    return {
      ...baseData,
      cpu: null,
      ramGB: null,
      materialMesa: null,
      placa: null,
      ergonomica: null,
    };
  }

  private dataToActivo(data: any): IActivoFijo {
    const opciones = new OpcionesActivo({
      vidaUtilMeses: data.vidaUtilMeses,
      marca: data.marca,
      modelo: data.modelo,
      serie: data.serie,
      color: data.color,
      dimensiones: data.dimensiones,
      material: data.material,
      placaVehiculo: data.placaVehiculo,
    });

    const dto = {
      codigo: data.codigo,
      nombre: data.nombre,
      precio: data.precio,
      tipo: data.tipo,
      opciones,
      cpu: data.cpu,
      ramGB: data.ramGB,
      material: data.materialMesa,
      placa: data.placa,
      ergonomica: data.ergonomica,
    };

    return this.factory.crear(dto);
  }

  private getTipoFromActivo(activo: IActivoFijo): TipoActivo {
    if (activo instanceof Computador) return TipoActivo.COMPUTADOR;
    if (activo instanceof Mesa) return TipoActivo.MESA;
    if (activo instanceof AutoAF) return TipoActivo.AUTO;
    if (activo instanceof Silla) return TipoActivo.SILLA;
    return TipoActivo.OTRO;
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}