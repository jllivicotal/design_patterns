export enum TipoActivo {
  COMPUTADOR = 'COMPUTADOR',
  MESA = 'MESA',
  AUTO = 'AUTO',
  SILLA = 'SILLA',
  OTRO = 'OTRO',
}

export class OpcionesActivo {
  public vidaUtilMeses?: number;
  public marca?: string;
  public modelo?: string;
  public serie?: string;
  public color?: string;
  public dimensiones?: string;
  public material?: string;
  public placaVehiculo?: string;

  constructor(options?: Partial<OpcionesActivo>) {
    if (options) {
      this.vidaUtilMeses = options.vidaUtilMeses;
      this.marca = options.marca;
      this.modelo = options.modelo;
      this.serie = options.serie;
      this.color = options.color;
      this.dimensiones = options.dimensiones;
      this.material = options.material;
      this.placaVehiculo = options.placaVehiculo;
    }
  }
}

export interface IActivoFijo {
  getCodigo(): number;
  getNombre(): string;
  getPrecio(): number;
  getOpciones(): OpcionesActivo | undefined;
  valorActual(): number;
}