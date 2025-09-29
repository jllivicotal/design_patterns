import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBloqueDto, UpdateBloqueDto } from '../dto';
import { BloqueRepository } from './bloque.repository.interface';

@Injectable()
export class BloquePrismaRepository implements BloqueRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.bloque.findMany({
      orderBy: { fechaRegistro: 'desc' }
    });
  }

  async findOne(id: number) {
    return this.prisma.bloque.findUnique({
      where: { id }
    });
  }

  async create(createBloqueDto: CreateBloqueDto) {
    return this.prisma.bloque.create({
      data: createBloqueDto
    });
  }

  async update(id: number, updateBloqueDto: UpdateBloqueDto) {
    return this.prisma.bloque.update({
      where: { id },
      data: updateBloqueDto
    });
  }

  async remove(id: number) {
    return this.prisma.bloque.delete({
      where: { id }
    });
  }
}