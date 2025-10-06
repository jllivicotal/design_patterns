/**
 * Value Object: Datos del alumno
 */
export class DatosAlumno {
  constructor(
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly matricula: string,
    public readonly carrera: string,
    public readonly email: string,
  ) {}

  toString(): string {
    return `${this.nombre} ${this.apellido} (${this.matricula})`;
  }

  equals(other: DatosAlumno): boolean {
    return (
      this.nombre === other.nombre &&
      this.apellido === other.apellido &&
      this.matricula === other.matricula &&
      this.carrera === other.carrera &&
      this.email === other.email
    );
  }
}
