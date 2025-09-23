import { Vehiculo } from '../models';

export interface IVehiculoServicio {
  crear(vehiculo: Vehiculo): Promise<Vehiculo>;
  modificar(codigo: number, vehiculo: Vehiculo): Promise<Vehiculo>;
  eliminar(codigo: number): Promise<void>;
  listar(): Promise<Vehiculo[]>;
  buscarPorId(codigo: number): Promise<Vehiculo | null>;
}