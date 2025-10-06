# Patrón Command - Editor de Texto

## 📋 Descripción

Implementación del patrón **Command** usando un editor de texto como ejemplo. El patrón encapsula operaciones (comandos) como objetos, permitiendo parametrizar clientes con diferentes operaciones, encolar operaciones, y soportar operaciones reversibles (undo/redo).

## 🎯 Problema que Resuelve

- **Desacoplamiento**: Separa el objeto que invoca la operación del objeto que sabe cómo ejecutarla
- **Reversibilidad**: Permite implementar undo/redo de manera elegante
- **Registro de operaciones**: Facilita mantener un log de todas las operaciones ejecutadas
- **Macros**: Permite agrupar múltiples comandos en uno solo (usando Composite)
- **Transaccionalidad**: Permite ejecutar operaciones en batch y revertirlas si es necesario

## 🏗️ Estructura del Patrón

### Componentes Principales

```
┌─────────────────────────────────────────────────────────────┐
│                        ICommand                              │
│  + execute(): void                                          │
│  + undo(): void                                             │
└─────────────────────────────────────────────────────────────┘
                           △
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                   │
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│InsertarTexto  │  │BorrarRango    │  │Reemplazar     │
│Command        │  │Command        │  │Command        │
└───────────────┘  └───────────────┘  └───────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      MacroCommand                            │
│  - comandos: ICommand[]                                     │
│  + add(cmd: ICommand): void                                 │
│  + execute(): void  // Ejecuta todos                        │
│  + undo(): void     // Deshace todos (en reversa)          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Documento (Receiver)                    │
│  - contenido: string                                        │
│  + insertar(pos, texto): void                               │
│  + borrar(desde, hasta): string                             │
│  + reemplazar(desde, len, texto): string                    │
│  + getTexto(): string                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  HistorialComandos (Invoker)                │
│  - undoStack: ICommand[]                                    │
│  - redoStack: ICommand[]                                    │
│  - macros: Map<string, MacroCommand>                        │
│  + ejecutar(cmd: ICommand): void                            │
│  + undo(): void                                             │
│  + redo(): void                                             │
│  + grabarMacro(nombre): void                                │
│  + ejecutarMacro(nombre): void                              │
└─────────────────────────────────────────────────────────────┘
```

### Roles

1. **Command (ICommand)**: Interfaz que declara `execute()` y `undo()`
2. **ConcreteCommand**: Implementaciones específicas (InsertarTextoCommand, etc.)
3. **Receiver (Documento)**: Objeto que realiza las operaciones reales
4. **Invoker (HistorialComandos)**: Ejecuta comandos y gestiona historial
5. **Client (CommandService/Controller)**: Crea comandos y los pasa al invoker
6. **MacroCommand**: Composite que agrupa múltiples comandos

## 📁 Estructura de Archivos

```
src/patterns/command/
├── command/
│   ├── icommand.interface.ts          # Interfaz Command
│   ├── insertar-texto.command.ts      # ConcreteCommand
│   ├── borrar-rango.command.ts        # ConcreteCommand
│   ├── reemplazar.command.ts          # ConcreteCommand
│   └── macro.command.ts               # Composite Command
├── receiver/
│   └── documento.ts                   # Receiver
├── invoker/
│   └── historial-comandos.ts          # Invoker con undo/redo
├── dto/
│   ├── insertar-texto.dto.ts
│   ├── borrar-rango.dto.ts
│   ├── reemplazar.dto.ts
│   ├── macro.dto.ts
│   └── index.ts
├── controllers/
│   └── command.controller.ts          # REST API
├── command.service.ts                 # Client
├── command.module.ts
└── README.md
```

## 🔧 Implementación

### 1. Command Interface

```typescript
export interface ICommand {
  execute(): void;
  undo(): void;
}
```

### 2. Concrete Commands

Cada comando guarda el estado necesario para revertir la operación:

```typescript
export class InsertarTextoCommand implements ICommand {
  constructor(
    private documento: Documento,
    private pos: number,
    private texto: string,
  ) {}

  execute(): void {
    this.documento.insertar(this.pos, this.texto);
  }

  undo(): void {
    const len = this.texto.length;
    this.documento.borrar(this.pos, this.pos + len);
  }
}
```

### 3. Receiver (Documento)

Realiza las operaciones reales sobre el contenido:

```typescript
export class Documento {
  private contenido: string = '';

  insertar(pos: number, texto: string): void {
    this.contenido =
      this.contenido.substring(0, pos) +
      texto +
      this.contenido.substring(pos);
  }

  borrar(desde: number, hasta: number): string {
    const borrado = this.contenido.substring(desde, hasta);
    this.contenido =
      this.contenido.substring(0, desde) +
      this.contenido.substring(hasta);
    return borrado;
  }
}
```

### 4. Invoker (HistorialComandos)

Gestiona la ejecución, undo/redo y macros:

