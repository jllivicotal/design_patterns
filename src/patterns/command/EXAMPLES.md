# Ejemplos de Uso - Patrón Command

## 📝 Escenarios Completos

### 1. Edición Básica con Undo/Redo

#### Paso 1: Insertar texto inicial
```bash
curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 0,
    "texto": "Hola mundo"
  }'
```

**Respuesta:**
```json
{
  "mensaje": "Texto insertado",
  "texto": "Hola mundo",
  "operacion": "insertar",
  "posicion": 0,
  "textoInsertado": "Hola mundo"
}
```

#### Paso 2: Ver el documento
```bash
curl http://localhost:3000/command/texto
```

**Respuesta:**
```json
{
  "texto": "Hola mundo",
  "longitud": 10
}
```

#### Paso 3: Insertar más texto
```bash
curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 10,
    "texto": ", ¿cómo estás?"
  }'
```

**Respuesta:**
```json
{
  "mensaje": "Texto insertado",
  "texto": "Hola mundo, ¿cómo estás?",
  "operacion": "insertar",
  "posicion": 10,
  "textoInsertado": ", ¿cómo estás?"
}
```

#### Paso 4: Deshacer la última operación
```bash
curl -X POST http://localhost:3000/command/undo
```

**Respuesta:**
```json
{
  "mensaje": "Operación deshecha",
  "texto": "Hola mundo",
  "operacionesPendientes": 1
}
```

#### Paso 5: Rehacer
```bash
curl -X POST http://localhost:3000/command/redo
```

**Respuesta:**
```json
{
  "mensaje": "Operación rehecha",
  "texto": "Hola mundo, ¿cómo estás?",
  "operacionesDisponibles": 0
}
```

---

### 2. Operaciones de Borrado y Reemplazo

#### Paso 1: Crear documento
```bash
curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 0,
    "texto": "El patrón Command es muy útil"
  }'
```

#### Paso 2: Borrar un rango
```bash
curl -X POST http://localhost:3000/command/borrar \
  -H "Content-Type: application/json" \
  -d '{
    "desde": 11,
    "hasta": 18
  }'
```

**Respuesta:**
```json
{
  "mensaje": "Rango borrado",
  "texto": "El patrón  es muy útil",
  "operacion": "borrar",
  "desde": 11,
  "hasta": 18,
  "textoBorrado": "Command"
}
```

#### Paso 3: Reemplazar texto
```bash
curl -X POST http://localhost:3000/command/reemplazar \
  -H "Content-Type: application/json" \
  -d '{
    "desde": 11,
    "len": 0,
    "nuevo": "Strategy"
  }'
```

**Respuesta:**
```json
{
  "mensaje": "Texto reemplazado",
  "texto": "El patrón Strategy es muy útil",
  "operacion": "reemplazar",
  "desde": 11,
  "longitud": 0,
  "textoReemplazado": "",
  "nuevoTexto": "Strategy"
}
```

#### Paso 4: Ver historial
```bash
curl http://localhost:3000/command/info
```

**Respuesta:**
```json
{
  "historial": {
    "comandosEjecutados": 3,
    "operacionesParaDeshacer": 3,
    "operacionesParaRehacer": 0,
    "macrosDisponibles": 0,
    "grabandoMacro": false
  },
  "documento": {
    "texto": "El patrón Strategy es muy útil",
    "longitud": 30
  }
}
```

---

### 3. Macros - Grabar y Ejecutar

#### Escenario: Crear un macro para firmar documentos

#### Paso 1: Iniciar grabación
```bash
curl -X POST http://localhost:3000/command/macro/grabar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "firma"
  }'
```

**Respuesta:**
```json
{
  "mensaje": "Iniciada grabación del macro 'firma'",
  "macroNombre": "firma",
  "estado": "grabando"
}
```

#### Paso 2: Ejecutar comandos (se graban automáticamente)
```bash
# Insertar salto de línea
curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 100,
    "texto": "\n\n"
  }'

# Insertar firma
curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 102,
    "texto": "---\nAtentamente,\nJuan Pérez"
  }'
```

#### Paso 3: Finalizar grabación
```bash
curl -X POST http://localhost:3000/command/macro/finalizar
```

**Respuesta:**
```json
{
  "mensaje": "Macro 'firma' guardado con 2 comandos",
  "macroNombre": "firma",
  "comandosGrabados": 2
}
```

#### Paso 4: Ejecutar el macro en otro documento
```bash
# Limpiar documento
curl -X POST http://localhost:3000/command/reiniciar

# Crear nuevo texto
curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 0,
    "texto": "Estimado cliente, su solicitud ha sido aprobada."
  }'

# Ejecutar el macro
curl -X POST http://localhost:3000/command/macro/ejecutar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "firma"
  }'
```

**Respuesta:**
```json
{
  "mensaje": "Macro 'firma' ejecutado (2 comandos)",
  "macroNombre": "firma",
  "comandosEjecutados": 2,
  "texto": "Estimado cliente, su solicitud ha sido aprobada.\n\n---\nAtentamente,\nJuan Pérez"
}
```

#### Paso 5: Listar todos los macros
```bash
curl http://localhost:3000/command/macro
```

**Respuesta:**
```json
{
  "macros": ["firma"],
  "total": 1
}
```

#### Paso 6: Eliminar un macro
```bash
curl -X DELETE http://localhost:3000/command/macro/firma
```

**Respuesta:**
```json
{
  "mensaje": "Macro 'firma' eliminado",
  "macroNombre": "firma"
}
```

---

### 4. Workflow Completo: Redacción de Carta

```bash
# 1. Reiniciar el editor
curl -X POST http://localhost:3000/command/reiniciar

# 2. Escribir el encabezado
curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 0,
    "texto": "Estimado Sr. García,"
  }'

# 3. Añadir salto de línea y cuerpo
curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 21,
    "texto": "\n\nLe escribo para informarle sobre el estado de su solicitud."
  }'

# 4. Ops! Corregir el nombre
curl -X POST http://localhost:3000/command/undo

curl -X POST http://localhost:3000/command/undo

curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 0,
    "texto": "Estimado Sr. López,"
  }'

# 5. Rehacer el cuerpo
curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 19,
    "texto": "\n\nLe escribo para informarle sobre el estado de su solicitud."
  }'

# 6. Agregar más contenido
curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 80,
    "texto": " Su pedido ha sido aprobado y será enviado en los próximos días."
  }'

# 7. Reemplazar una palabra
curl -X POST http://localhost:3000/command/reemplazar \
  -H "Content-Type: application/json" \
  -d '{
    "desde": 81,
    "len": 6,
    "nuevo": "trámite"
  }'

# 8. Ver el resultado final
curl http://localhost:3000/command/texto

# 9. Ver el log completo
curl http://localhost:3000/command/log
```

**Resultado esperado:**
```json
{
  "texto": "Estimado Sr. López,\n\nLe escribo para informarle sobre el estado de su trámite. Su pedido ha sido aprobado y será enviado en los próximos días.",
  "longitud": 145
}
```

---

### 5. Uso de Múltiples Macros

```bash
# Crear macro para saludo formal
curl -X POST http://localhost:3000/command/macro/grabar \
  -H "Content-Type: application/json" \
  -d '{"nombre": "saludo_formal"}'

curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 0,
    "texto": "Estimado/a cliente,\n\n"
  }'

curl -X POST http://localhost:3000/command/macro/finalizar

# Crear macro para despedida
curl -X POST http://localhost:3000/command/macro/grabar \
  -H "Content-Type: application/json" \
  -d '{"nombre": "despedida"}'

curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 1000,
    "texto": "\n\nAtentamente,\nDepartamento de Atención al Cliente"
  }'

curl -X POST http://localhost:3000/command/macro/finalizar

# Usar ambos macros en un nuevo documento
curl -X POST http://localhost:3000/command/reiniciar

curl -X POST http://localhost:3000/command/macro/ejecutar \
  -H "Content-Type: application/json" \
  -d '{"nombre": "saludo_formal"}'

curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 22,
    "texto": "Su paquete ha sido enviado."
  }'

curl -X POST http://localhost:3000/command/macro/ejecutar \
  -H "Content-Type: application/json" \
  -d '{"nombre": "despedida"}'

# Ver resultado
curl http://localhost:3000/command/texto
```

---

### 6. Testing de Límites

