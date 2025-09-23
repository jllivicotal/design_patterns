# Proyecto Design Patterns con NestJS y Prisma

Este proyecto implementa dos patrones de diseño fundamentales utilizando NestJS, Prisma ORM y SQLite:

## 🎯 Patrones Implementados

### 1. 🏗️ Builder Pattern - Sistema de Vehículos
**Ubicación**: `src/patterns/builder/`
**Endpoints**: `/api/vehiculos`

Permite la construcción fluida y paso a paso de diferentes tipos de vehículos (Auto, Camioneta, Camión) con validaciones específicas.

#### Características:
- Construcción flexible con VehiculoBuilder
- Herencia: Vehiculo abstract → Auto/Camioneta/Camion
- Cálculo de costo de matrícula diferenciado
- Relación con Propietario

### 2. 🏭 Factory Pattern - Sistema de Activos Fijos
**Ubicación**: `src/patterns/factory/`
**Endpoints**: `/api/activos`

Centraliza la creación de diferentes tipos de activos fijos (Computador, Mesa, Auto, Silla) basado en el tipo especificado.

#### Características:
- Creación centralizada con ActivoFijoFactory
- Polimorfismo: IActivoFijo → Computador/Mesa/AutoAF/Silla
- Cálculo de valor actual con depreciación diferenciada
- Opciones agrupadas flexibles

## 📊 Base de Datos

```sql
-- Patrón Builder: Vehículos
CREATE TABLE vehiculos (
  codigo INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  pais TEXT NOT NULL,
  placa TEXT UNIQUE NOT NULL,
  tipo TEXT NOT NULL, -- AUTO, CAMIONETA, CAMION
  propietarioId INTEGER,
  numPuertas INTEGER,     -- Para Auto
  traccion TEXT,          -- Para Camioneta
  capacidadTon REAL       -- Para Camion
);

-- Patrón Factory: Activos Fijos
CREATE TABLE activos_fijos (
  codigo INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio REAL NOT NULL,
  tipo TEXT NOT NULL, -- COMPUTADOR, MESA, AUTO, SILLA, OTRO
  -- Opciones agrupadas
  vidaUtilMeses INTEGER,
  marca TEXT,
  modelo TEXT,
  -- Campos específicos por tipo
  cpu TEXT,               -- Para Computador
  ramGB INTEGER,          -- Para Computador
  materialMesa TEXT,      -- Para Mesa
  placa TEXT,             -- Para AutoAF
  ergonomica BOOLEAN      -- Para Silla
);
```

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Configurar base de datos
npx prisma migrate dev
npx prisma generate

# Iniciar aplicación
npm run start:dev

# Ver datos (opcional)
npx prisma studio
```

## 📡 API Endpoints

### Builder Pattern - Vehículos

```bash
# Crear vehículo (método estándar)
POST /api/vehiculos
{
  "nombre": "Toyota Corolla",
  "pais": "Japón",
  "placa": "ABC-123",
  "tipo": "AUTO",
  "numPuertas": 4
}

# Crear vehículo (método del diagrama UML)
POST /api/vehiculos/crear/1/Toyota%20Corolla/Japón/ABC-123/AUTO/4

# Listar vehículos
GET /api/vehiculos

# Obtener vehículo
GET /api/vehiculos/1

# Actualizar vehículo
PUT /api/vehiculos/1

# Eliminar vehículo
DELETE /api/vehiculos/1
```

### Factory Pattern - Activos Fijos

```bash
# Crear computador
POST /api/activos
{
  "codigo": 1,
  "nombre": "MacBook Pro",
  "precio": 2500000,
  "tipo": "COMPUTADOR",
  "cpu": "M3 Pro",
  "ramGB": 16,
  "opciones": {
    "marca": "Apple",
    "vidaUtilMeses": 36
  }
}

# Crear mesa
POST /api/activos
{
  "codigo": 2,
  "nombre": "Mesa Ejecutiva",
  "precio": 800000,
  "tipo": "MESA",
  "material": "Roble"
}

# Listar activos
GET /api/activos

# Obtener activo
GET /api/activos/1

# Actualizar activo
PUT /api/activos/1

# Eliminar activo
DELETE /api/activos/1
```

## 🔍 Ejemplos de Respuestas

### Vehículo (Builder)
```json
{
  "codigo": 1,
  "nombre": "Toyota Corolla",
  "pais": "Japón",
  "placa": "ABC-123",
  "tipo": "AUTO",
  "costoMatricula": 140,
  "numPuertas": 4
}
```

### Activo Fijo (Factory)
```json
{
  "codigo": 1,
  "nombre": "MacBook Pro",
  "precio": 2500000,
  "tipo": "COMPUTADOR",
  "valorActual": 2080000,
  "cpu": "M3 Pro",
  "ramGB": 16,
  "opciones": {
    "marca": "Apple",
    "vidaUtilMeses": 24
  }
}
```

## 🎯 Diferencias Clave Entre Patrones

| Aspecto | Builder Pattern | Factory Pattern |
|---------|----------------|-----------------|
| **Propósito** | Construcción paso a paso | Creación centralizada |
| **Uso** | Objetos complejos con muchas opciones | Familia de objetos relacionados |
| **Flexibilidad** | Alta - construcción fluida | Media - basada en tipo |
| **Complejidad** | Mayor setup inicial | Implementación más simple |
| **Caso ideal** | Configuraciones variables | Tipos predefinidos |

## 🏗️ Arquitectura

```
src/
├── patterns/
│   ├── builder/              # Patrón Builder
│   │   ├── models/           # Vehiculo, Auto, Camioneta, Camion
│   │   ├── builders/         # VehiculoBuilder
│   │   ├── repositories/     # VehiculoRepositorioPrisma
│   │   ├── services/         # VehiculoServicio
│   │   ├── dtos/            # DTOs para API
│   │   └── controllers/      # VehiculoController
│   └── factory/              # Patrón Factory
│       ├── models/           # IActivoFijo, Computador, Mesa, etc.
│       ├── factories/        # ActivoFijoFactorySimple
│       ├── repositories/     # ActivoRepositorioPrisma
│       ├── services/         # ActivoServicio
│       ├── dtos/            # DTOs para API
│       └── controllers/      # ActivoController
├── app.module.ts            # Configuración de dependencias
└── main.ts                  # Punto de entrada
```

## 🛠️ Tecnologías

- **NestJS**: Framework de Node.js para APIs REST
- **Prisma**: ORM moderno con generación de tipos
- **SQLite**: Base de datos ligera
- **TypeScript**: Lenguaje con tipado estático
- **class-validator**: Validación declarativa
- **class-transformer**: Transformación de objetos

## 📚 Documentación Adicional

- [VEHICULOS_README.md](./VEHICULOS_README.md) - Documentación detallada del patrón Builder
- [FACTORY_README.md](./FACTORY_README.md) - Documentación detallada del patrón Factory

## ✅ Estado del Proyecto

- ✅ Patrón Builder implementado y funcional
- ✅ Patrón Factory implementado y funcional
- ✅ Base de datos configurada con ambos modelos
- ✅ APIs REST completas para ambos patrones
- ✅ Validaciones y transformaciones configuradas
- ✅ Documentación completa
- ✅ Aplicación compilando sin errores

La aplicación está lista para uso en desarrollo con ambos patrones de diseño funcionando de manera independiente y complementaria.