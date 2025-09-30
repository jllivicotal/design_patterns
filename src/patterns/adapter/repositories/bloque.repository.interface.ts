import { Bloque } from '@prisma/client';

export type CreateBloqueData = Pick<Bloque, 'nombre' | 'tipoMedicion' | 'temperatura'> & Partial<Pick<Bloque, 'fechaRegistro'>>;
export type UpdateBloqueData = Partial<Pick<Bloque, 'nombre' | 'tipoMedicion' | 'temperatura' | 'fechaRegistro'>>;

export interface BloqueRepository {
  findAll(): Promise<Bloque[]>;
  findOne(id: number): Promise<Bloque | null>;
  findByNombre(nombre: string): Promise<Bloque | null>;
  create(data: CreateBloqueData): Promise<Bloque>;
  update(id: number, data: UpdateBloqueData): Promise<Bloque>;
  remove(id: number): Promise<Bloque>;
}