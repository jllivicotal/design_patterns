import { ActivoFijoBase } from './activo-fijo.base';
import { OpcionesActivo } from './activo-fijo.interface';

export class Computador extends ActivoFijoBase {
  private cpu: string;
  private ramGB: number;

  constructor(
    codigo: number,
    nombre: string,
    precio: number,
    cpu: string,
    ramGB: number,
    opciones?: OpcionesActivo,
  ) {
    super(codigo, nombre, precio, opciones);
    this.cpu = cpu;
    this.ramGB = ramGB;
  }

  public getCpu(): string {
    return this.cpu;
  }

  public getRamGB(): number {
    return this.ramGB;
  }

  public setCpu(cpu: string): void {
    this.cpu = cpu;
  }

  public setRamGB(ramGB: number): void {
    this.ramGB = ramGB;
  }

  public valorActual(): number {
    // Depreciación del 20% anual para computadores
    const mesesTranscurridos = this.opciones?.vidaUtilMeses || 0;
    const depreciacionAnual = 0.20;
    const depreciacionMensual = depreciacionAnual / 12;
    const factorDepreciacion = Math.max(0, 1 - (mesesTranscurridos * depreciacionMensual));
    
    // Factor adicional por RAM (más RAM = menos depreciación)
    const factorRAM = 1 + (this.ramGB / 100);
    
    return this.precio * factorDepreciacion * factorRAM;
  }
}