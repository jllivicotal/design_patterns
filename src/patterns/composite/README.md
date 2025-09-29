# Patrón Composite - Sistema de Archivos

## Descripción

Este proyecto implementa el patrón de diseño **Composite** para modelar un sistema de archivos jerárquico. El patrón permite tratar objetos individuales (archivos) y composiciones de objetos (carpetas) de manera uniforme.

## Estructura del Patrón

### Componente Base
- **FileComponent**: Clase abstracta que define la interfaz común para archivos y carpetas
  - `getName()`: Obtiene el nombre del componente
  - `getSize()`: Obtiene el tamaño del componente

### Hojas (Leaves)
- **PdfFile**: Representa archivos PDF con tamaño específico
- **DocxFile**: Representa documentos Word con tamaño específico  
- **XlsxFile**: Representa hojas de cálculo Excel con tamaño específico

### Compuesto (Composite)
- **Folder**: Representa carpetas que pueden contener archivos y otras carpetas
  - `add(child)`: Agrega un componente hijo
  - `remove(child)`: Remueve un componente hijo
  - `getChildren()`: Obtiene todos los componentes hijos
  - `getSize()`: Calcula el tamaño total (suma recursiva de todos los hijos)

## Características Implementadas

### Funcionalidades del Sistema
1. **Cálculo recursivo de tamaños**: Las carpetas calculan su tamaño sumando recursivamente todos los archivos que contienen
2. **Navegación jerárquica**: Permite navegar por la estructura de carpetas
3. **Operaciones uniformes**: Tanto archivos como carpetas implementan la misma interfaz
4. **Visualización de estructura**: Genera representaciones textuales de la jerarquía

### Endpoints API

#### Información del Patrón
- `GET /api/composite` - Información general del patrón
- `GET /api/composite/demo` - Información de uso y ejemplos

#### Sistema de Archivos
- `GET /api/filesystem` - Obtiene la estructura completa del sistema de archivos
- `GET /api/filesystem/statistics` - Estadísticas del sistema (total archivos, carpetas, tamaño)
- `GET /api/filesystem/structure` - Estructura jerárquica como texto
- `GET /api/filesystem/size` - Tamaño total del sistema
- `GET /api/filesystem/item/{path}` - Información de un elemento específico
- `POST /api/filesystem/files` - Crear nuevo archivo
- `POST /api/filesystem/folders` - Crear nueva carpeta

## Ejemplo de Uso

### Estructura inicial del sistema
```
📁 root/ (10440000 bytes)
  📁 Documentos/ (3584000 bytes)
    📄 manual.pdf (2048000 bytes)
    📝 carta.docx (512000 bytes)  
    📊 presupuesto.xlsx (1024000 bytes)
  📁 Imagenes/ (0 bytes)
  📁 Trabajo/ (6856000 bytes)
    📁 Reportes/ (5632000 bytes)
      📄 reporte_anual.pdf (3072000 bytes)
      📊 ventas_q1.xlsx (2560000 bytes)
    📝 propuesta.docx (768000 bytes)
```

### Crear un nuevo archivo
```bash
POST /api/filesystem/files
{
  "name": "nuevo_documento.pdf",
  "type": "PDF", 
  "size": 1500000
}
```

### Crear una nueva carpeta
```bash
POST /api/filesystem/folders
{
  "name": "Nueva_Carpeta"
}
```

## Ventajas del Patrón Composite

1. **Uniformidad**: Archivos y carpetas se tratan de la misma manera
2. **Simplicidad**: El cliente no necesita distinguir entre objetos simples y compuestos
3. **Recursividad natural**: Operaciones como calcular tamaño se propagan automáticamente
4. **Extensibilidad**: Fácil agregar nuevos tipos de archivos o funcionalidades

## Casos de Uso

- **Sistemas de archivos**: Como el implementado aquí
- **Interfaces gráficas**: Componentes que pueden contener otros componentes
- **Estructuras organizacionales**: Empleados, departamentos, divisiones
- **Expresiones matemáticas**: Operandos y operadores compuestos
- **Menús de navegación**: Elementos simples y submenús

## Tecnologías Utilizadas

- **NestJS**: Framework backend
- **TypeScript**: Lenguaje de programación
- **Class-validator**: Validación de DTOs
- **Patrón Composite**: Implementación del diseño

## Diagrama UML

El sistema implementa fielmente el diagrama UML proporcionado:

```
FileComponent (abstract)
├── PdfFile (leaf)
├── DocxFile (leaf)  
├── XlsxFile (leaf)
└── Folder (composite)
    └── children: FileComponent[]
```

La característica principal es que **Folder** puede contener cualquier tipo de **FileComponent**, incluyendo otros **Folder**, creando así una estructura recursiva natural.