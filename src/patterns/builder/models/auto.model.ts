import { Vehiculo, TipoVehiculo } from './vehiculo.model';

export class Auto extends Vehiculo {
  private numPuertas: number;

  constructor(
    codigo: number,
    nombre: string,
    pais: string,
    placa: string,
    numPuertas: number,
    propietarioId?: number,
  ) {
    super(codigo, nombre, pais, placa, propietarioId);
    this.numPuertas = numPuertas;
  }

  public getNumPuertas(): number {
    return this.numPuertas;
  }

  public setNumPuertas(numPuertas: number): void {
    this.numPuertas = numPuertas;
  }

  public getCostoMatricula(): number {
    // Costo base para autos: $100 + $20 por puerta adicional (después de 2)
    const costoBase = 100;
    const costoAdicional = this.numPuertas > 2 ? (this.numPuertas - 2) * 20 : 0;
    return costoBase + costoAdicional;
  }

  public getTipo(): TipoVehiculo {
    return TipoVehiculo.AUTO;
  }
}