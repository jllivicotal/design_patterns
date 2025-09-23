export class Propietario {
  private codigo: number;
  private nombre: string;

  constructor(codigo: number, nombre: string) {
    this.codigo = codigo;
    this.nombre = nombre;
  }

  public getCodigo(): number {
    return this.codigo;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public setCodigo(codigo: number): void {
    this.codigo = codigo;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }
}