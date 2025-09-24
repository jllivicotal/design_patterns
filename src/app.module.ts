import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Builder Pattern
import { VehiculoController } from './patterns/builder/controllers';
import { VehiculoServicio } from './patterns/builder/services';
import { VehiculoRepositorioPrisma } from './patterns/builder/repositories';
// Factory Pattern
import { ActivoController } from './patterns/factory/controllers';
import { ActivoServicio } from './patterns/factory/services';
import { ActivoRepositorioPrisma } from './patterns/factory/repositories';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
  ],
  controllers: [AppController, VehiculoController, ActivoController],
  providers: [
    AppService,
    { provide: 'IVehiculoRepositorio', useClass: VehiculoRepositorioPrisma },
    { provide: 'IVehiculoServicio', useClass: VehiculoServicio },
    { provide: 'IActivoRepositorio', useClass: ActivoRepositorioPrisma },
    { provide: 'IActivoServicio', useClass: ActivoServicio },
  ],
})
export class AppModule {}
