# CNC Guatemala — Plataforma Nacional de Datos para la Integridad

Portal web para centralizar, clasificar y facilitar el acceso a conjuntos de datos públicos útiles para prevenir, detectar, investigar y analizar riesgos de corrupción en Guatemala. Desarrollado para la Comisión Nacional contra la Corrupción (CNC).

---

## Tabla de contenidos

1. [Resumen de la plataforma](#resumen-de-la-plataforma)
2. [Funcionalidades del portal público](#funcionalidades-del-portal-público)
3. [Funcionalidades del panel administrativo](#funcionalidades-del-panel-administrativo)
4. [Tecnologías](#tecnologías)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Componentes principales](#componentes-principales)
7. [Base de datos](#base-de-datos)
8. [Instalación y configuración](#instalación-y-configuración)
9. [Cómo replicar](#cómo-replicar)
10. [Scripts disponibles](#scripts-disponibles)

---

## Resumen de la plataforma

La plataforma tiene dos grandes áreas:

- **Portal público** (`/`): cualquier visitante puede explorar el catálogo de datos, consultar fichas detalladas, visualizar el mapa de datos, leer historias con datos, revisar la agenda de apertura, entender la metodología de evaluación y enviar feedback sobre los conjuntos.
- **Panel administrativo** (`/admin`): usuarios autenticados gestionan todo el contenido del portal: datasets, categorías, instituciones, estados, etiquetas, ejes de integridad, identificadores, evaluaciones, historias, agenda, casos de uso, recursos, feedback, importación masiva y configuración.

---

## Funcionalidades del portal público

### 1. Página de inicio (`/`)

La home está diseñada como puerta de entrada al ecosistema de datos anticorrupción. Incluye:

- **Hero con buscador integrado**: fotografía de fondo de Guatemala, título y subtítulo configurables, y un buscador que redirige a la página de exploración con los resultados.
- **Accesos rápidos de investigación** ("¿Qué quieres analizar?"): tarjetas configurables desde el admin que enlazan a rutas de investigación concretas (ej. "Seguir el dinero", "Identificar beneficiarios finales").
- **Indicadores nacionales**: seis tarjetas con métricas en tiempo real calculadas desde la base de datos:
  - Fuentes estratégicas (total de datasets publicados)
  - Datos abiertos (nivel de apertura 4-5)
  - Consulta pública (nivel 3)
  - Datos parciales (nivel 1-2)
  - Brechas identificadas (nivel 0)
  - Instituciones conectadas (instituciones únicas con datasets)
- **Ejes de integridad**: tarjetas que organizan los datos según la pregunta que el usuario quiere responder (Personas y poder, Empresas y vínculos, Recursos públicos, Regulación y cumplimiento, Control y sanción). Cada eje muestra su icono, pregunta guía y descripción.
- **Datos destacados**: los seis conjuntos marcados como "destacados" en el admin, mostrados como tarjetas con icono, categoría, institución, estado y nivel de apertura.
- **Vista previa del Mapa de Datos**: sección con imagen de fondo y un mosaico de iconos que representan los tipos de datos conectables, con enlace al mapa completo.
- **Casos de uso (preview)**: tarjeta resumen con enlace a la página de casos de uso.
- **Agenda de apertura**: las cinco prioridades más recientes de la agenda, mostrando información faltante, porcentaje de avance y nivel de prioridad (crítica, alta, media, baja).
- **Historias con datos**: las tres historias más recientes, con imagen de portada, título, resumen y autor.
- **Instituciones conectadas**: sección con fotografía de Guatemala y conteo de instituciones que publican o administran datos en el portal.
- **Metodología (preview)**: tarjeta con resumen y enlace a la página de metodología, incluyendo el aviso de integridad configurable.

### 2. Explorar datos (`/explorar`)

Catálogo completo de conjuntos de datos publicados con:

- **Búsqueda por texto libre**: busca en nombre, descripción corta y descripción larga de todos los datasets.
- **Filtros combinables** (en barra lateral pegajosa):
  - Por categoría anticorrupción
  - Por tipo de conjunto
  - Por estado de disponibilidad
  - Por institución responsable
  - Por valor anticorrupción (prevención, detección, investigación, control social, trazabilidad)
- **Persistencia de filtros en URL**: todos los filtros se reflejan en los parámetros de búsqueda, por lo que se puede compartir o marcar una búsqueda concreta.
- **Conteo de resultados**: muestra cuántos conjuntos coinciden con los filtros activos.
- **Descarga del inventario**: botones para exportar los resultados filtrados en formato **CSV** o **JSON** con los campos principales (nombre, slug, descripción, categoría, tipo, institución, estado, URL fuente).
- **Limpiar filtros**: botón para restablecer todos los filtros de una vez.
- **Tarjetas de dataset**: cada resultado muestra icono, nombre, descripción corta, categoría, institución, insignia de estado y nivel de apertura.
- **Ordenamiento**: los datasets destacados aparecen primero, luego por orden de visualización y finalmente alfabético.

### 3. Ficha de dataset (`/datasets/:slug`)

Página detallada de cada conjunto de datos publicada, con:

- **Migas de pan**: navegación jerárquica (Explorar > Categoría > Nombre del dataset).
- **Encabezado con icono, categoría, título, descripción corta, insignia de estado e institución responsable**.
- **Botones de acción**: enlace a la fuente oficial y contador de recursos disponibles.
- **Evaluación de madurez del dato** (si existe): puntaje total sobre 100 con barras de progreso para 9 dimensiones:
  - Acceso efectivo
  - Reutilización
  - Actualización
  - Cobertura
  - Calidad y consistencia
  - Documentación
  - Identificadores
  - Interoperabilidad
  - Gobernanza
- **Evaluación de utilidad anticorrupción** (si existe): puntaje total sobre 100 con barras para 5 dimensiones:
  - Prevención
  - Detección
  - Investigación
  - Control social
  - Trazabilidad del gasto
- **Alerta de prioridad crítica**: aviso visual automático cuando un dataset tiene alta utilidad anticorrupción (>=70) pero baja madurez (<40), indicando que abrirlo tendría alto impacto.
- **"¿Por qué estos datos importan?"**: texto explicativo del valor anticorrupción del conjunto.
- **Descripción extendida**: descripción larga del dataset.
- **Preguntas que permite responder**: lista de preguntas de investigación que el conjunto ayuda a contestar.
- **Datos que puedes cruzar**: relaciones con otros datasets, mostrando el conjunto relacionado, descripción del cruce y campo de unión (join field).
- **Recursos del conjunto**: lista de recursos descargables o enlazables (archivos, portales, APIs, dashboards, documentos) con icono, formato y tipo.
- **Datos técnicos**: cobertura geográfica, cobertura temporal, frecuencia de actualización, última actualización, licencia, disponibilidad de API.
- **Enlaces externos**: URL de API, URL de metadata, URL de documentación, URL de fuente oficial.
- **Casos de uso relacionados**: ejemplos prácticos vinculados al dataset.
- **Formulario de feedback ciudadano**: permite a cualquier visitante reportar problemas o sugerir mejoras, con campos de nombre (opcional), correo (opcional), tipo de reporte (enlace roto, dato desactualizado, dato incompleto, error, solicitar formato abierto, sugerir nueva fuente, otro) y comentario. Muestra confirmación al enviar.
- **Barra lateral** con:
  - Estado de disponibilidad con descripción
  - Nivel de apertura con escala visual de 1 a 5
  - Identificadores disponibles (NIT, NOG, SNIP, etc.)
  - Institución responsable con enlace
  - Valores anticorrupción activos (prevención, detección, investigación, control social, trazabilidad)
  - Etiquetas con enlace a búsqueda
- **Conjuntos relacionados**: cuatro datasets de la misma categoría mostrados como tarjetas al final de la página.

### 4. Mapa de Datos para la Integridad (`/mapa-datos`)

Visualización interactiva que muestra cómo se conectan los conjuntos de datos:

- **Grafo de nodos y aristas**: cada nodo representa un dataset o un eje de integridad; cada arista representa una relación de cruce entre dos datasets.
- **Panel lateral de detalles**: al seleccionar un nodo, se muestra información del dataset o eje (nombre, descripción, identificadores, relaciones).
- **Filtro por eje de integridad**: permite acotar el grafo a un eje específico.
- **Leyenda visual**: colores por tipo de nodo y tipo de relación.
- **Navegación al detalle**: desde el panel lateral se puede navegar a la ficha completa del dataset.

### 5. Metodología (`/metodologia`)

Página que explica cómo se evalúan los datos del portal:

- **Niveles de apertura**: definición de los seis niveles (0 a 5) con etiquetas (brecha, parcial, disponible, abierto) y descripciones.
- **Matriz de evaluación de madurez**: explicación de las 9 dimensiones (acceso, reutilización, actualización, cobertura, calidad, documentación, identificadores, interoperabilidad, gobernanza).
- **Matriz de utilidad anticorrupción**: explicación de las 5 dimensiones (prevención, detección, investigación, control social, trazabilidad).
- **Matriz madurez vs. utilidad**: cuadrícula que combina ambos puntajes para identificar prioridades de apertura.
- **Criterios para identificar brechas**: qué constituye una brecha de información y cómo se prioriza.
- **Aviso de integridad**: texto configurable desde el panel administrativo.

### 6. Historias con datos (`/historias`)

- **Listado de historias**: tarjetas con imagen de portada, título, resumen, autor y fecha de publicación.
- **Detalle de historia** (`/historias/:slug`): contenido completo de la historia, imagen de portada, autor, fecha y datasets relacionados.

### 7. Agenda de apertura (`/brechas`)

- **Tabla priorizada** de información estratégica que Guatemala aún no publica o que no es abierta.
- **Información faltante**: descripción del dato que se necesita abrir.
- **Situación actual**: estado de la publicación de ese dato.
- **Institución responsable**: institución que debería publicar.
- **Nivel de prioridad**: crítica, alta, media o baja (con código de color).
- **Recomendación**: acción sugerida para avanzar en la apertura.
- **Porcentaje de avance**: barra de progreso del 0% al 100%.

### 8. Casos de uso (`/casos-de-uso`)

- **Listado de casos**: ejemplos prácticos que muestran cómo combinar datasets para responder preguntas concretas.
- **Cada caso incluye**: título, descripción, metodología, resultados y enlaces externos.
- **Datasets vinculados**: cada caso muestra qué conjuntos de datos se utilizaron.

### 9. Acerca del portal (`/acerca`)

- **Propósito del portal**: por qué existe, a quién sirve y qué problema aborda.
- **Características**: qué ofrece la plataforma.
- **Contacto**: email y datos de contacto configurables desde el admin.

---

## Funcionalidades del panel administrativo

### Autenticación y roles (`/admin/login`)

- **Inicio de sesión** con email y contraseña (Supabase Auth).
- **Creación automática de perfil**: al iniciar sesión por primera vez, se crea un perfil con rol `super_admin`.
- **Roles disponibles**:
  - `super_admin` — acceso total a todas las funciones.
  - `editor` — edición de contenido.
  - `revisor` — revisión de contenido.
  - `consulta` — lectura sin edición.
- **Cierre de sesión** desde el encabezado del panel.

### Dashboard (`/admin`)

- **Resumen general** con métricas clave: total de datasets, publicados vs. borradores, brechas, datos abiertos, instituciones, historias, agenda.
- **Accesos rápidos** a las secciones más usadas del panel.

### Gestión de datasets (`/admin/datasets`)

- **Listado** con búsqueda, filtros por estado de publicación y categoría.
- **Crear nuevo dataset** (`/admin/datasets/new`): formulario completo con todos los campos.
- **Editar dataset** (`/admin/datasets/:id`): mismos campos que la creación.
- **Campos disponibles en el formulario**:
  - Nombre, slug, descripción corta y descripción larga
  - Icono (selector visual de iconos Lucide o URL personalizada)
  - Imagen de portada
  - Categoría, tipo de conjunto, institución, estado
  - Nivel de apertura (0-5)
  - Valores anticorrupción (prevención, detección, investigación, control social, trazabilidad)
  - Texto "¿Por qué importa?"
  - Cobertura geográfica, cobertura temporal, frecuencia, última actualización
  - Licencia, URL fuente, URL API, URL metadata, URL documentación
  - API disponible (sí/no)
  - Configuración PIDA (marcar como PIDA, asignar tema PIDA)
  - Datos de evaluación de Guatemala (existe, observaciones, fecha de evaluación, evaluador, marco normativo)
  - Publicado / no publicado, destacado, orden de visualización
- **Gestión de etiquetas** del dataset (asignar/quitar).
- **Gestión de ejes de integridad** del dataset (asignar/quitar).
- **Gestión de identificadores** del dataset (asignar/quitar).
- **Gestión de recursos** del dataset (crear, editar, eliminar archivos, portales, APIs, dashboards, documentos).
- **Gestión de relaciones** con otros datasets (definir cruce, campo de unión, descripción).
- **Gestión de preguntas** que el dataset permite responder.
- **Gestión de evaluación** de madurez y utilidad anticorrupción.
- **Eliminar** dataset con confirmación.

### Gestión de categorías (`/admin/categories`)

- CRUD completo: crear, editar, eliminar.
- Campos: nombre, slug, descripción, icono, color, orden, activo/inactivo.

### Gestión de instituciones (`/admin/institutions`)

- CRUD completo.
- Campos: nombre, slug, acrónimo, descripción, logo (URL), sitio web, email, teléfono, orden, activo/inactivo.

### Gestión de estados (`/admin/statuses`)

- CRUD completo.
- Campos: nombre, slug, descripción, color, icono, orden, activo/inactivo.

### Gestión de etiquetas (`/admin/tags`)

- CRUD completo.
- Campos: nombre, slug.

### Gestión de ejes de integridad (`/admin/integrity-domains`)

- CRUD completo.
- Campos: nombre, slug, descripción, pregunta guía, icono, color, orden, activo/inactivo.

### Gestión de identificadores (`/admin/identifiers`)

- CRUD completo.
- Campos: nombre, slug, descripción, orden, activo/inactivo.
- Ejemplos: NIT, NOG, SNIP, DPI, número de contrato, código de proyecto.

### Gestión de evaluaciones (`/admin/assessments`)

- Listado de datasets con su evaluación de madurez y utilidad anticorrupción.
- Registrar o editar puntajes (0-100) para:
  - 9 dimensiones de madurez (acceso, reutilización, actualización, cobertura, calidad, documentación, identificadores, interoperabilidad, gobernanza)
  - 5 dimensiones de utilidad anticorrupción (prevención, detección, investigación, control social, trazabilidad)
- Campos: evaluador, fecha de evaluación, notas.
- Cálculo automático de puntajes totales (madurez y anticorrupción).

### Gestión de historias con datos (`/admin/data-stories`)

- CRUD completo.
- Campos: título, slug, resumen, contenido, imagen de portada, autor, fecha de publicación, publicado, destacado, orden.

### Gestión de la agenda de apertura (`/admin/opening-agenda`)

- CRUD completo.
- Campos: información faltante, situación actual, institución, nivel de prioridad (crítica, alta, media, baja), recomendación, porcentaje de avance, orden, publicado.
- Vinculación opcional a un dataset existente.

### Gestión de casos de uso (`/admin/use-cases`)

- CRUD completo.
- Campos: título, slug, descripción, metodología, resultados, enlaces (lista de etiqueta + URL), publicado, orden.
- Vinculación a datasets del catálogo.

### Gestión de recursos (`/admin/resources`)

- Gestión de recursos asociados a datasets.
- Tipos: archivo, portal, API, dashboard, documento.
- Campos: nombre, descripción, tipo, formato, URL, tamaño, MIME, última actualización, activo, orden.

### Feedback ciudadano (`/admin/feedback`)

- Listado de reportes enviados por los ciudadanos desde las fichas de dataset.
- Filtros por estado (nuevo, en revisión, resuelto, descartado) y tipo.
- Campos de cada reporte: nombre, email, tipo, comentario, dataset relacionado, estado, respuesta.
- Responder y cambiar estado de los reportes.

### Importación masiva (`/admin/import`)

- Carga de datasets desde archivos (CSV/JSON).
- Mapeo de campos del archivo a las columnas de la base de datos.
- Vista previa antes de importar.

### Configuración del portal (`/admin/settings`)

- Edición de textos y parámetros generales del portal:
  - Título del portal
  - Subtítulo
  - Texto del hero
  - Placeholder del buscador
  - Aviso de integridad
  - Email de contacto
  - Textos descriptivos de secciones
- Almacenamiento como pares clave-valor en la tabla `settings`.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| React 18 + TypeScript | Framework frontend |
| Vite 5 | Bundler y servidor de desarrollo |
| React Router 6 | Enrutamiento del lado del cliente |
| Tailwind CSS 3 | Estilos y diseño responsivo |
| Lucide React | Iconografía |
| Supabase (PostgreSQL) | Base de datos, autenticación y seguridad por filas (RLS) |

---

## Estructura del proyecto

```
project/
├── index.html                  # HTML raíz, metadatos SEO y Open Graph
├── package.json                # Dependencias y scripts
├── vite.config.ts              # Configuración de Vite (alias @/ → src/)
├── tailwind.config.js          # Tema personalizado (colores cnc, teal, fuente Inter)
├── tsconfig.app.json           # Configuración de TypeScript
├── src/
│   ├── main.tsx                # Punto de entrada de React
│   ├── App.tsx                 # Definición de rutas públicas y administrativas
│   ├── index.css               # Estilos globales de Tailwind
│   ├── types/
│   │   └── index.ts            # Interfaces TypeScript de todas las entidades
│   ├── lib/
│   │   ├── supabase.ts         # Cliente de Supabase
│   │   ├── constants.ts        # Niveles de apertura, dimensiones de evaluación, tipos de recursos, prioridades
│   │   └── utils.ts            # Utilidades generales (formatDate, cn, etc.)
│   ├── context/
│   │   └── AuthContext.tsx     # Proveedor de autenticación (sesión, perfil, roles)
│   ├── hooks/
│   │   └── usePortalData.ts    # Hook que carga configuración, categorías, instituciones, ejes, etc.
│   ├── components/
│   │   ├── Header.tsx          # Encabezado con navegación y buscador
│   │   ├── Footer.tsx          # Pie de página
│   │   ├── DatasetCard.tsx     # Tarjeta de conjunto de datos
│   │   ├── StatusBadge.tsx     # Insignia de estado de disponibilidad
│   │   ├── DynamicIcon.tsx     # Renderiza iconos Lucide dinámicamente por nombre
│   │   └── admin/
│   │       ├── AdminLayout.tsx # Layout del panel administrativo (sidebar + header)
│   │       └── IconPicker.tsx  # Selector visual de iconos
│   └── pages/
│       ├── public/             # Páginas del portal público
│       │   ├── HomePage.tsx
│       │   ├── ExplorePage.tsx
│       │   ├── DatasetDetailPage.tsx
│       │   ├── MapaDatosPage.tsx
│       │   ├── MetodologiaPage.tsx
│       │   ├── HistoriasPage.tsx
│       │   ├── HistoriaDetailPage.tsx
│       │   ├── BrechasPage.tsx
│       │   ├── UseCasesPage.tsx
│       │   └── AboutPage.tsx
│       └── admin/              # Páginas del panel administrativo
│           ├── AdminLoginPage.tsx
│           ├── AdminDashboardPage.tsx
│           ├── AdminDatasetsListPage.tsx
│           ├── AdminDatasetEditPage.tsx
│           ├── AdminCategoriesPage.tsx
│           ├── AdminInstitutionsPage.tsx
│           ├── AdminStatusesPage.tsx
│           ├── AdminTagsPage.tsx
│           ├── AdminUseCasesPage.tsx
│           ├── AdminResourcesPage.tsx
│           ├── AdminSettingsPage.tsx
│           ├── AdminImportPage.tsx
│           ├── AdminIntegrityDomainsPage.tsx
│           ├── AdminDataStoriesPage.tsx
│           ├── AdminFeedbackPage.tsx
│           ├── AdminOpeningAgendaPage.tsx
│           ├── AdminIdentifiersPage.tsx
│           └── AdminAssessmentsPage.tsx
└── supabase/
    └── migrations/             # Migraciones SQL de la base de datos
        ├── 001_create_schema.sql
        ├── 002_seed_data.sql
        ├── 003_update_pida_analysis.sql
        ├── 004_integrity_platform_schema.sql
        └── 005_integrity_platform_seeds.sql
```

---

## Componentes principales

### `Header.tsx`
Encabezado del portal con logo, navegación principal (Inicio, Explorar, Mapa de datos, Metodología, Historias, Agenda, Acerca) y acceso al panel administrativo.

### `Footer.tsx`
Pie de página con información de contacto, enlaces y créditos.

### `DatasetCard.tsx`
Tarjeta reutilizable que muestra el nombre, descripción corta, icono, categoría, institución, insignia de estado y nivel de apertura de un dataset.

### `StatusBadge.tsx`
Insignia de color que representa el estado de disponibilidad de un dataset (brecha, parcial, disponible, abierto).

### `DynamicIcon.tsx`
Componente que recibe el nombre de un icono de Lucide React y lo renderiza dinámicamente. Soporta iconos personalizados por URL.

### `AdminLayout.tsx`
Layout del panel administrativo con barra lateral de navegación, encabezado con información del usuario y área de contenido.

### `AuthContext.tsx`
Proveedor de contexto que gestiona la sesión de Supabase Auth, carga el perfil del usuario con su rol y expone las funciones `signIn` y `signOut`.

### `usePortalData.ts`
Hook personalizado que carga en una sola llamada los datos globales del portal: configuración, categorías, tipos, estados, instituciones, etiquetas, ejes de integridad, rutas de investigación e identificadores.

---

## Base de datos

El proyecto usa **Supabase** (PostgreSQL gestionado) con **Row Level Security (RLS)** habilitado en todas las tablas.

### Tablas principales

| Tabla | Descripción |
|---|---|
| `profiles` | Perfiles de usuario con rol (vinculados a `auth.users`) |
| `datasets` | Conjuntos de datos con metadatos completos, nivel de apertura y valores anticorrupción |
| `categories` | Categorías anticorrupción (individuos, recursos públicos, regulación, etc.) |
| `dataset_types` | Tipos de conjunto (contratos, presupuesto, auditorías, etc.) |
| `statuses` | Estados de disponibilidad con color e icono |
| `institutions` | Instituciones públicas responsables |
| `tags` | Etiquetas para clasificar datasets |
| `pida_topics` | Temas del PIDA (Plan Integral de Datos Abiertos, 30 conjuntos OEA) |
| `resources` | Recursos asociados a cada dataset (archivos, APIs, portales, dashboards, documentos) |
| `use_cases` | Casos de uso que muestran cómo combinar datasets |
| `integrity_domains` | Ejes de integridad (Personas y poder, Empresas y vínculos, etc.) |
| `research_paths` | Accesos rápidos de investigación en la home |
| `dataset_questions` | Preguntas que cada dataset permite responder |
| `dataset_relationships` | Relaciones de cruce entre datasets con campo de unión |
| `identifiers` | Identificadores de interoperabilidad (NIT, NOG, SNIP, etc.) |
| `dataset_assessments` | Evaluación de madurez (9 dimensiones) y utilidad anticorrupción (5 dimensiones) |
| `data_stories` | Historias con datos (análisis publicados) |
| `opening_agenda` | Agenda de apertura priorizada con progreso |
| `dataset_feedback` | Reportes ciudadanos sobre datasets |
| `investigations` | Preguntas de investigación que agrupan datasets |
| `settings` | Configuración general del portal (clave-valor) |
| `audit_logs` | Historial de cambios en el panel administrativo |
| `files` | Metadata de archivos subidos |

### Tablas de relación (N:M)

- `dataset_tags` — datasets ↔ tags
- `dataset_pida_relations` — datasets ↔ pida_topics
- `dataset_integrity_domains` — datasets ↔ integrity_domains
- `dataset_identifiers` — datasets ↔ identifiers
- `use_case_datasets` — use_cases ↔ datasets
- `investigation_datasets` — investigations ↔ datasets
- `data_story_datasets` — data_stories ↔ datasets

### Seguridad (RLS)

- **Lectura pública**: las tablas de contenido publicable son legibles por roles `anon` y `authenticated` (datos publicados).
- **Escritura administrativa**: las operaciones de creación, edición y eliminación requieren rol `authenticated`.
- **Feedback ciudadano**: inserción pública; lectura y gestión solo para `authenticated`.

### Niveles de apertura

| Nivel | Etiqueta | Descripción |
|---|---|---|
| 0 | Brecha | No se ha identificado un conjunto abierto y estructurado |
| 1–2 | Parcial | Información incompleta o en formatos poco reutilizables |
| 3 | Disponible | Existe información pública pero puede requerir consulta mediante plataforma |
| 4–5 | Abierto | Información estructurada y reutilizable en formatos abiertos |

### Dimensiones de evaluación de madurez

| Dimensión | Descripción |
|---|---|
| Acceso efectivo | ¿El ciudadano puede acceder sin barreras? |
| Reutilización | ¿Está disponible en CSV, JSON, XLSX, API u otro formato estructurado? |
| Actualización | ¿La información se actualiza con una frecuencia apropiada? |
| Cobertura | ¿Incluye el universo relevante? |
| Calidad y consistencia | ¿Los campos están completos y normalizados? |
| Documentación | ¿Existe diccionario de datos y metodología? |
| Identificadores | ¿Tiene identificadores que permitan conectar bases? |
| Interoperabilidad | ¿Puede combinarse con otros datos públicos? |
| Gobernanza | ¿Existe una institución responsable y reglas claras de actualización? |

### Dimensiones de utilidad anticorrupción

| Dimensión | Descripción |
|---|---|
| Prevención | Utilidad para prevenir riesgos de corrupción |
| Detección | Utilidad para detectar anomalías o señales de alerta |
| Investigación | Utilidad para investigar casos o patrones |
| Control social | Utilidad para el control ciudadano y la rendición de cuentas |
| Trazabilidad del gasto | Utilidad para rastrear el flujo de recursos públicos |

---

## Instalación y configuración

### Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Un proyecto de Supabase con las migraciones aplicadas

### Pasos

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd project
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear un archivo `.env` en la raíz del proyecto con:

   ```env
   VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
   VITE_SUPABASE_ANON_KEY=<tu-anon-key>
   ```

   Estos valores se obtienen desde el panel de Supabase: **Settings → API**.

4. **Aplicar las migraciones de base de datos**

   Las migraciones están en `supabase/migrations/`. Deben aplicarse en orden en el editor SQL de Supabase:

   1. `001_create_schema.sql` — Esquema base (tablas, RLS, índices, triggers)
   2. `002_seed_data.sql` — Datos iniciales (categorías, tipos, estados, instituciones, datasets)
   3. `003_update_pida_analysis.sql` — Análisis PIDA actualizado
   4. `004_integrity_platform_schema.sql` — Tablas de la plataforma de integridad
   5. `005_integrity_platform_seeds.sql` — Datos iniciales de la plataforma de integridad

5. **Crear un usuario administrador**

   Desde el panel de Supabase: **Authentication → Users → Add user**, crear un usuario con email y contraseña. Al iniciar sesión por primera vez en `/admin/login`, se creará automáticamente un perfil con rol `super_admin`.

6. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

   El portal estará disponible en `http://localhost:5173`.

7. **Construir para producción**

   ```bash
   npm run build
   ```

   Los archivos generados se ubican en `dist/`.

---

## Cómo replicar

Para replicar este proyecto desde cero en un nuevo entorno:

1. **Crear un proyecto en Supabase** desde [supabase.com](https://supabase.com). Anotar la URL del proyecto y la anon key.

2. **Crear el archivo `.env`** con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

3. **Aplicar las 5 migraciones** en orden desde el editor SQL de Supabase (Dashboard → SQL Editor). Cada migración es idempotente (usa `IF NOT EXISTS` y `DROP POLICY IF EXISTS`).

4. **Verificar que RLS esté activo** en todas las tablas. Todas las migraciones incluyen `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`.

5. **Crear un usuario administrador** desde Authentication → Users. Al iniciar sesión se generará el perfil automáticamente.

6. **Instalar dependencias y ejecutar**:

   ```bash
   npm install
   npm run dev
   ```

7. **Personalizar el contenido** desde el panel administrativo (`/admin`):
   - Editar los textos del portal en **Configuración**.
   - Crear o importar conjuntos de datos en **Datasets**.
   - Configurar categorías, instituciones, estados, etiquetas, ejes de integridad e identificadores.
   - Publicar historias con datos, casos de uso y la agenda de apertura.

8. **Desplegar** el sitio construido (`npm run build`) en cualquier hosting estático (Vercel, Netlify, Cloudflare Pages, etc.). El archivo `dist/_redirects` ya incluye la regla para SPA routing.

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo (Vite) |
| `npm run build` | Construye la aplicación para producción en `dist/` |
| `npm run preview` | Previsualiza la build de producción localmente |
| `npm run typecheck` | Verifica tipos con TypeScript (`tsc --noEmit`) |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |
