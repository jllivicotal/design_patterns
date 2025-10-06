# Ejemplos de Uso del Patrón Memento

## Escenario 1: Flujo Completo de Solicitud

### 1. Crear una nueva solicitud
```bash
curl -X POST http://localhost:3000/memento/solicitud \
  -H "Content-Type: application/json" \
  -d '{
    "datosAlumno": {
      "nombre": "María",
      "apellido": "García",
      "matricula": "2021001",
      "carrera": "Ingeniería de Software",
      "email": "maria.garcia@universidad.edu"
    },
    "tipoCertificado": "Certificado de Estudios",
    "observaciones": "Para trámite de beca internacional"
  }'
```

### 2. Ver estado actual
```bash
curl http://localhost:3000/memento/estado
```

### 3. Actualizar tipo de certificado
```bash
curl -X PUT http://localhost:3000/memento/solicitud \
  -H "Content-Type: application/json" \
  -d '{
    "tipoCertificado": "Certificado de Notas",
    "observaciones": "Cambio de trámite - necesito certificado de notas"
  }'
```

### 4. Agregar adjunto
```bash
curl -X POST http://localhost:3000/memento/adjunto \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "comprobante_pago.pdf",
    "tipo": "application/pdf",
    "url": "https://storage.example.com/comprobante.pdf",
    "tamanio": 204800
  }'
```

### 5. Ver historial
```bash
curl http://localhost:3000/memento/historial
```

Respuesta esperada:
```json
{
  "undoDisponibles": 3,
  "redoDisponibles": 0,
  "capacidadMaxima": 50,
  "historial": [
    {
      "etiqueta": "Estado inicial",
      "fecha": "2025-09-28T10:00:00.000Z",
      "version": 1
    },
    {
      "etiqueta": "Actualización de solicitud",
      "fecha": "2025-09-28T10:02:00.000Z",
      "version": 2
    },
    {
      "etiqueta": "Adjunto agregado: comprobante_pago.pdf",
      "fecha": "2025-09-28T10:03:00.000Z",
      "version": 3
    }
  ]
}
```

### 6. Generar certificado
```bash
curl -X POST http://localhost:3000/memento/generar
```

### 7. ¡Ups! Me equivoqué - Deshacer generación
```bash
curl -X POST http://localhost:3000/memento/undo
```

### 8. Verificar que volvió al estado anterior
```bash
curl http://localhost:3000/memento/estado
```

### 9. Rehacer (volver a generar)
```bash
curl -X POST http://localhost:3000/memento/redo
```

### 10. Crear snapshot manual antes de firmar
```bash
curl -X POST http://localhost:3000/memento/snapshot \
  -H "Content-Type: application/json" \
  -d '{
    "etiqueta": "Antes de firmar - revisión final"
  }'
```

### 11. Firmar certificado
```bash
curl -X POST http://localhost:3000/memento/firmar
```

### 12. Visualizar documento generado
```bash
curl http://localhost:3000/memento/visualizar
```

## Escenario 2: Múltiples Undo/Redo

```bash
# Crear solicitud inicial
curl -X POST http://localhost:3000/memento/solicitud -H "Content-Type: application/json" -d '{...}'

# Cambio 1
curl -X PUT http://localhost:3000/memento/solicitud -H "Content-Type: application/json" -d '{"observaciones": "Cambio 1"}'

# Cambio 2
curl -X PUT http://localhost:3000/memento/solicitud -H "Content-Type: application/json" -d '{"observaciones": "Cambio 2"}'

# Cambio 3
curl -X PUT http://localhost:3000/memento/solicitud -H "Content-Type: application/json" -d '{"observaciones": "Cambio 3"}'

# Ver historial (debe tener 4 estados)
curl http://localhost:3000/memento/historial

# Deshacer 2 veces (volver a Cambio 1)
curl -X POST http://localhost:3000/memento/undo
curl -X POST http://localhost:3000/memento/undo

# Verificar estado actual
curl http://localhost:3000/memento/estado

# Rehacer 1 vez (volver a Cambio 2)
curl -X POST http://localhost:3000/memento/redo

# Verificar estado actual
curl http://localhost:3000/memento/estado
```

## Escenario 3: Gestión de Capacidad

```bash
# Establecer capacidad máxima a 5 estados
curl -X PUT http://localhost:3000/memento/historial/capacidad/5

# Hacer 10 cambios
for i in {1..10}; do
  curl -X PUT http://localhost:3000/memento/solicitud \
    -H "Content-Type: application/json" \
    -d "{\"observaciones\": \"Cambio $i\"}"
done

# Ver historial (solo debe mostrar los últimos 5)
curl http://localhost:3000/memento/historial

# Intentar deshacer más de 5 veces (fallará)
for i in {1..6}; do
  curl -X POST http://localhost:3000/memento/undo
done
```

## Escenario 4: Workflow Completo con Errores