```typescript
export class HistorialComandos {
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];
  private macros: Map<string, MacroCommand> = new Map();
  private grabandoMacro: string | null = null;
  private comandosTemporal: ICommand[] = [];

  ejecutar(comando: ICommand): void {
    comando.execute();
    this.undoStack.push(comando);
    this.redoStack = [];
    
    if (this.grabandoMacro) {
      this.comandosTemporal.push(comando);
    }
  }

  undo(): boolean {
    if (this.undoStack.length === 0) return false;
    const comando = this.undoStack.pop()!;
    comando.undo();
    this.redoStack.push(comando);
    return true;
  }

  redo(): boolean {
    if (this.redoStack.length === 0) return false;
    const comando = this.redoStack.pop()!;
    comando.execute();
    this.undoStack.push(comando);
    return true;
  }
}
```

### 5. MacroCommand (Composite)

Agrupa múltiples comandos:

```typescript
export class MacroCommand implements ICommand {
  private comandos: ICommand[] = [];

  add(comando: ICommand): void {
    this.comandos.push(comando);
  }

  execute(): void {
    for (const cmd of this.comandos) {
      cmd.execute();
    }
  }

  undo(): void {
    // Deshacer en orden inverso
    for (let i = this.comandos.length - 1; i >= 0; i--) {
      this.comandos[i].undo();
    }
  }
}
```

## 🌐 API REST

### Endpoints de Edición

#### Insertar Texto
```http
POST /command/insertar
Content-Type: application/json

{
  "pos": 0,
  "texto": "Hola mundo"
}
```

#### Borrar Rango
```http
POST /command/borrar
Content-Type: application/json

{
  "desde": 0,
  "hasta": 4
}
```

#### Reemplazar Texto
```http
POST /command/reemplazar
Content-Type: application/json

{
  "desde": 5,
  "len": 5,
  "nuevo": "amigo"
}
```

### Endpoints de Historial

#### Undo
```http
POST /command/undo
```

#### Redo
```http
POST /command/redo
```

#### Obtener Texto
```http
GET /command/texto
```

#### Obtener Info del Historial
```http
GET /command/info
```

#### Obtener Log de Operaciones
```http
GET /command/log
```

### Endpoints de Macros

#### Iniciar Grabación
```http
POST /command/macro/grabar
Content-Type: application/json

{
  "nombre": "firma"
}
```

#### Finalizar Grabación
```http
POST /command/macro/finalizar
```

#### Cancelar Grabación
```http
POST /command/macro/cancelar
```

#### Ejecutar Macro
```http
POST /command/macro/ejecutar
Content-Type: application/json

{
  "nombre": "firma"
}
```

#### Listar Macros
```http
GET /command/macro
```

#### Eliminar Macro
```http
DELETE /command/macro/firma
```

### Endpoints de Limpieza

#### Limpiar Historial
```http
POST /command/historial/limpiar
```

#### Limpiar Log
```http
POST /command/log/limpiar
```

#### Limpiar Documento
```http
POST /command/documento/limpiar
```

#### Reiniciar Todo
```http
POST /command/reiniciar
```

## ✨ Características Implementadas

### 1. Undo/Redo Ilimitado
- Pilas de comandos para deshacer/rehacer
- Cada comando guarda el estado necesario para revertirse
- El stack de redo se limpia al ejecutar un nuevo comando

### 2. Macros con Composite Pattern
- Grabación de secuencias de comandos
- Los macros se ejecutan como un solo comando
- Undo de un macro deshace todos sus comandos

### 3. Logging de Operaciones
- Registro detallado de todas las operaciones
- Timestamp y descripción de cada comando
- Útil para debugging y auditoría

### 4. Comandos Reversibles
- Cada comando implementa `undo()`
- Se guarda el estado necesario (texto borrado, posición original, etc.)
- Garantiza consistencia del documento

## 🎓 Ventajas del Patrón

1. **Desacoplamiento**: Los objetos que invocan operaciones están separados de los que las ejecutan
2. **Extensibilidad**: Fácil agregar nuevos comandos sin modificar código existente
3. **Composición**: Los macros demuestran cómo combinar comandos
4. **Reversibilidad**: Implementación elegante de undo/redo
5. **Logging**: Fácil mantener registro de operaciones
6. **Testing**: Los comandos son objetos independientes fáciles de testear

## 🔍 Casos de Uso

- **Editores de texto**: Undo/redo, macros, búsqueda/reemplazo
- **Sistemas de dibujo**: Operaciones gráficas reversibles
- **Transacciones**: Operaciones que pueden revertirse
- **Sistemas de cola**: Encolar operaciones para ejecución posterior
- **Wizards**: Secuencias de pasos que pueden deshacerse
- **Migración de datos**: Scripts reversibles

## 📚 Referencias

- **Libro**: Design Patterns: Elements of Reusable Object-Oriented Software (Gang of Four)
- **Patrón**: Command (Behavioral Pattern)
- **También conocido como**: Action, Transaction

## 🚀 Uso Rápido

1. Iniciar el servidor:
```bash
npm run start:dev
```

2. Probar el editor:
```bash
# Insertar texto
curl -X POST http://localhost:3000/command/insertar \
  -H "Content-Type: application/json" \
  -d '{"pos": 0, "texto": "Hola mundo"}'

# Ver el texto
curl http://localhost:3000/command/texto

# Deshacer
curl -X POST http://localhost:3000/command/undo

# Rehacer
curl -X POST http://localhost:3000/command/redo
```

Ver más ejemplos en [EXAMPLES.md](./EXAMPLES.md)
