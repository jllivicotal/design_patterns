import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BloqueRepository, CreateBloqueData, UpdateBloqueData } from './bloque.repository.interface';

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

  async findByNombre(nombre: string) {
    return this.prisma.bloque.findUnique({
      where: { nombre }
    });
  }

  async create(data: CreateBloqueData) {
    return this.prisma.bloque.create({
      data
    });
  }

  async update(id: number, data: UpdateBloqueData) {
    return this.prisma.bloque.update({
      where: { id },
      data
    });
  }

  async remove(id: number) {
    return this.prisma.bloque.delete({
      where: { id }
    });
  }
}