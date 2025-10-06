# Patrón Memento - Sistema de Solicitudes de Certificado

## Descripción

Implementación del patrón de diseño **Memento** para un sistema de gestión de solicitudes de certificados académicos con funcionalidad completa de **Undo/Redo**.

## Problema Resuelto

En una institución educativa, los usuarios necesitan crear y modificar solicitudes de certificados. Durante este proceso, pueden cometer errores o querer revertir cambios. El patrón Memento permite:

- Guardar el estado completo de una solicitud en diferentes momentos
- Deshacer cambios sin perder información
- Rehacer cambios previamente deshechos
- Mantener un historial navegable de todos los estados

## Componentes del Patrón

### 1. **Memento** (Interfaz Angosta)
```typescript
interface Memento {
  getEtiqueta(): string;
  getFecha(): Date;
  getVersion(): number;
}
```
- Interfaz visible para el **Caretaker**
- Solo expone métodos de consulta
- No permite acceso al estado interno

### 2. **OriginatorMemento** (Interfaz Ancha)
```typescript
interface OriginatorMemento extends Memento {
  getEstado(): EstadoSolicitud;
}
```
- Interfaz visible solo para el **Originator**
- Permite acceso al estado interno completo

### 3. **SolicitudMemento** (Concrete Memento)
- Implementación concreta del memento
- Almacena el estado completo de una solicitud
- Incluye metadatos (etiqueta, fecha, versión)

### 4. **SolicitudCertificado** (Originator)
- Objeto cuyo estado queremos preservar
- Puede crear mementos de su estado actual
- Puede restaurar su estado desde un memento
- Operaciones: generar, firmar, actualizar datos

### 5. **HistorialSolicitudes** (Caretaker)
- Administra la colección de mementos
- Implementa pilas de Undo/Redo
- No conoce el contenido interno de los mementos
- Capacidad configurable

### 6. **Value Objects**
- **EstadoSolicitud**: Estado completo de la solicitud
- **DatosAlumno**: Información del estudiante
- **Adjunto**: Archivos adjuntos
- **Documento**: Documento generado

## Estructura del Proyecto

```
memento/
├── memento/
│   ├── memento.interface.ts          # Interfaz angosta
│   ├── originator-memento.interface.ts # Interfaz ancha
│   └── solicitud-memento.ts          # Concrete Memento
├── originator/
│   └── solicitud-certificado.ts      # Originator
├── caretaker/
│   └── historial-solicitudes.ts      # Caretaker
├── value-objects/
│   ├── estado-solicitud.ts           # Estado completo
│   ├── datos-alumno.ts               # VO de alumno
│   ├── adjunto.ts                    # VO de adjunto
│   └── documento.ts                  # VO de documento
├── controllers/
│   └── memento.controller.ts         # Endpoints REST
├── dto/
│   └── *.dto.ts                      # DTOs de validación
├── memento.service.ts                # Lógica de negocio
└── memento.module.ts                 # Módulo NestJS
```

## Endpoints API

### Gestión de Solicitudes

#### Crear solicitud
```http
POST /memento/solicitud
Content-Type: application/json

{
  "datosAlumno": {
    "nombre": "Juan",
    "apellido": "Pérez",
    "matricula": "2021001",
    "carrera": "Ingeniería de Software",
    "email": "juan.perez@universidad.edu"
  },
  "tipoCertificado": "Certificado de Estudios",
  "observaciones": "Certificado para trámite de beca",
  "adjuntos": []
}
```

#### Actualizar solicitud
```http
PUT /memento/solicitud
Content-Type: application/json

{
  "tipoCertificado": "Certificado de Notas",
  "observaciones": "Actualización del tipo de certificado"
}
```

#### Agregar adjunto
```http
POST /memento/adjunto
Content-Type: application/json

{
  "nombre": "comprobante.pdf",
  "tipo": "application/pdf",
  "url": "https://storage.example.com/comprobante.pdf",
  "tamanio": 102400
}
```

#### Generar certificado
```http
POST /memento/generar
```

#### Firmar certificado
```http
POST /memento/firmar
```

#### Visualizar documento
```http
GET /memento/visualizar
```

#### Obtener estado actual
```http
GET /memento/estado
```

### Funcionalidad Memento

#### Crear snapshot manual
```http
POST /memento/snapshot
Content-Type: application/json

{
  "etiqueta": "Antes de firmar el documento"
}
```

#### Deshacer (Undo)
```http
POST /memento/undo
```

#### Rehacer (Redo)
```http
POST /memento/redo
```

#### Listar historial
```http
GET /memento/historial
```

Respuesta:
```json
{
  "undoDisponibles": 5,
  "redoDisponibles": 2,
  "capacidadMaxima": 50,
  "historial": [
    {
      "etiqueta": "Estado inicial",
      "fecha": "2025-09-28T10:00:00Z",
      "version": 1
    },
    {
      "etiqueta": "Certificado generado",
      "fecha": "2025-09-28T10:05:00Z",
      "version": 2
    }
  ]
}
```

