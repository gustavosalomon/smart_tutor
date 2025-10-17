/**
 * 🎨 Guía de Estilos de Tipografía - Inter
 * 
 * Este archivo muestra ejemplos de uso de la fuente Inter
 * con diferentes pesos y estilos para mantener consistencia
 * en toda la aplicación.
 * 
 * Inter es una fuente diseñada específicamente para interfaces digitales,
 * con excelente legibilidad en pantallas y un aspecto moderno y profesional.
 */

// ============================================
// TÍTULOS (Headings)
// ============================================

// H1 - Hero / Página Principal
<>
<h1 className="text-4xl md:text-5xl font-bold text-secondary-900 tracking-tight">
  Título Principal
</h1>

// H2 - Secciones Principales
<h2 className="text-3xl font-bold text-secondary-900 tracking-tight">
  Sección Principal
</h2>

// H3 - Subsecciones
<h3 className="text-2xl font-semibold text-secondary-900 tracking-tight">
  Subsección
</h3>

// H4 - Títulos de Tarjetas
<h4 className="text-xl font-semibold text-secondary-900">
  Título de Tarjeta
</h4>

// H5 - Títulos Pequeños
<h5 className="text-lg font-medium text-secondary-900">
  Título Pequeño
</h5>

// ============================================
// TEXTO (Body Text)
// ============================================

// Texto Grande
<p className="text-base font-normal text-secondary-700">
  Texto de párrafo grande y legible para contenido principal.
</p>

// Texto Normal (más común)
<p className="text-sm font-normal text-secondary-700">
  Texto estándar para la mayoría del contenido de la aplicación.
</p>

// Texto Pequeño
<p className="text-xs font-normal text-secondary-600">
  Texto pequeño para información secundaria o metadatos.
</p>

// ============================================
// TEXTO DESTACADO
// ============================================

// Texto con énfasis medio
<span className="font-medium text-secondary-900">
  Texto destacado con peso medio
</span>

// Texto con énfasis fuerte
<span className="font-semibold text-secondary-900">
  Texto destacado con peso semibold
</span>

// Texto bold
<span className="font-bold text-primary-700">
  Texto muy destacado en color primario
</span>

// ============================================
// BOTONES
// ============================================

// Botón Primario
<button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg">
  Botón Primario
</button>

// Botón Secundario
<button className="bg-white border border-secondary-300 text-secondary-700 font-medium py-2 px-4 rounded-lg hover:bg-secondary-50">
  Botón Secundario
</button>

// Botón de Texto
<button className="text-primary-700 font-medium hover:text-primary-800">
  Acción de Texto
</button>

// ============================================
// ENLACES (Links)
// ============================================

// Enlace Normal
<a href="#" className="text-primary-700 hover:text-primary-800 font-medium underline">
  Enlace Normal
</a>

// Enlace Sin Subrayado
<a href="#" className="text-primary-700 hover:text-primary-800 font-medium">
  Enlace Sin Subrayado
</a>

// ============================================
// ETIQUETAS (Labels & Tags)
// ============================================

// Label de Formulario
<label className="text-sm font-medium text-secondary-700 mb-1 block">
  Nombre de Usuario
</label>

// Badge / Tag
<span className="inline-block bg-primary-100 text-primary-700 text-xs font-medium px-3 py-1 rounded-full">
  Nuevo
</span>

// ============================================
// LISTAS
// ============================================

// Lista con viñetas
<ul className="list-disc list-inside text-sm text-secondary-700 space-y-2">
  <li className="font-normal">Item de lista normal</li>
  <li className="font-medium">Item de lista destacado</li>
</ul>

// ============================================
// MENSAJES Y ALERTAS
// ============================================

// Mensaje de Éxito
<div className="bg-green-50 border border-green-200 rounded-lg p-4">
  <p className="text-sm font-medium text-green-800">
    ¡Operación exitosa!
  </p>
  <p className="text-xs font-normal text-green-700 mt-1">
    Los cambios se guardaron correctamente.
  </p>
</div>

// Mensaje de Error
<div className="bg-red-50 border border-red-200 rounded-lg p-4">
  <p className="text-sm font-medium text-red-800">
    Error en la operación
  </p>
  <p className="text-xs font-normal text-red-700 mt-1">
    Por favor, verifica los datos e intenta nuevamente.
  </p>
</div>

// ============================================
// NAVEGACIÓN
// ============================================

// Link de Navegación Activo
<a className="text-sm font-semibold text-primary-700">
  Inicio
</a>

// Link de Navegación Inactivo
<a className="text-sm font-medium text-secondary-600 hover:text-primary-700">
  Configuración
</a>

// ============================================
// TABLA
// ============================================

// Header de Tabla
<th className="text-xs font-semibold text-secondary-700 uppercase tracking-wider">
  Nombre
</th>
// Celda de Tabla
<td className="text-sm font-normal text-secondary-900">
  Juan Pérez
</td>
</>

// ============================================
// ============================================
// NOTAS IMPORTANTES
// ============================================

/**
 * PESOS DE FUENTE DISPONIBLES (Inter):
 * 
 * font-light     → 300 (Light)    - Texto decorativo
 * font-normal    → 400 (Regular)  - Texto de cuerpo
 * font-medium    → 500 (Medium)   - Énfasis ligero, botones
 * font-semibold  → 600 (Semibold) - Títulos secundarios
 * font-bold      → 700 (Bold)     - Títulos principales
 * font-extrabold → 800 (ExtraBold)- Títulos hero destacados
 * 
 * TAMAÑOS RECOMENDADOS:
 * 
 * text-xs   → 0.75rem (12px) - Metadatos, badges
 * text-sm   → 0.875rem (14px) - Texto principal
 * text-base → 1rem (16px) - Texto destacado
 * text-lg   → 1.125rem (18px) - Subtítulos
 * text-xl   → 1.25rem (20px) - Títulos pequeños
 * text-2xl  → 1.5rem (24px) - Títulos medianos
 * text-3xl  → 1.875rem (30px) - Títulos grandes
 * text-4xl  → 2.25rem (36px) - Hero titles
 * 
 * TRACKING (Letter-spacing) para Inter:
 * 
 * tracking-tight  → -0.025em (Para títulos grandes)
 * tracking-normal → 0em (Para texto de cuerpo)
 * tracking-wide   → 0.025em (Para uppercase pequeño)
 * 
 * NOTA: Inter se ve mejor con tracking-tight en títulos grandes
 */
