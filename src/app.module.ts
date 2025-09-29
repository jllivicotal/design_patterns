import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Builder Pattern - Vehículos
import { VehiculoController } from './patterns/builder/controllers';
import { VehiculoServicio } from './patterns/builder/services';
import { VehiculoRepositorioPrisma } from './patterns/builder/repositories';

// Factory Pattern - Activos Fijos
import { ActivoController } from './patterns/factory/controllers';
import { ActivoServicio } from './patterns/factory/services';
import { ActivoRepositorioPrisma } from './patterns/factory/repositories';
import { ActivoFijoFactorySimple } from './patterns/factory/factories';

// Adapter Pattern - Sistema de Temperatura
import { AdapterModule } from './patterns/adapter/adapter.module';

// Composite Pattern - Sistema de Archivos
import { CompositeModule } from './patterns/composite/composite.module';

@Module({
  imports: [AdapterModule, CompositeModule],
  controllers: [
    AppController, 
    VehiculoController,
    ActivoController,
  ],
  providers: [
    AppService,
    // Builder Pattern providers
    {
      provide: 'IVehiculoServicio',
      useClass: VehiculoServicio,
    },
    {
      provide: 'IVehiculoRepositorio',
      useClass: VehiculoRepositorioPrisma,
    },
    // Factory Pattern providers
    {
      provide: 'IActivoServicio',
      useClass: ActivoServicio,
    },
    {
      provide: 'IActivoRepositorio',
      useClass: ActivoRepositorioPrisma,
    },
    {
      provide: 'IActivoFijoFactory',
      useClass: ActivoFijoFactorySimple,
    },
  ],
})
export class AppModule {}
