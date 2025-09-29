import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BloqueService } from '../services';
import { CreateBloqueDto, UpdateBloqueDto } from '../dto';

/**
 * Controlador para el CRUD de bloques
 */
@Controller('bloques')
export class BloquesController {
  constructor(private readonly bloqueService: BloqueService) {}

  /**
   * POST /bloques
   * Crea un nuevo bloque
   */
  @Post()
  create(@Body() createBloqueDto: CreateBloqueDto) {
    return this.bloqueService.create(createBloqueDto);
  }

  /**
   * GET /bloques
   * Obtiene todos los bloques
   */
  @Get()
  findAll() {
    return this.bloqueService.findAll();
  }

  /**
   * GET /bloques/:id
   * Obtiene un bloque por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bloqueService.findOne(id);
  }

  /**
   * PATCH /bloques/:id
   * Actualiza un bloque existente
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBloqueDto: UpdateBloqueDto,
  ) {
    return this.bloqueService.update(id, updateBloqueDto);
  }

  /**
   * DELETE /bloques/:id
   * Elimina un bloque
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bloqueService.remove(id);
  }
}