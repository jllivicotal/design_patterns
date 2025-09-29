import { Module } from '@nestjs/common';
import { AdapterController } from './adapter.controller';
import { AdapterService } from './adapter.service';
import { TemperaturesController, BloquesController } from './controllers';
import { TemperatureService, BloqueService } from './services';
import { BloquePrismaRepository } from './repositories';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Módulo del patrón Adapter
 * Implementa un sistema de temperatura unificado
 */
@Module({
  controllers: [
    AdapterController,
    TemperaturesController,
    BloquesController
  ],
  providers: [
    AdapterService,
    TemperatureService,
    BloqueService,
    BloquePrismaRepository,
    PrismaService
  ],
  exports: [
    AdapterService,
    TemperatureService,
    BloqueService
  ]
})
export class AdapterModule {}