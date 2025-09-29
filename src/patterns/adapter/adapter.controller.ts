import { Controller, Get } from '@nestjs/common';

/**
 * Controlador principal del patrón Adapter
 * Proporciona información general sobre el patrón implementado
 */
@Controller('adapter')
export class AdapterController {

  @Get()
  getPatternInfo() {
    return {
      pattern: 'Adapter',
      description: 'Sistema de temperatura que utiliza el patrón Adapter para unificar sensores de diferentes tipos',
      endpoints: {
        temperatures: '/temperatures - Gestión de lecturas de temperatura',
        bloques: '/bloques - CRUD de bloques del edificio'
      },
      sensors: [
        {
          type: 'Celsius',
          description: 'Sensor que mide directamente en grados Celsius'
        },
        {
          type: 'Fahrenheit', 
          description: 'Sensor que mide en Fahrenheit, convertido a Celsius mediante adapter'
        }
      ]
    };
  }

  @Get('demo')
  getDemoInfo() {
    return {
      message: 'Patrón Adapter implementado para sistema de temperatura',
      usage: [
        'GET /temperatures - Ver todas las lecturas actuales',
        'GET /temperatures/:blockId - Ver lectura de un bloque específico',
        'GET /bloques - Ver todos los bloques registrados',
        'POST /bloques - Crear nuevo bloque',
        'PUT /bloques/:id - Actualizar bloque',
        'DELETE /bloques/:id - Eliminar bloque'
      ]
    };
  }
}
