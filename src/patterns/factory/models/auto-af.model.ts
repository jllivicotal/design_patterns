import { ActivoFijoBase } from './activo-fijo.base';
import { OpcionesActivo } from './activo-fijo.interface';

export class AutoAF extends ActivoFijoBase {
  private placa: string;

  constructor(
    codigo: number,
    nombre: string,
    precio: number,
    placa: string,
    opciones?: OpcionesActivo,
  ) {
    super(codigo, nombre, precio, opciones);
    this.placa = placa;
  }

  public getPlaca(): string {
    return this.placa;
  }

  public setPlaca(placa: string): void {
    this.placa = placa;
  }

  public valorActual(): number {
    // Depreciación del 15% anual para autos
    const mesesTranscurridos = this.opciones?.vidaUtilMeses || 0;
    const depreciacionAnual = 0.15;
    const depreciacionMensual = depreciacionAnual / 12;
    const factorDepreciacion = Math.max(0, 1 - (mesesTranscurridos * depreciacionMensual));
    
    // Factor por marca (marcas premium conservan más valor)
    let factorMarca = 1.0;
    const marca = this.opciones?.marca?.toLowerCase() || '';
    if (marca.includes('toyota') || marca.includes('honda') || marca.includes('bmw')) {
      factorMarca = 1.15;
    } else if (marca.includes('mercedes') || marca.includes('audi') || marca.includes('lexus')) {
      factorMarca = 1.25;
    }
    
    return this.precio * factorDepreciacion * factorMarca;
  }
}