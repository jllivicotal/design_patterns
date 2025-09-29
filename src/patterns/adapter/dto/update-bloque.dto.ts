import { PartialType } from '@nestjs/mapped-types';
import { CreateBloqueDto } from './create-bloque.dto';

/**
 * DTO para actualizar un bloque existente
 */
export class UpdateBloqueDto extends PartialType(CreateBloqueDto) {}