```bash
# 1. Crear solicitud
curl -X POST http://localhost:3000/memento/solicitud -H "Content-Type: application/json" -d '{...}'

# 2. Actualizar datos
curl -X PUT http://localhost:3000/memento/solicitud -H "Content-Type: application/json" -d '{...}'

# 3. Intentar firmar SIN generar (debe fallar)
curl -X POST http://localhost:3000/memento/firmar
# Error: "Debe generar el certificado antes de firmarlo"

# 4. Generar correctamente
curl -X POST http://localhost:3000/memento/generar

# 5. Snapshot manual
curl -X POST http://localhost:3000/memento/snapshot -H "Content-Type: application/json" -d '{"etiqueta": "Generado correctamente"}'

# 6. Firmar
curl -X POST http://localhost:3000/memento/firmar

# 7. Intentar firmar de nuevo (debe fallar)
curl -X POST http://localhost:3000/memento/firmar
# Error: "El certificado ya ha sido firmado"

# 8. Deshacer firma
curl -X POST http://localhost:3000/memento/undo

# 9. Verificar que ya no está firmado
curl http://localhost:3000/memento/estado

# 10. Firmar nuevamente
curl -X POST http://localhost:3000/memento/firmar
```

## Escenario 5: Limpiar Historial

```bash
# Ver historial actual
curl http://localhost:3000/memento/historial

# Limpiar todo el historial
curl -X POST http://localhost:3000/memento/historial/limpiar

# Verificar que está vacío
curl http://localhost:3000/memento/historial

# Intentar deshacer (debe fallar)
curl -X POST http://localhost:3000/memento/undo
# Error: "No hay operaciones para deshacer"
```

## Escenario 6: Múltiples Adjuntos

```bash
# Crear solicitud
curl -X POST http://localhost:3000/memento/solicitud -H "Content-Type: application/json" -d '{...}'

# Agregar primer adjunto
curl -X POST http://localhost:3000/memento/adjunto \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "comprobante.pdf",
    "tipo": "application/pdf",
    "url": "https://storage.example.com/comprobante.pdf",
    "tamanio": 102400
  }'

# Agregar segundo adjunto
curl -X POST http://localhost:3000/memento/adjunto \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "foto_cedula.jpg",
    "tipo": "image/jpeg",
    "url": "https://storage.example.com/cedula.jpg",
    "tamanio": 524288
  }'

# Agregar tercer adjunto
curl -X POST http://localhost:3000/memento/adjunto \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "formulario.xlsx",
    "tipo": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "url": "https://storage.example.com/formulario.xlsx",
    "tamanio": 204800
  }'

# Ver estado con todos los adjuntos
curl http://localhost:3000/memento/estado

# Deshacer último adjunto
curl -X POST http://localhost:3000/memento/undo

# Verificar que solo hay 2 adjuntos
curl http://localhost:3000/memento/estado
```

## Escenario 7: Navegación por Historial

```bash
# Crear solicitud base
curl -X POST http://localhost:3000/memento/solicitud -H "Content-Type: application/json" -d '{...}'

# Hacer 5 cambios con snapshots descriptivos
curl -X PUT http://localhost:3000/memento/solicitud -H "Content-Type: application/json" -d '{"observaciones": "Primera revisión"}'
curl -X POST http://localhost:3000/memento/snapshot -H "Content-Type: application/json" -d '{"etiqueta": "Revisión 1 completada"}'

curl -X PUT http://localhost:3000/memento/solicitud -H "Content-Type: application/json" -d '{"observaciones": "Segunda revisión"}'
curl -X POST http://localhost:3000/memento/snapshot -H "Content-Type: application/json" -d '{"etiqueta": "Revisión 2 completada"}'

curl -X POST http://localhost:3000/memento/generar
curl -X POST http://localhost:3000/memento/snapshot -H "Content-Type: application/json" -d '{"etiqueta": "Certificado generado"}'

curl -X POST http://localhost:3000/memento/firmar
curl -X POST http://localhost:3000/memento/snapshot -H "Content-Type: application/json" -d '{"etiqueta": "Certificado firmado"}'

# Ver todo el historial
curl http://localhost:3000/memento/historial

# Navegar hacia atrás
curl -X POST http://localhost:3000/memento/undo  # Volver antes de firmar
curl -X POST http://localhost:3000/memento/undo  # Volver antes de generar
curl -X POST http://localhost:3000/memento/undo  # Volver a revisión 2

# Ver estado actual
curl http://localhost:3000/memento/estado

# Navegar hacia adelante
curl -X POST http://localhost:3000/memento/redo  # Avanzar a generado
curl -X POST http://localhost:3000/memento/redo  # Avanzar a firmado

# Ver estado final
curl http://localhost:3000/memento/estado
```

## Notas Importantes

1. **Snapshots Automáticos**: Cada operación (crear, actualizar, agregar adjunto, generar, firmar) crea automáticamente un snapshot.

2. **Snapshots Manuales**: Puede crear snapshots adicionales con etiquetas personalizadas usando `/memento/snapshot`.

3. **Invalidación de Redo**: Cuando se hace un cambio después de un undo, la pila de redo se limpia automáticamente.

4. **Capacidad Limitada**: Por defecto, el historial mantiene hasta 50 estados. Esto es configurable.

5. **Inmutabilidad**: Los estados son inmutables, garantizando que los snapshots no se vean afectados por cambios posteriores.

6. **Etiquetas Descriptivas**: Cada snapshot tiene una etiqueta que describe qué cambió, facilitando la navegación del historial.
