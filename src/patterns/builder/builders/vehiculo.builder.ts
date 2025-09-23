import { Vehiculo, Auto, Camioneta, Camion, TipoVehiculo } from '../models';

export class VehiculoBuilder {
  private codigo: number;
  private nombre: string;
  private pais: string;
  private placa: string;
  private tipo: TipoVehiculo;
  private propietarioId?: number;

  // Propiedades específicas de Auto
  private numPuertas?: number;

  // Propiedades específicas de Camioneta
  private traccion?: string;

  // Propiedades específicas de Camion
  private capacidadTon?: number;

  constructor() {
    this.reset();
  }

  public reset(): VehiculoBuilder {
    this.codigo = 0;
    this.nombre = '';
    this.pais = '';
    this.placa = '';
    this.tipo = TipoVehiculo.AUTO;
    this.propietarioId = undefined;
    this.numPuertas = undefined;
    this.traccion = undefined;
    this.capacidadTon = undefined;
    return this;
  }

  public setCodigo(codigo: number): VehiculoBuilder {
    this.codigo = codigo;
    return this;
  }

  public setNombre(nombre: string): VehiculoBuilder {
    this.nombre = nombre;
    return this;
  }

  public setPais(pais: string): VehiculoBuilder {
    this.pais = pais;
    return this;
  }

  public setPlaca(placa: string): VehiculoBuilder {
    this.placa = placa;
    return this;
  }

  public setTipo(tipo: TipoVehiculo): VehiculoBuilder {
    this.tipo = tipo;
    return this;
  }

  public setPropietarioId(propietarioId: number): VehiculoBuilder {
    this.propietarioId = propietarioId;
    return this;
  }

  // Métodos específicos para Auto
  public setNumPuertas(numPuertas: number): VehiculoBuilder {
    this.numPuertas = numPuertas;
    return this;
  }

  // Métodos específicos para Camioneta
  public setTraccion(traccion: string): VehiculoBuilder {
    this.traccion = traccion;
    return this;
  }

  // Métodos específicos para Camion
  public setCapacidadTon(capacidadTon: number): VehiculoBuilder {
    this.capacidadTon = capacidadTon;
    return this;
  }

  public build(): Vehiculo {
    switch (this.tipo) {
      case TipoVehiculo.AUTO:
        if (this.numPuertas === undefined) {
          throw new Error('numPuertas es requerido para Auto');
        }
        return new Auto(
          this.codigo,
          this.nombre,
          this.pais,
          this.placa,
          this.numPuertas,
          this.propietarioId,
        );

      case TipoVehiculo.CAMIONETA:
        if (this.traccion === undefined) {
          throw new Error('traccion es requerida para Camioneta');
        }
        return new Camioneta(
          this.codigo,
          this.nombre,
          this.pais,
          this.placa,
          this.traccion,
          this.propietarioId,
        );

      case TipoVehiculo.CAMION:
        if (this.capacidadTon === undefined) {
          throw new Error('capacidadTon es requerida para Camion');
        }
        return new Camion(
          this.codigo,
          this.nombre,
          this.pais,
          this.placa,
          this.capacidadTon,
          this.propietarioId,
        );

      default:
        throw new Error(`Tipo de vehículo no soportado: ${this.tipo}`);
    }
  }

  // Factory methods para facilitar la creación
  public static crearAuto(): VehiculoBuilder {
    return new VehiculoBuilder().setTipo(TipoVehiculo.AUTO);
  }

  public static crearCamioneta(): VehiculoBuilder {
    return new VehiculoBuilder().setTipo(TipoVehiculo.CAMIONETA);
  }

  public static crearCamion(): VehiculoBuilder {
    return new VehiculoBuilder().setTipo(TipoVehiculo.CAMION);
  }
}