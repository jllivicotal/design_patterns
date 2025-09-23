import { Vehiculo, TipoVehiculo } from './vehiculo.model';

export class Camioneta extends Vehiculo {
  private traccion: string; // '4x2' | '4x4'

  constructor(
    codigo: number,
    nombre: string,
    pais: string,
    placa: string,
    traccion: string,
    propietarioId?: number,
  ) {
    super(codigo, nombre, pais, placa, propietarioId);
    this.traccion = traccion;
  }

  public getTraccion(): string {
    return this.traccion;
  }

  public setTraccion(traccion: string): void {
    this.traccion = traccion;
  }

  public getCostoMatricula(): number {
    // Costo base para camionetas: $150 + $50 extra si es 4x4
    const costoBase = 150;
    const costoTraccion = this.traccion === '4x4' ? 50 : 0;
    return costoBase + costoTraccion;
  }

  public getTipo(): TipoVehiculo {
    return TipoVehiculo.CAMIONETA;
  }
}