import { ActivoFijoBase } from './activo-fijo.base';
import { OpcionesActivo } from './activo-fijo.interface';

export class Silla extends ActivoFijoBase {
  private ergonomica: boolean;

  constructor(
    codigo: number,
    nombre: string,
    precio: number,
    ergonomica: boolean,
    opciones?: OpcionesActivo,
  ) {
    super(codigo, nombre, precio, opciones);
    this.ergonomica = ergonomica;
  }

  public isErgonomica(): boolean {
    return this.ergonomica;
  }

  public setErgonomica(ergonomica: boolean): void {
    this.ergonomica = ergonomica;
  }

  public valorActual(): number {
    // Depreciación del 12% anual para sillas
    const mesesTranscurridos = this.opciones?.vidaUtilMeses || 0;
    const depreciacionAnual = 0.12;
    const depreciacionMensual = depreciacionAnual / 12;
    const factorDepreciacion = Math.max(0, 1 - (mesesTranscurridos * depreciacionMensual));
    
    // Factor por ergonomía (sillas ergonómicas conservan más valor)
    const factorErgonomia = this.ergonomica ? 1.3 : 1.0;
    
    return this.precio * factorDepreciacion * factorErgonomia;
  }
}