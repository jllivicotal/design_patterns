# Sistema de Gestión de Activos Fijos con Patrón Factory

Este proyecto implementa el modelo de activos fijos especificado en el diagrama UML utilizando NestJS, Prisma ORM, SQLite, y el patrón Factory, junto con el patrón Builder para vehículos.

## Arquitectura por Patrones

### 📁 Estructura de Directorios
```
src/
├── patterns/
│   ├── builder/           # Patrón Builder - Vehículos
│   │   ├── models/
│   │   ├── builders/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── dtos/
│   │   └── controllers/
│   └── factory/           # Patrón Factory - Activos Fijos
│       ├── models/
│       ├── factories/
│       ├── repositories/
│       ├── services/
│       ├── dtos/
│       └── controllers/
├── app.module.ts
└── main.ts
```

## 🏭 Patrón Factory - Activos Fijos

### Modelos de Dominio
- **IActivoFijo** (interfaz): Define el contrato común para todos los activos
- **ActivoFijoBase** (clase abstracta): Implementación base con propiedades comunes
- **Computador**: Activo con CPU y RAM
- **Mesa**: Activo con material específico
- **AutoAF**: Activo fijo vehicular con placa
- **Silla**: Activo con propiedad ergonómica
- **OpcionesActivo**: Clase para opciones agrupadas (vida útil, marca, modelo, etc.)

### Factory Implementation
La implementación del Factory Pattern permite crear diferentes tipos de activos de manera centralizada:

```typescript
const factory = new ActivoFijoFactorySimple();

const computador = factory.crear({
  codigo: 1,
  nombre: "MacBook Pro",
  precio: 2500000,
  tipo: TipoActivo.COMPUTADOR,
  cpu: "M3 Pro",
  ramGB: 16,
  opciones: {
    marca: "Apple",
    modelo: "MacBook Pro 14",
    vidaUtilMeses: 60
  }
});
```

### Cálculo de Valor Actual
Cada tipo de activo implementa su propia lógica de depreciación:

- **Computador**: 20% anual + factor por RAM
- **Mesa**: 10% anual + factor por material (madera noble conserva más valor)
- **AutoAF**: 15% anual + factor por marca premium
- **Silla**: 12% anual + factor ergonómico (+30% si es ergonómica)
- **Otros**: 10% anual estándar

## 📊 Base de Datos

### Esquema Prisma Actualizado
```prisma
// Modelo del patrón Factory - Activos Fijos
model ActivoFijo {
  codigo    Int         @id @default(autoincrement())
  nombre    String
  precio    Float
  tipo      TipoActivo
  
  // Opciones agrupadas
  vidaUtilMeses     Int?
  marca             String?
  modelo            String?
  serie             String?
  color             String?
  dimensiones       String?
  material          String?
  placaVehiculo     String?
  
  // Campos específicos para Computador
  cpu               String?
  ramGB             Int?
  
  // Campos específicos para Mesa
  materialMesa      String?
  
  // Campos específicos para AutoAF
  placa             String?
  
  // Campos específicos para Silla
  ergonomica        Boolean?
}

enum TipoActivo {
  COMPUTADOR
  MESA
  AUTO
  SILLA
  OTRO
}
```

## 🌐 API Endpoints - Activos Fijos

### Crear Activo (Computador)
```
POST /api/activos
Content-Type: application/json

{
  "codigo": 1,
  "nombre": "MacBook Pro",
  "precio": 2500000,
  "tipo": "COMPUTADOR",
  "cpu": "M3 Pro",
  "ramGB": 16,
  "opciones": {
    "marca": "Apple",
    "modelo": "MacBook Pro 14",
    "vidaUtilMeses": 24,
    "color": "Gris Espacial"
  }
}
```

