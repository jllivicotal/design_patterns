import { Vehiculo, TipoVehiculo } from './vehiculo.model';

export class Camion extends Vehiculo {
  private capacidadTon: number;

  constructor(
    codigo: number,
    nombre: string,
    pais: string,
    placa: string,
    capacidadTon: number,
    propietarioId?: number,
  ) {
    super(codigo, nombre, pais, placa, propietarioId);
    this.capacidadTon = capacidadTon;
  }

  public getCapacidadTon(): number {
    return this.capacidadTon;
  }

  public setCapacidadTon(capacidadTon: number): void {
    this.capacidadTon = capacidadTon;
  }

  public getCostoMatricula(): number {
    // Costo base para camiones: $200 + $30 por tonelada de capacidad
    const costoBase = 200;
    const costoPorTonelada = this.capacidadTon * 30;
    return costoBase + costoPorTonelada;
  }

  public getTipo(): TipoVehiculo {
    return TipoVehiculo.CAMION;
  }
}