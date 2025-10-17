# 🎨 Smart Tutor - Sistema de Diseño

## Tipografía

### Fuente Principal: Inter
Smart Tutor utiliza **Inter** como fuente principal, una tipografía sans-serif moderna diseñada específicamente para interfaces digitales.

**Características:**
- Optimizada para legibilidad en pantallas
- Diseñada específicamente para UI/UX
- Espaciado natural y equilibrado
- Excelente en diferentes tamaños

**Pesos disponibles:**
- Light (300) - Texto decorativo
- Regular (400) - Texto normal
- Medium (500) - Énfasis moderado
- Semibold (600) - Subtítulos
- Bold (700) - Títulos principales
- ExtraBold (800) - Títulos hero

**Uso en código:**
```jsx
// Fuente por defecto (ya aplicada globalmente)
className="font-sans"

// Fuente explícita
className="font-inter"

// Con tracking para títulos grandes
className="font-bold tracking-tight"
```

## Paleta de Colores

### Colores Primarios (Verde)
```css
primary-50:  #f0fdf4  /* Fondo muy claro */
primary-100: #dcfce7  /* Fondo claro */
primary-200: #bbf7d0  /* Bordes sutiles */
primary-300: #86efac  /* Elementos secundarios */
primary-400: #4ade80  /* Hover states */
primary-500: #22c55e  /* Color principal */
primary-600: #16a34a  /* Botones */
primary-700: #15803d  /* Texto destacado */
primary-800: #166534  /* Texto oscuro */
primary-900: #14532d  /* Texto muy oscuro */
```

### Colores Secundarios (Grises)
```css
secondary-50:  #f9fafb  /* Fondo muy claro */
secondary-100: #f3f4f6  /* Fondo claro */
secondary-200: #e5e7eb  /* Bordes */
secondary-300: #d1d5db  /* Bordes oscuros */
secondary-400: #9ca3af  /* Texto deshabilitado */
secondary-500: #6b7280  /* Texto secundario */
secondary-600: #4b5563  /* Texto normal */
secondary-700: #374151  /* Texto principal */
secondary-800: #1f2937  /* Texto oscuro */
secondary-900: #111827  /* Texto muy oscuro */
```

### Colores de Estado
```css
success: #22c55e  /* Verde - Éxito */
warning: #f59e0b  /* Naranja - Advertencia */
error:   #ef4444  /* Rojo - Error */
info:    #3b82f6  /* Azul - Información */
```

## Backgrounds

### Gradientes
```jsx
// Gradiente sutil (fondo de página)
className="bg-gradient-subtle"
// Linear: #f0fdf4 → #ffffff

// Gradiente primario
className="bg-gradient-primary"
// Linear: #dcfce7 → #bbf7d0 → #86efac

// Patrón de malla
className="bg-mesh-pattern"
// Patrón SVG con puntos verdes sutiles
```

### Transparencias
```jsx
// Fondo blanco semi-transparente con blur
className="bg-white/90 backdrop-blur-sm"

// Fondo blanco con transparencia 80%
className="bg-white/80"
```

## Sombras

```jsx
// Sombra suave (tarjetas normales)
className="shadow-soft"

// Sombra media (elementos destacados)
className="shadow-medium"

// Sombra fuerte (hover, elementos importantes)
className="shadow-strong"
```

## Animaciones

### Clases de Animación
```jsx
// Fade in
className="animate-fade-in"

// Slide up (deslizar desde abajo)
className="animate-slide-up"

// Scale in (crecer desde el centro)
className="animate-scale-in"
```

### Transiciones
```jsx
// Transición de colores
className="transition-colors duration-300"

// Transición completa (todo)
className="transition-all duration-300"

// Transición de transformación
className="transition-transform duration-300"
```

## Componentes Comunes

### Header
```jsx
<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-soft">
  {/* Contenido del header */}
</header>
```

### Tarjeta Base
```jsx
<div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-soft p-6 border border-primary-100">
  {/* Contenido de la tarjeta */}
</div>
```

### Tarjeta con Hover
```jsx
<div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-soft hover:shadow-strong hover:scale-105 transition-all duration-300 cursor-pointer group">
  {/* Contenido con efectos group-hover */}
</div>
```

### Botón Primario
```jsx
<button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  Botón
</button>
```

### Botón Secundario
```jsx
<button className="border border-secondary-300 text-secondary-700 hover:bg-secondary-100 font-medium py-2 px-4 rounded-lg transition-colors">
  Botón
</button>
```

### Icono en Contenedor
```jsx
<div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
  <IconComponent className="text-primary-700" size={24} />
</div>
```

## Tipografía

### Títulos
```jsx
// H1 - Título principal
className="text-2xl font-semibold text-secondary-900"
// font-weight: 600 (Semibold)

// H2 - Subtítulo
className="text-xl font-bold text-secondary-900"
// font-weight: 700 (Bold)

// H3 - Título de sección
className="text-lg font-semibold text-secondary-900"
// font-weight: 600 (Semibold)
```

### Texto
```jsx
// Texto normal
className="text-sm text-secondary-700"
// font-weight: 400 (Regular)

// Texto medio (destacado)
className="text-sm font-medium text-secondary-700"
// font-weight: 500 (Medium)

// Texto secundario
className="text-sm text-secondary-600"
// font-weight: 400 (Regular)

// Texto deshabilitado
className="text-sm text-secondary-400"
// font-weight: 400 (Regular)
```

### Botones
```jsx
// Botón con texto medio
className="font-medium"
// font-weight: 500

// Botón con texto semibold
className="font-semibold"
// font-weight: 600
```

## Espaciado Estándar

```jsx
// Padding de tarjetas
className="p-6"

// Gap entre elementos
className="gap-6"

// Margen superior de secciones
className="mt-8"

// Margen inferior de secciones
className="mb-6"
```

## Mejores Prácticas

1. **Usa colores semánticos**: `primary-*` para elementos principales, `secondary-*` para texto y grises
2. **Aplica transparencias**: `bg-white/90` con `backdrop-blur-sm` para fondos elegantes
3. **Añade transiciones**: Siempre incluye `transition-*` en elementos interactivos
4. **Usa group hover**: Para efectos coordinados en hover dentro de tarjetas
5. **Animaciones sutiles**: Usa `animate-*` solo para elementos importantes
6. **Consistencia**: Mantén el mismo estilo de sombras, bordes y espaciado en toda la app

## Estructura de Páginas

```jsx
function Page() {
  return (
    <div className="min-h-screen bg-gradient-subtle bg-mesh-pattern">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-soft">
        {/* Header content */}
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        {/* Page content */}
      </main>
    </div>
  );
}
```

## Responsive Design

```jsx
// Mobile first approach
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Ocultar en mobile
className="hidden md:block"

// Cambiar dirección en mobile
className="flex flex-col md:flex-row"
```
