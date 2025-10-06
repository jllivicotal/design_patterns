/**
 * Receiver: Documento
 * Contiene la lógica real de edición de texto
 */
export class Documento {
  private texto: string;

  constructor(textoInicial: string = '') {
    this.texto = textoInicial;
  }

  /**
   * Inserta texto en una posición específica
   */
  insertar(pos: number, txt: string): void {
    if (pos < 0 || pos > this.texto.length) {
      throw new Error(`Posición inválida: ${pos}. El texto tiene ${this.texto.length} caracteres.`);
    }
    this.texto = this.texto.slice(0, pos) + txt + this.texto.slice(pos);
  }

  /**
   * Borra un rango de texto y retorna el texto borrado
   */
  borrar(desde: number, hasta: number): string {
    if (desde < 0 || hasta > this.texto.length || desde > hasta) {
      throw new Error(`Rango inválido: [${desde}, ${hasta}]. El texto tiene ${this.texto.length} caracteres.`);
    }
    const textoEliminado = this.texto.slice(desde, hasta);
    this.texto = this.texto.slice(0, desde) + this.texto.slice(hasta);
    return textoEliminado;
  }

  /**
   * Reemplaza un fragmento de texto y retorna el texto reemplazado
   */
  reemplazar(desde: number, len: number, nuevo: string): string {
    const hasta = desde + len;
    if (desde < 0 || hasta > this.texto.length) {
      throw new Error(`Rango inválido: [${desde}, ${hasta}]. El texto tiene ${this.texto.length} caracteres.`);
    }
    const textoAnterior = this.texto.slice(desde, hasta);
    this.texto = this.texto.slice(0, desde) + nuevo + this.texto.slice(hasta);
    return textoAnterior;
  }

  /**
   * Obtiene el texto completo del documento
   */
  getTexto(): string {
    return this.texto;
  }

  /**
   * Obtiene la longitud del texto
   */
  getLongitud(): number {
    return this.texto.length;
  }

  /**
   * Establece el texto completo (útil para restaurar estado)
   */
  setTexto(texto: string): void {
    this.texto = texto;
  }

  /**
   * Obtiene un fragmento del texto
   */
  getFragmento(desde: number, hasta: number): string {
    if (desde < 0 || hasta > this.texto.length || desde > hasta) {
      throw new Error(`Rango inválido: [${desde}, ${hasta}]. El texto tiene ${this.texto.length} caracteres.`);
    }
    return this.texto.slice(desde, hasta);
  }

  /**
   * Limpia todo el texto
   */
  limpiar(): string {
    const textoAnterior = this.texto;
    this.texto = '';
    return textoAnterior;
  }
}
