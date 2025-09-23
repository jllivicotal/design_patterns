import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { IActivoServicio } from '../services';
import { CrearActivoDto, ActivoResponseDto } from '../dtos';
import { IActivoFijo, Computador, Mesa, AutoAF, Silla, TipoActivo } from '../models';

@Controller('activos')
export class ActivoController {
  constructor(
    @Inject('IActivoServicio')
    private readonly activoServicio: IActivoServicio,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() crearActivoDto: CrearActivoDto): Promise<ActivoResponseDto> {
    const activo = await this.activoServicio.crear(crearActivoDto);
    return this.activoToResponseDto(activo);
  }

  @Get()
  async listar(): Promise<ActivoResponseDto[]> {
    const activos = await this.activoServicio.listar();
    return activos.map(activo => this.activoToResponseDto(activo));
  }

  @Get(':codigo')
  async buscarPorId(@Param('codigo', ParseIntPipe) codigo: number): Promise<ActivoResponseDto> {
    const activos = await this.activoServicio.listar();
    const activo = activos.find(a => a.getCodigo() === codigo);
    
    if (!activo) {
      throw new NotFoundException(`Activo con código ${codigo} no encontrado`);
    }
    
    return this.activoToResponseDto(activo);
  }

  @Put(':codigo')
  async modificar(
    @Param('codigo', ParseIntPipe) codigo: number,
    @Body() crearActivoDto: CrearActivoDto,
  ): Promise<ActivoResponseDto> {
    const activo = await this.activoServicio.modificar(codigo, crearActivoDto);
    return this.activoToResponseDto(activo);
  }

  @Delete(':codigo')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('codigo', ParseIntPipe) codigo: number): Promise<void> {
    await this.activoServicio.eliminar(codigo);
  }

  private activoToResponseDto(activo: IActivoFijo): ActivoResponseDto {
    const baseResponse = {
      codigo: activo.getCodigo(),
      nombre: activo.getNombre(),
      precio: activo.getPrecio(),
      tipo: this.getTipoFromActivo(activo),
      valorActual: activo.valorActual(),
      opciones: activo.getOpciones(),
    };

    if (activo instanceof Computador) {
      return {
        ...baseResponse,
        cpu: activo.getCpu(),
        ramGB: activo.getRamGB(),
      };
    } else if (activo instanceof Mesa) {
      return {
        ...baseResponse,
        material: activo.getMaterial(),
      };
    } else if (activo instanceof AutoAF) {
      return {
        ...baseResponse,
        placa: activo.getPlaca(),
      };
    } else if (activo instanceof Silla) {
      return {
        ...baseResponse,
        ergonomica: activo.isErgonomica(),
      };
    }

    return baseResponse;
  }

  private getTipoFromActivo(activo: IActivoFijo): TipoActivo {
    if (activo instanceof Computador) return TipoActivo.COMPUTADOR;
    if (activo instanceof Mesa) return TipoActivo.MESA;
    if (activo instanceof AutoAF) return TipoActivo.AUTO;
    if (activo instanceof Silla) return TipoActivo.SILLA;
    return TipoActivo.OTRO;
  }
}