import { IActivoFijo } from '../models';

export interface IActivoRepositorio {
  crear(activo: IActivoFijo): Promise<IActivoFijo>;
  modificar(codigo: number, activo: IActivoFijo): Promise<IActivoFijo>;
  eliminar(codigo: number): Promise<void>;
  listar(): Promise<IActivoFijo[]>;
  buscarPorId(codigo: number): Promise<IActivoFijo | null>;
}