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
import { IVehiculoServicio } from '../services';
import {
  CrearVehiculoDto,
  ActualizarVehiculoDto,
  VehiculoResponseDto,
} from '../dtos';
import { VehiculoBuilder } from '../builders';
import { Vehiculo, Auto, Camioneta, Camion, TipoVehiculo } from '../models';

@Controller('vehiculos')
export class VehiculoController {
  constructor(
    @Inject('IVehiculoServicio')
    private readonly vehiculoServicio: IVehiculoServicio,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(
    @Body() crearVehiculoDto: CrearVehiculoDto,
  ): Promise<VehiculoResponseDto> {
    const vehiculo = this.dtoToVehiculo(crearVehiculoDto);
    const vehiculoCreado = await this.vehiculoServicio.crear(vehiculo);
    return this.vehiculoToResponseDto(vehiculoCreado);
  }

  @Get()
  async listar(): Promise<VehiculoResponseDto[]> {
    const vehiculos = await this.vehiculoServicio.listar();
    return vehiculos.map((vehiculo) => this.vehiculoToResponseDto(vehiculo));
  }

  @Get(':codigo')
  async buscarPorId(
    @Param('codigo', ParseIntPipe) codigo: number,
  ): Promise<VehiculoResponseDto> {
    const vehiculo = await this.vehiculoServicio.buscarPorId(codigo);
    if (!vehiculo) {
      throw new NotFoundException(
        `Vehículo con código ${codigo} no encontrado`,
      );
    }
    return this.vehiculoToResponseDto(vehiculo);
  }

  @Put(':codigo')
  async modificar(
    @Param('codigo', ParseIntPipe) codigo: number,
    @Body() actualizarVehiculoDto: ActualizarVehiculoDto,
  ): Promise<VehiculoResponseDto> {
    // Primero obtenemos el vehículo existente
    const vehiculoExistente = await this.vehiculoServicio.buscarPorId(codigo);
    if (!vehiculoExistente) {
      throw new NotFoundException(
        `Vehículo con código ${codigo} no encontrado`,
      );
    }

    // Creamos un nuevo vehículo con los datos actualizados
    const vehiculoActualizado = this.actualizarVehiculo(
      vehiculoExistente,
      actualizarVehiculoDto,
    );
    const resultado = await this.vehiculoServicio.modificar(
      codigo,
      vehiculoActualizado,
    );
    return this.vehiculoToResponseDto(resultado);
  }

  @Delete(':codigo')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('codigo', ParseIntPipe) codigo: number): Promise<void> {
    await this.vehiculoServicio.eliminar(codigo);
  }

  // Endpoint adicional para crear vehículos usando parámetros como en el diagrama UML
  @Post('crear/:codigo/:nombre/:pais/:placa/:tipo/:extra')
  @HttpCode(HttpStatus.CREATED)
  async crearConParametros(
    @Param('codigo', ParseIntPipe) codigo: number,
    @Param('nombre') nombre: string,
    @Param('pais') pais: string,
    @Param('placa') placa: string,
    @Param('tipo') tipo: string,
    @Param('extra') extra: string,
  ): Promise<VehiculoResponseDto> {
    const tipoVehiculo = this.stringToTipoVehiculo(tipo);
    const vehiculo = this.crearVehiculoConParametros(
      codigo,
      nombre,
      pais,
      placa,
      tipoVehiculo,
      extra,
    );
    const vehiculoCreado = await this.vehiculoServicio.crear(vehiculo);
    return this.vehiculoToResponseDto(vehiculoCreado);
  }

  private dtoToVehiculo(dto: CrearVehiculoDto): Vehiculo {
    const builder = new VehiculoBuilder()
      .setCodigo(0) // Se asignará automáticamente en la base de datos
      .setNombre(dto.nombre)
      .setPais(dto.pais)
      .setPlaca(dto.placa)
      .setTipo(dto.tipo);

    if (dto.propietarioId) {
      builder.setPropietarioId(dto.propietarioId);
    }

    switch (dto.tipo) {
      case TipoVehiculo.AUTO:
        if (!dto.numPuertas) {
          throw new Error('numPuertas es requerido para Auto');
        }
        builder.setNumPuertas(dto.numPuertas);
        break;

      case TipoVehiculo.CAMIONETA:
        if (!dto.traccion) {
          throw new Error('traccion es requerida para Camioneta');
        }
        builder.setTraccion(dto.traccion);
        break;

      case TipoVehiculo.CAMION:
        if (!dto.capacidadTon) {
          throw new Error('capacidadTon es requerida para Camion');
        }
        builder.setCapacidadTon(dto.capacidadTon);
        break;
    }

    return builder.build();
  }