#### Limpiar historial
```http
POST /memento/historial/limpiar
```

#### Establecer capacidad máxima
```http
PUT /memento/historial/capacidad/100
```

#### Información del patrón
```http
GET /memento/info
```

## Flujo de Uso Típico

1. **Crear Solicitud**
   ```bash
   POST /memento/solicitud
   # Se crea automáticamente un snapshot "Estado inicial"
   ```

2. **Modificar Datos**
   ```bash
   PUT /memento/solicitud
   # Se crea automáticamente un snapshot "Actualización de solicitud"
   ```

3. **Agregar Adjuntos**
   ```bash
   POST /memento/adjunto
   # Snapshot: "Adjunto agregado: nombre.pdf"
   ```

4. **Generar Certificado**
   ```bash
   POST /memento/generar
   # Snapshot: "Certificado generado"
   ```

5. **Deshacer si es necesario**
   ```bash
   POST /memento/undo
   # Vuelve al estado anterior a generar
   ```

6. **Rehacer**
   ```bash
   POST /memento/redo
   # Vuelve al estado con certificado generado
   ```

7. **Firmar**
   ```bash
   POST /memento/firmar
   # Snapshot: "Certificado firmado"
   ```

## Características Clave

### ✅ Encapsulamiento
- El estado interno solo es accesible a través de interfaces controladas
- El Caretaker no puede modificar ni inspeccionar el estado

### ✅ Undo/Redo Ilimitado
- Pilas separadas para deshacer y rehacer
- Capacidad configurable (por defecto 50 estados)
- Etiquetas descriptivas para cada snapshot

### ✅ Inmutabilidad
- Los value objects son inmutables
- Los mementos realizan copias profundas del estado
- No hay efectos secundarios

### ✅ Snapshots Automáticos
- Cada operación crea automáticamente un snapshot
- Etiquetas generadas automáticamente
- Opción de crear snapshots manuales con etiquetas personalizadas

### ✅ Metadatos
- Fecha de creación de cada memento
- Versión del estado
- Etiqueta descriptiva

## Ventajas de la Implementación

1. **Dos Interfaces (Narrow/Wide)**
   - Interfaz angosta: acceso limitado para el Caretaker
   - Interfaz ancha: acceso completo para el Originator

2. **Value Objects**
   - Estado representado como objetos inmutables
   - Facilita copias profundas
   - Previene inconsistencias

3. **Capacidad Limitada**
   - Previene uso excesivo de memoria
   - Configurable según necesidades
   - Elimina automáticamente estados antiguos

4. **Etiquetas Descriptivas**
   - Facilita navegación del historial
   - Mejora la experiencia del usuario
   - Auditoría clara de cambios

## Ejemplo de Uso en Código

```typescript
// Crear solicitud
const solicitud = new SolicitudCertificado(
  datosAlumno,
  'Certificado de Estudios',
  'Para trámite de beca'
);

// Crear caretaker
const historial = new HistorialSolicitudes(solicitud);

// Guardar estado inicial
historial.snapshot('Estado inicial');

// Modificar
solicitud.actualizarObservaciones('Observaciones actualizadas');
historial.snapshot('Observaciones actualizadas');

// Generar
solicitud.generar();
historial.snapshot('Certificado generado');

// Deshacer
historial.undo(); // Vuelve a estado sin generar

// Rehacer
historial.redo(); // Vuelve a estado generado

// Listar historial
const mementos = historial.listar();
mementos.forEach(m => {
  console.log(`${m.getEtiqueta()} - v${m.getVersion()}`);
});
```

## Testing

Para probar el patrón:

```bash
# Iniciar servidor
npm run start:dev

# Crear solicitud
curl -X POST http://localhost:3000/memento/solicitud \
  -H "Content-Type: application/json" \
  -d '{...}'

# Generar certificado
curl -X POST http://localhost:3000/memento/generar

# Deshacer
curl -X POST http://localhost:3000/memento/undo

# Ver historial
curl http://localhost:3000/memento/historial
```

## Diagrama UML

El patrón implementado sigue el diagrama UML proporcionado con:
- Interfaz Memento (angosta)
- Interfaz OriginatorMemento (ancha)
- SolicitudMemento (concrete memento)
- SolicitudCertificado (originator)
- HistorialSolicitudes (caretaker)
- EstadoSolicitud y value objects

## Conclusión

Esta implementación del patrón Memento proporciona una solución robusta para:
- Gestión de estados complejos
- Funcionalidad de deshacer/rehacer
- Historial auditable de cambios
- Encapsulamiento del estado interno
- Navegación temporal en el estado de objetos
