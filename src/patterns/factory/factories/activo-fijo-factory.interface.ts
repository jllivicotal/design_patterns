import { IActivoFijo } from '../models';
import { CrearActivoDto } from '../dtos';

export interface IActivoFijoFactory {
  crear(dto: CrearActivoDto): IActivoFijo;
}