  private actualizarVehiculo(
    vehiculoExistente: Vehiculo,
    dto: ActualizarVehiculoDto,
  ): Vehiculo {
    const builder = new VehiculoBuilder()
      .setCodigo(vehiculoExistente.getCodigo())
      .setNombre(dto.nombre ?? vehiculoExistente.getNombre())
      .setPais(dto.pais ?? vehiculoExistente.getPais())
      .setPlaca(dto.placa ?? vehiculoExistente.getPlaca())
      .setTipo(dto.tipo ?? vehiculoExistente.getTipo());

    const propietarioId =
      dto.propietarioId ?? vehiculoExistente.getPropietarioId();
    if (propietarioId) {
      builder.setPropietarioId(propietarioId);
    }

    const tipo = dto.tipo ?? vehiculoExistente.getTipo();

    switch (tipo) {
      case TipoVehiculo.AUTO:
        const numPuertas =
          dto.numPuertas ?? (vehiculoExistente as Auto).getNumPuertas();
        builder.setNumPuertas(numPuertas);
        break;

      case TipoVehiculo.CAMIONETA:
        const traccion =
          dto.traccion ?? (vehiculoExistente as Camioneta).getTraccion();
        builder.setTraccion(traccion);
        break;

      case TipoVehiculo.CAMION:
        const capacidadTon =
          dto.capacidadTon ?? (vehiculoExistente as Camion).getCapacidadTon();
        builder.setCapacidadTon(capacidadTon);
        break;
    }

    return builder.build();
  }

  private crearVehiculoConParametros(
    codigo: number,
    nombre: string,
    pais: string,
    placa: string,
    tipo: TipoVehiculo,
    extra: string,
  ): Vehiculo {
    const builder = new VehiculoBuilder()
      .setCodigo(codigo)
      .setNombre(nombre)
      .setPais(pais)
      .setPlaca(placa)
      .setTipo(tipo);

    switch (tipo) {
      case TipoVehiculo.AUTO:
        const numPuertas = parseInt(extra);
        if (isNaN(numPuertas)) {
          throw new Error(
            'Para Auto, el parámetro extra debe ser el número de puertas',
          );
        }
        builder.setNumPuertas(numPuertas);
        break;

      case TipoVehiculo.CAMIONETA:
        builder.setTraccion(extra);
        break;

      case TipoVehiculo.CAMION:
        const capacidadTon = parseFloat(extra);
        if (isNaN(capacidadTon)) {
          throw new Error(
            'Para Camion, el parámetro extra debe ser la capacidad en toneladas',
          );
        }
        builder.setCapacidadTon(capacidadTon);
        break;
    }

    return builder.build();
  }

  private stringToTipoVehiculo(tipo: string): TipoVehiculo {
    const tipoUpper = tipo.toUpperCase();
    if (Object.values(TipoVehiculo).includes(tipoUpper as TipoVehiculo)) {
      return tipoUpper as TipoVehiculo;
    }
    throw new Error(`Tipo de vehículo no válido: ${tipo}`);
  }

  private vehiculoToResponseDto(vehiculo: Vehiculo): VehiculoResponseDto {
    const baseResponse = {
      codigo: vehiculo.getCodigo(),
      nombre: vehiculo.getNombre(),
      pais: vehiculo.getPais(),
      placa: vehiculo.getPlaca(),
      tipo: vehiculo.getTipo(),
      propietarioId: vehiculo.getPropietarioId(),
      costoMatricula: vehiculo.getCostoMatricula(),
    };

    switch (vehiculo.getTipo()) {
      case TipoVehiculo.AUTO:
        const auto = vehiculo as Auto;
        return {
          ...baseResponse,
          numPuertas: auto.getNumPuertas(),
        };

      case TipoVehiculo.CAMIONETA:
        const camioneta = vehiculo as Camioneta;
        return {
          ...baseResponse,
          traccion: camioneta.getTraccion(),
        };

      case TipoVehiculo.CAMION:
        const camion = vehiculo as Camion;
        return {
          ...baseResponse,
          capacidadTon: camion.getCapacidadTon(),
        };

      default:
        return baseResponse;
    }
  }
}