### Crear Activo (Mesa)
```
POST /api/activos
Content-Type: application/json

{
  "codigo": 2,
  "nombre": "Mesa Ejecutiva",
  "precio": 800000,
  "tipo": "MESA",
  "material": "Roble",
  "opciones": {
    "marca": "Steelcase",
    "dimensiones": "180x90x75 cm",
    "color": "Madera Natural"
  }
}
```

### Crear Activo (Auto)
```
POST /api/activos
Content-Type: application/json

{
  "codigo": 3,
  "nombre": "Toyota Camry",
  "precio": 120000000,
  "tipo": "AUTO",
  "placa": "ABC-123",
  "opciones": {
    "marca": "Toyota",
    "modelo": "Camry Hybrid",
    "serie": "2024",
    "color": "Blanco Perla"
  }
}
```

### Crear Activo (Silla)
```
POST /api/activos
Content-Type: application/json

{
  "codigo": 4,
  "nombre": "Silla Ergonómica",
  "precio": 450000,
  "tipo": "SILLA",
  "ergonomica": true,
  "opciones": {
    "marca": "Herman Miller",
    "modelo": "Aeron",
    "color": "Negro"
  }
}
```

### Respuesta de la API
```json
{
  "codigo": 1,
  "nombre": "MacBook Pro",
  "precio": 2500000,
  "tipo": "COMPUTADOR",
  "valorActual": 2080000,
  "opciones": {
    "marca": "Apple",
    "modelo": "MacBook Pro 14",
    "vidaUtilMeses": 24,
    "color": "Gris Espacial"
  },
  "cpu": "M3 Pro",
  "ramGB": 16
}
```

### Otros Endpoints
```
GET /api/activos           # Listar todos los activos
GET /api/activos/{codigo}  # Obtener activo por código
PUT /api/activos/{codigo}  # Actualizar activo
DELETE /api/activos/{codigo} # Eliminar activo
```

## 🏗️ Patrón Builder - Vehículos (Existente)

Los endpoints de vehículos siguen disponibles en `/api/vehiculos` con la implementación del patrón Builder.

## 🔧 Configuración y Ejecución

### Migración de Base de Datos
```bash
# Ejecutar migraciones (ya incluye ambos modelos)
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate

# Ver datos en Prisma Studio
npx prisma studio
```

### Ejecutar Aplicación
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 🎯 Ventajas del Patrón Factory

1. **Centralización**: Toda la lógica de creación está en un lugar
2. **Extensibilidad**: Fácil agregar nuevos tipos de activos
3. **Consistencia**: Garantiza que los objetos se crean correctamente
4. **Encapsulación**: Oculta la complejidad de la construcción
5. **Polimorfismo**: Diferentes implementaciones detrás de la misma interfaz

## 🧪 Ejemplos de Uso

### Factory vs Builder
- **Factory**: Ideal cuando conoces el tipo exacto y tienes todos los datos
- **Builder**: Ideal para construcción paso a paso o configuraciones complejas

### Casos de Uso del Factory
```typescript
// El factory determina qué clase instanciar basado en el tipo
const factory = new ActivoFijoFactorySimple();

// Automáticamente crea un Computador
const laptop = factory.crear({
  tipo: TipoActivo.COMPUTADOR,
  // ... otros datos
});

// Automáticamente crea una Mesa
const escritorio = factory.crear({
  tipo: TipoActivo.MESA,
  // ... otros datos
});
```

## 🚀 Tecnologías Utilizadas

- **NestJS**: Framework de Node.js
- **Prisma**: ORM moderno
- **SQLite**: Base de datos
- **TypeScript**: Tipado estático
- **class-validator**: Validación
- **class-transformer**: Transformación

## 📁 Ambos Patrones Disponibles

La aplicación ahora soporta ambos patrones de diseño:

1. **Builder Pattern** (`/api/vehiculos`): Para construcción flexible de vehículos
2. **Factory Pattern** (`/api/activos`): Para creación centralizada de activos fijos

Cada patrón está organizado en su propia estructura de directorios y maneja su propio dominio de datos.