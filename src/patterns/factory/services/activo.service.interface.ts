import { IActivoFijo } from '../models';
import { CrearActivoDto } from '../dtos';

export interface IActivoServicio {
  crear(dto: CrearActivoDto): Promise<IActivoFijo>;
  modificar(codigo: number, dto: CrearActivoDto): Promise<IActivoFijo>;
  eliminar(codigo: number): Promise<void>;
  listar(): Promise<IActivoFijo[]>;
}