#### Probar undo cuando no hay comandos
```bash
curl -X POST http://localhost:3000/command/reiniciar

curl -X POST http://localhost:3000/command/undo
```

**Respuesta:**
```json
{
  "mensaje": "No hay operaciones para deshacer"
}
```

#### Probar redo cuando no hay comandos
```bash
curl -X POST http://localhost:3000/command/redo
```

**Respuesta:**
```json
{
  "mensaje": "No hay operaciones para rehacer"
}
```

#### Cancelar grabación de macro
```bash
curl -X POST http://localhost:3000/command/macro/grabar \
  -H "Content-Type: application/json" \
  -d '{"nombre": "test"}'

curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{"pos": 0, "texto": "test"}'

curl -X POST http://localhost:3000/command/macro/cancelar
```

**Respuesta:**
```json
{
  "mensaje": "Grabación del macro 'test' cancelada"
}
```

---

### 7. Información del Patrón

```bash
curl http://localhost:3000/command/pattern-info
```

**Respuesta:**
```json
{
  "pattern": "Command",
  "description": "Editor de texto con comandos desacoplados y funcionalidad de Undo/Redo",
  "components": {
    "command": "ICommand - Interfaz que encapsula una operación",
    "concreteCommands": [
      "InsertarTextoCommand - Inserta texto",
      "BorrarRangoCommand - Borra un rango",
      "ReemplazarCommand - Reemplaza texto",
      "MacroCommand - Agrupa comandos (Composite)"
    ],
    "receiver": "Documento - Objeto que realiza las operaciones reales",
    "invoker": "HistorialComandos - Ejecuta comandos y gestiona historial",
    "client": "CommandController - Crea y ejecuta comandos"
  },
  "features": [
    "Undo/Redo ilimitado",
    "Macros (grabación y ejecución)",
    "Logging de operaciones",
    "Comandos desacoplados del receptor",
    "Composite pattern para macros"
  ]
}
```

---

## 🎯 Casos de Uso Reales

### Sistema de Control de Versiones Simplificado
```bash
# Simular commits como macros
curl -X POST http://localhost:3000/command/macro/grabar \
  -H "Content-Type: application/json" \
  -d '{"nombre": "commit_1"}'

# Hacer cambios
curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{"pos": 0, "texto": "function main() {\n"}'

curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{"pos": 18, "texto": "  console.log(\"Hello\");\n"}'

curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{"pos": 43, "texto": "}\n"}'

curl -X POST http://localhost:3000/command/macro/finalizar

# Aplicar "commit" en otra rama (documento)
curl -X POST http://localhost:3000/command/reiniciar

curl -X POST http://localhost:3000/command/macro/ejecutar \
  -H "Content-Type: application/json" \
  -d '{"nombre": "commit_1"}'
```

### Plantillas de Documentos
```bash
# Crear plantilla de carta formal
curl -X POST http://localhost:3000/command/macro/grabar \
  -H "Content-Type: application/json" \
  -d '{"nombre": "plantilla_carta"}'

curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{
    "pos": 0,
    "texto": "[FECHA]\n\n[DESTINATARIO]\n\nEstimado/a [NOMBRE],\n\n[CUERPO]\n\nAtentamente,\n[REMITENTE]"
  }'

curl -X POST http://localhost:3000/command/macro/finalizar
```

---

## 💡 Tips de Uso

1. **Macros anidados**: Los macros son comandos, así que puedes grabar un macro que ejecute otros macros
2. **Undo de macros**: Deshacer un macro deshace todos sus comandos en orden inverso
3. **Limpieza selectiva**: Usa los endpoints de limpieza específicos según necesites
4. **Log para debugging**: El log muestra todas las operaciones con timestamps
5. **Info del historial**: Usa `/command/info` para saber cuántas operaciones puedes deshacer/rehacer

## 🚨 Manejo de Errores

Todos los endpoints validan los datos y retornan errores claros:

```bash
# Posición inválida
curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{"pos": -1, "texto": "test"}'
# Error: pos debe ser mayor o igual a 0

# Rango inválido
curl -X POST http://localhost:3000/command/borrar \
  -H "Content-Type: application/json" \
  -d '{"desde": 10, "hasta": 5}'
# Error: hasta debe ser mayor o igual que desde
```
