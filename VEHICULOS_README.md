# Sistema de Gestión de Vehículos con NestJS y Prisma

Este proyecto implementa el modelo de vehículos especificado en el diagrama UML utilizando NestJS, Prisma ORM, SQLite, y el patrón Builder.

## Arquitectura Implementada

### 📋 Modelos de Domini
- **Vehiculo** (clase abstracta): Clase base con propiedades comunes
- **Auto**: Extiende Vehiculo, tiene `numPuertas`
- **Camioneta**: Extiende Vehiculo, tiene `traccion` (4x2 | 4x4)
- **Camion**: Extiende Vehiculo, tiene `capacidadTon`
- **Propietario**: Entidad independiente que puede poseer múltiples vehículos

### 🏗️ Patrón Builder
Implementado en `VehiculoBuilder` para construir diferentes tipos de vehículos de manera fluida:

```typescript
const auto = VehiculoBuilder.crearAuto()
  .setCodigo(1)
  .setNombre("Toyota Corolla")
  .setPais("Japón")
  .setPlaca("ABC-123")
  .setNumPuertas(4)
  .build();
```

### 🗃️ Capa de Repositorio
- **IVehiculoRepositorio**: Interfaz que define las operaciones CRUD
- **VehiculoRepositorioPrisma**: Implementación concreta usando Prisma ORM

### 🔧 Capa de Servicio
- **IVehiculoServicio**: Interfaz de la lógica de negocio
- **VehiculoServicio**: Implementación con validaciones de negocio

### 🌐 Capa de Controlador
- **VehiculoController**: Endpoints REST para operaciones CRUD

## Base de Datos

### Esquema Prisma
```prisma
model Propietario {
  codigo    Int       @id @default(autoincrement())
  nombre    String
  vehiculos Vehiculo[]
}

model Vehiculo {
  codigo           Int          @id @default(autoincrement())
  nombre           String
  pais             String
  placa            String       @unique
  tipo             TipoVehiculo
  propietarioId    Int?
  propietario      Propietario? @relation(fields: [propietarioId], references: [codigo])
  
  // Campos específicos por tipo
  numPuertas       Int?     // Para Auto
  traccion         String?  // Para Camioneta
  capacidadTon     Float?   // Para Camion
}

enum TipoVehiculo {
  AUTO
  CAMIONETA
  CAMION
}
```

## API Endpoints

### Operaciones CRUD Estándar

#### Crear Vehículo
```
POST /api/vehiculos
Content-Type: application/json

{
  "nombre": "Toyota Corolla",
  "pais": "Japón",
  "placa": "ABC-123",
  "tipo": "AUTO",
  "numPuertas": 4,
  "propietarioId": 1
}
```

#### Listar Vehículos
```
GET /api/vehiculos
```

#### Obtener Vehículo por ID
```
GET /api/vehiculos/1
```

#### Actualizar Vehículo
```
PUT /api/vehiculos/1
Content-Type: application/json

{
  "nombre": "Toyota Corolla 2024",
  "numPuertas": 4
}
```

#### Eliminar Vehículo
```
DELETE /api/vehiculos/1
```

### Endpoint Especializado del Diagrama UML
```
POST /api/vehiculos/crear/{codigo}/{nombre}/{pais}/{placa}/{tipo}/{extra}
```

Ejemplos:
- Auto: `POST /api/vehiculos/crear/1/Toyota%20Corolla/Japón/ABC-123/AUTO/4`
- Camioneta: `POST /api/vehiculos/crear/2/Ford%20Ranger/USA/XYZ-456/CAMIONETA/4x4`
- Camión: `POST /api/vehiculos/crear/3/Volvo%20FH/Suecia/DEF-789/CAMION/25.5`

## Respuestas de la API

### Ejemplo de Respuesta de Vehículo
```json
{
  "codigo": 1,
  "nombre": "Toyota Corolla",
  "pais": "Japón",
  "placa": "ABC-123",
  "tipo": "AUTO",
  "propietarioId": 1,
  "costoMatricula": 140,
  "numPuertas": 4
}
```

## Cálculo de Costo de Matrícula

Cada tipo de vehículo implementa su propia lógica:

- **Auto**: $100 base + $20 por cada puerta adicional después de 2
- **Camioneta**: $150 base + $50 extra si es 4x4
- **Camión**: $200 base + $30 por tonelada de capacidad

## Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- npm

### Instalación
```bash
# Instalar dependencias
npm install

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar en modo desarrollo
npm run start:dev
```

### Base de Datos
El proyecto usa SQLite como base de datos, el archivo se encuentra en `prisma/data/app.db`.

Para visualizar los datos:
```bash
npx prisma studio
```

## Estructura del Proyecto

```
src/
├── builders/           # Patrón Builder para construcción de vehículos
├── controllers/        # Controladores REST
├── dtos/              # Data Transfer Objects
├── models/            # Modelos de dominio
├── repositories/      # Capa de acceso a datos
├── services/          # Lógica de negocio
├── app.module.ts      # Módulo principal
└── main.ts           # Punto de entrada

prisma/
├── schema.prisma      # Esquema de base de datos
└── data/
    └── app.db        # Base de datos SQLite
```

## Patrones de Diseño Implementados

1. **Builder Pattern**: Para la construcción fluida de objetos complejos
2. **Repository Pattern**: Abstracción de la capa de acceso a datos
3. **Service Layer Pattern**: Encapsulación de la lógica de negocio
4. **Dependency Injection**: Inversión de control para bajo acoplamiento
5. **Strategy Pattern**: Diferentes implementaciones de costo de matrícula

## Validaciones Implementadas

- Validación de datos de entrada usando `class-validator`
- Transformación automática de tipos con `class-transformer`
- Validación de placa única
- Validación de campos requeridos según tipo de vehículo
- Validación de existencia de vehículo en operaciones de actualización/eliminación

## Tecnologías Utilizadas

- **NestJS**: Framework de Node.js para aplicaciones escalables
- **Prisma**: ORM moderno para TypeScript
- **SQLite**: Base de datos ligera
- **class-validator**: Validación basada en decoradores
- **class-transformer**: Transformación de objetos
- **TypeScript**: Tipado estático para JavaScript

La aplicación está lista para uso y cumple con todos los requisitos del diagrama UML especificado.