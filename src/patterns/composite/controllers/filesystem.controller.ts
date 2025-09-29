import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { FileSystemService } from '../services';
import {
  CreateFileDto,
  CreateFolderDto,
  AddToFolderDto,
} from '../dto';

/**
 * Controlador para el sistema de archivos usando el patrón Composite
 */
@Controller('filesystem')
export class FileSystemController {
  constructor(private readonly fileSystemService: FileSystemService) {}

  /**
   * GET /filesystem
   * Obtiene la estructura completa del sistema de archivos
   */
  @Get()
  getFileSystem() {
    return this.fileSystemService.getFileSystem();
  }

  /**
   * GET /filesystem/statistics
   * Obtiene estadísticas del sistema de archivos
   */
  @Get('statistics')
  getStatistics() {
    return this.fileSystemService.getStatistics();
  }

  /**
   * GET /filesystem/structure
   * Obtiene la estructura jerárquica como texto
   */
  @Get('structure')
  getStructure() {
    return {
      structure: this.fileSystemService.getStructure()
    };
  }

  /**
   * GET /filesystem/size
   * Obtiene el tamaño total del sistema de archivos
   */
  @Get('size')
  getTotalSize() {
    return {
      totalSize: this.fileSystemService.getTotalSize(),
      unit: 'bytes'
    };
  }

  /**
   * GET /filesystem/item/*
   * Obtiene información de un elemento específico por ruta
   */
  @Get('item/*items')
  getItemByPath(@Param('0') path: string) {
    const item = this.fileSystemService.getItemByPath(path);
    if (!item) {
      throw new NotFoundException(`Elemento no encontrado: ${path}`);
    }
    return item;
  }

  /**
   * POST /filesystem/files
   * Crea un nuevo archivo
   */
  @Post('files')
  createFile(@Body() createFileDto: CreateFileDto) {
    const file = this.fileSystemService.createFile(createFileDto);
    return {
      message: 'Archivo creado exitosamente',
      file: {
        name: file.getName(),
        size: file.getSize(),
        type: createFileDto.type
      }
    };
  }

  /**
   * POST /filesystem/folders
   * Crea una nueva carpeta
   */
  @Post('folders')
  createFolder(@Body() createFolderDto: CreateFolderDto) {
    const folder = this.fileSystemService.createFolder(createFolderDto);
    return {
      message: 'Carpeta creada exitosamente',
      folder: {
        name: folder.getName(),
        size: folder.getSize()
      }
    };
  }

  /**
   * POST /filesystem/add-to-folder
   * Agrega un elemento a una carpeta
   */
  @Post('add-to-folder')
  addToFolder(@Body() addToFolderDto: AddToFolderDto) {
    this.fileSystemService.addToFolder(addToFolderDto);
    return {
      message: `Elemento ${addToFolderDto.itemName} agregado a ${addToFolderDto.folderPath}`
    };
  }
}