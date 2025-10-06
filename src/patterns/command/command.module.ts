import { Module } from '@nestjs/common';
import { CommandController } from './controllers/command.controller';
import { CommandService } from './command.service';

/**
 * Módulo del patrón Command
 * Editor de texto con comandos desacoplados
 */
@Module({
  controllers: [CommandController],
  providers: [CommandService],
  exports: [CommandService],
})
export class CommandModule {}
