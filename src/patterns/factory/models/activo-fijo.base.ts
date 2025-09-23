import { IActivoFijo, OpcionesActivo } from './activo-fijo.interface';

export abstract class ActivoFijoBase implements IActivoFijo {
  protected codigo: number;
  protected nombre: string;
  protected precio: number;
  protected opciones?: OpcionesActivo;

  constructor(
    codigo: number,
    nombre: string,
    precio: number,
    opciones?: OpcionesActivo,
  ) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.precio = precio;
    this.opciones = opciones;
  }

  public getCodigo(): number {
    return this.codigo;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getPrecio(): number {
    return this.precio;
  }

  public getOpciones(): OpcionesActivo | undefined {
    return this.opciones;
  }

  public setCodigo(codigo: number): void {
    this.codigo = codigo;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public setPrecio(precio: number): void {
    this.precio = precio;
  }

  public setOpciones(opciones: OpcionesActivo | undefined): void {
    this.opciones = opciones;
  }

  public abstract valorActual(): number;
}