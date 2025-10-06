import { Module } from '@nestjs/common';
import { MementoController } from './controllers';
import { MementoService } from './memento.service';

/**
 * Módulo del patrón Memento
 * Implementa un sistema de solicitudes de certificado con Undo/Redo
 */
@Module({
  controllers: [MementoController],
  providers: [MementoService],
  exports: [MementoService],
})
export class MementoModule {}
