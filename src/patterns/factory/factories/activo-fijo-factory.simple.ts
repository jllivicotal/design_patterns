import { Injectable } from '@nestjs/common';
import { IActivoFijoFactory } from './activo-fijo-factory.interface';
import { IActivoFijo, TipoActivo, OpcionesActivo, Computador, Mesa, AutoAF, Silla } from '../models';
import { CrearActivoDto } from '../dtos';

@Injectable()
export class ActivoFijoFactorySimple implements IActivoFijoFactory {
  crear(dto: CrearActivoDto): IActivoFijo {
    const opciones = dto.opciones ? new OpcionesActivo(dto.opciones) : undefined;

    switch (dto.tipo) {
      case TipoActivo.COMPUTADOR:
        if (!dto.cpu || dto.ramGB === undefined) {
          throw new Error('CPU y RAM son requeridos para Computador');
        }
        return new Computador(
          dto.codigo,
          dto.nombre,
          dto.precio,
          dto.cpu,
          dto.ramGB,
          opciones,
        );

      case TipoActivo.MESA:
        if (!dto.material) {
          throw new Error('Material es requerido para Mesa');
        }
        return new Mesa(
          dto.codigo,
          dto.nombre,
          dto.precio,
          dto.material,
          opciones,
        );

      case TipoActivo.AUTO:
        if (!dto.placa) {
          throw new Error('Placa es requerida para Auto');
        }
        return new AutoAF(
          dto.codigo,
          dto.nombre,
          dto.precio,
          dto.placa,
          opciones,
        );

      case TipoActivo.SILLA:
        if (dto.ergonomica === undefined) {
          throw new Error('Propiedad ergonómica es requerida para Silla');
        }
        return new Silla(
          dto.codigo,
          dto.nombre,
          dto.precio,
          dto.ergonomica,
          opciones,
        );

      case TipoActivo.OTRO:
        // Para tipo OTRO, creamos una clase genérica que extiende ActivoFijoBase
        return new (class extends Computador {
          constructor() {
            super(dto.codigo, dto.nombre, dto.precio, 'N/A', 0, opciones);
          }
          
          valorActual(): number {
            // Depreciación estándar del 10% anual
            const mesesTranscurridos = this.getOpciones()?.vidaUtilMeses || 0;
            const depreciacionAnual = 0.10;
            const depreciacionMensual = depreciacionAnual / 12;
            const factorDepreciacion = Math.max(0, 1 - (mesesTranscurridos * depreciacionMensual));
            return this.getPrecio() * factorDepreciacion;
          }
        })();

      default:
        throw new Error(`Tipo de activo no soportado: ${dto.tipo}`);
    }
  }
}