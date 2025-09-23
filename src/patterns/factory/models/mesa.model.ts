import { ActivoFijoBase } from './activo-fijo.base';
import { OpcionesActivo } from './activo-fijo.interface';

export class Mesa extends ActivoFijoBase {
  private material: string;

  constructor(
    codigo: number,
    nombre: string,
    precio: number,
    material: string,
    opciones?: OpcionesActivo,
  ) {
    super(codigo, nombre, precio, opciones);
    this.material = material;
  }

  public getMaterial(): string {
    return this.material;
  }

  public setMaterial(material: string): void {
    this.material = material;
  }

  public valorActual(): number {
    // Depreciación del 10% anual para mesas
    const mesesTranscurridos = this.opciones?.vidaUtilMeses || 0;
    const depreciacionAnual = 0.10;
    const depreciacionMensual = depreciacionAnual / 12;
    const factorDepreciacion = Math.max(0, 1 - (mesesTranscurridos * depreciacionMensual));
    
    // Factor por material (madera noble conserva más valor)
    let factorMaterial = 1.0;
    if (this.material.toLowerCase().includes('roble') || 
        this.material.toLowerCase().includes('caoba')) {
      factorMaterial = 1.2;
    } else if (this.material.toLowerCase().includes('metal')) {
      factorMaterial = 1.1;
    }
    
    return this.precio * factorDepreciacion * factorMaterial;
  }
}