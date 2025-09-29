import { Controller, Get } from '@nestjs/common';

/**
 * Controlador principal del patrón Composite
 */
@Controller('composite')
export class CompositeController {
  
  @Get()
  getPatternInfo() {
    return {
      pattern: 'Composite',
      description: 'Sistema de archivos jerárquico que permite tratar archivos individuales y carpetas de manera uniforme',
      structure: {
        component: 'FileComponent - Interfaz común para archivos y carpetas',
        leaves: ['PdfFile', 'DocxFile', 'XlsxFile'],
        composite: 'Folder - Puede contener archivos y otras carpetas'
      },
      endpoints: {
        filesystem: '/filesystem - Gestión del sistema de archivos'
      }
    };
  }

  @Get('demo')
  getDemoInfo() {
    return {
      message: 'Patrón Composite implementado para sistema de archivos',
      usage: [
        'GET /filesystem - Ver estructura completa',
        'GET /filesystem/statistics - Ver estadísticas del sistema',
        'GET /filesystem/structure - Ver estructura como texto',
        'GET /filesystem/size - Ver tamaño total',
        'GET /filesystem/item/{path} - Ver elemento específico',
        'POST /filesystem/files - Crear nuevo archivo',
        'POST /filesystem/folders - Crear nueva carpeta'
      ],
      examples: {
        fileTypes: ['PDF', 'DOCX', 'XLSX'],
        features: [
          'Cálculo recursivo de tamaños',
          'Navegación jerárquica',
          'Operaciones uniformes en archivos y carpetas'
        ]
      }
    };
  }
}