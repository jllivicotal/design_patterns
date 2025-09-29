import { CreateBloqueDto, UpdateBloqueDto } from '../dto';

export interface BloqueRepository {
  findAll(): Promise<any[]>;
  findOne(id: number): Promise<any>;
  create(createBloqueDto: CreateBloqueDto): Promise<any>;
  update(id: number, updateBloqueDto: UpdateBloqueDto): Promise<any>;
  remove(id: number): Promise<any>;
}