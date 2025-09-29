import { Module } from '@nestjs/common';
import { CompositeController, FileSystemController } from './controllers';
import { FileSystemService } from './services';

/**
 * Módulo del patrón Composite
 * Implementa un sistema de archivos jerárquico
 */
@Module({
  controllers: [
    CompositeController,
    FileSystemController
  ],
  providers: [
    FileSystemService
  ],
  exports: [
    FileSystemService
  ]
})
export class CompositeModule {}