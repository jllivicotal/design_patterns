export enum TipoVehiculo {
  AUTO = 'AUTO',
  CAMIONETA = 'CAMIONETA',
  CAMION = 'CAMION',
}

export abstract class Vehiculo {
  protected codigo: number;
  protected nombre: string;
  protected pais: string;
  protected placa: string;
  protected propietarioId?: number;

  constructor(
    codigo: number,
    nombre: string,
    pais: string,
    placa: string,
    propietarioId?: number,
  ) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.pais = pais;
    this.placa = placa;
    this.propietarioId = propietarioId;
  }

  public getCodigo(): number {
    return this.codigo;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getPais(): string {
    return this.pais;
  }

  public getPlaca(): string {
    return this.placa;
  }

  public getPropietarioId(): number | undefined {
    return this.propietarioId;
  }

  public setPropietarioId(propietarioId: number | undefined): void {
    this.propietarioId = propietarioId;
  }

  public abstract getCostoMatricula(): number;
  public abstract getTipo(): TipoVehiculo;
}