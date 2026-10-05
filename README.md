# CNC Guatemala — Plataforma Nacional de Datos para la Integridad

Portal web para centralizar, clasificar y facilitar el acceso a conjuntos de datos públicos útiles para prevenir, detectar, investigar y analizar riesgos de corrupción en Guatemala. Desarrollado para la Comisión Nacional contra la Corrupción (CNC).

---

## Tabla de contenidos

1. [Resumen de la plataforma](#resumen-de-la-plataforma)
2. [Funcionalidades del portal público](#funcionalidades-del-portal-público)
3. [Tecnologías](#tecnologías)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Fuente de datos (CSV)](#fuente-de-datos-csv)
6. [Instalación y configuración](#instalación-y-configuración)
7. [Cómo actualizar los datos](#cómo-actualizar-los-datos)
8. [Despliegue](#despliegue)
9. [Scripts disponibles](#scripts-disponibles)

---

## Resumen de la plataforma

La plataforma es un **sitio estático** que muestra un catálogo de conjuntos de datos públicos relevantes para la integridad y la lucha contra la corrupción en Guatemala. Toda la información se carga desde **archivos CSV** incluidos en el proyecto; no utiliza base de datos ni servidor backend.

Los visitantes pueden explorar el catálogo, filtrar por categoría e institución, consultar fichas detalladas, visualizar el mapa de datos y entender la metodología de evaluación.

---

## Funcionalidades del portal público

### Página de inicio (`/`)

- **Hero con buscador integrado**: fotografía de fondo de Guatemala, título y subtítulo, y un buscador que redirige a la página de exploración.
- **Accesos rápidos de investigación** ("¿Qué quieres analizar?"): tarjetas que enlazan a rutas de investigación concretas.
- **Indicadores nacionales**: seis tarjetas con métricas calculadas desde los datos (total de datasets, datos abiertos, brechas, instituciones conectadas, etc.).
- **Ejes de integridad**: tarjetas que organizan los datos según la pregunta que el usuario quiere responder.
- **Datos destacados**: conjuntos marcados como destacados, mostrados como tarjetas.
- **Estándares internacionales**: vista previa de los marcos globales que guían la publicación de datos.
- **Casos de uso**: sección con enlace a la página de casos de uso.

### Explorar datos (`/explorar`)

- **Búsqueda por texto libre** en nombre, descripción corta y descripción larga.
- **Filtros combinables**: categoría, tipo de conjunto, estado de disponibilidad, institución y valor anticorrupción.
- **Persistencia de filtros en URL**: los filtros se reflejan en los parámetros de búsqueda para compartir o marcar.
- **Descarga del inventario**: exportación de los resultados filtrados en formato CSV o JSON.
- **Tarjetas de dataset**: cada resultado muestra icono, nombre, descripción, categoría, institución, insignia de estado y nivel de apertura.

### Ficha de dataset (`/datasets/:slug`)

- **Encabezado** con icono, categoría, título, descripción, insignia de estado e institución responsable.
- **Situación en Guatemala**: observaciones sobre la disponibilidad del dato en el país, marco normativo y evaluación.
- **Recursos del conjunto**: lista de enlaces a portales, APIs, documentos y descargas.
- **Datos técnicos**: cobertura geográfica, cobertura temporal, frecuencia, licencia, disponibilidad de API.
- **Barra lateral** con estado de disponibilidad, nivel de apertura, institución responsable, valores anticorrupción y etiquetas.
- **Conjuntos relacionados**: datasets de la misma categoría.

### Mapa de Datos (`/mapa-datos`)

Visualización interactiva con nodos que representan datasets y ejes de integridad, y un panel lateral que muestra detalles al seleccionar un nodo.

### Metodología (`/metodologia`)

Explica cómo se evalúan los datos: niveles de apertura, dimensiones de madurez, dimensiones de utilidad anticorrupción, matriz madurez vs. utilidad, y criterios para identificar brechas.

### Brechas (`/brechas`)

Tabla con los conjuntos de datos que tienen nivel de apertura 0 (brechas), mostrando nombre, observaciones y categoría.

### Casos de uso (`/casos-de-uso`)

Página que muestra ejemplos prácticos de cómo utilizar los datos (actualmente sin casos publicados).

### Acerca del portal (`/acerca`)

Propósito del portal, características y información de contacto.

### Estándares (`/estandares`)

Marcos internacionales que guían la publicación de datos para la integridad (Open Data Charter, PIDA, CoST, Open Contracting, Open Ownership, Fiscal Transparency).

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| React 18 + TypeScript | Framework frontend |
| Vite 5 | Bundler y servidor de desarrollo |
| React Router 6 | Enrutamiento del lado del cliente |
| Tailwind CSS 3 | Estilos y diseño responsivo |
| Lucide React | Iconografía |

No se utiliza base de datos, backend ni variables de entorno. Toda la información proviene de archivos CSV estáticos.

---

## Estructura del proyecto

```
project/
├── index.html                  # HTML raíz, metadatos SEO y Open Graph
├── package.json                # Dependencias y scripts
├── vite.config.ts              # Configuración de Vite (alias @/ → src/)
├── tailwind.config.js          # Tema personalizado (colores cnc, fuente Inter)
├── public/
│   ├── gob-guatemala-blanco.svg  # Logo del gobierno
│   └── data/                   # Archivos CSV con toda la información del portal
│       ├── datasets.csv        # Conjuntos de datos (30 registros)
│       ├── resources.csv       # Recursos asociados a cada dataset
│       ├── dataset_tags.csv    # Relación datasets ↔ etiquetas
│       ├── categories.csv      # Categorías anticorrupción
│       ├── dataset_types.csv   # Tipos de conjunto
│       ├── statuses.csv        # Estados de disponibilidad
│       ├── institutions.csv    # Instituciones públicas
│       ├── tags.csv            # Etiquetas
│       ├── integrity_domains.csv  # Ejes de integridad
│       ├── research_paths.csv  # Accesos rápidos de investigación
│       ├── identifiers.csv     # Identificadores de interoperabilidad
│       └── settings.csv        # Textos y configuración del portal
├── src/
│   ├── main.tsx                # Punto de entrada de React
│   ├── App.tsx                 # Definición de rutas públicas
│   ├── index.css               # Estilos globales de Tailwind
│   ├── types/
│   │   └── index.ts            # Interfaces TypeScript de las entidades
│   ├── lib/
│   │   ├── csv.ts              # Parser y utilidades para leer CSV
│   │   ├── dataService.ts      # Carga y transforma los CSV en objetos tipados
│   │   ├── constants.ts        # Niveles de apertura, dimensiones de evaluación
│   │   └── utils.ts            # Utilidades (formatDate, slugify, cn)
│   ├── hooks/
│   │   └── usePortalData.ts    # Hook que carga todos los datos desde CSV
│   ├── components/
│   │   ├── Header.tsx          # Encabezado con navegación y buscador
│   │   ├── Footer.tsx          # Pie de página
│   │   ├── DatasetCard.tsx     # Tarjeta de conjunto de datos
│   │   ├── StatusBadge.tsx     # Insignia de estado de disponibilidad
│   │   └── DynamicIcon.tsx     # Renderiza iconos Lucide por nombre
│   └── pages/
│       └── public/             # Páginas del portal
│           ├── HomePage.tsx
│           ├── ExplorePage.tsx
│           ├── DatasetDetailPage.tsx
│           ├── MapaDatosPage.tsx
│           ├── MetodologiaPage.tsx
│           ├── HistoriasPage.tsx
│           ├── HistoriaDetailPage.tsx
│           ├── BrechasPage.tsx
│           ├── UseCasesPage.tsx
│           ├── AboutPage.tsx
│           └── EstandaresPage.tsx
```

---

## Fuente de datos (CSV)

Toda la información del portal se almacena en archivos CSV dentro de `public/data/`. Al cargar el sitio, estos archivos se descargan y se transforman en objetos JavaScript para alimentar los componentes.

### Archivos CSV

| Archivo | Contenido | Columnas principales |
|---|---|---|
| `datasets.csv` | Conjuntos de datos del portal | slug, name, description, category_slug, status_slug, institution_slug, openness_level, featured, ... |
| `resources.csv` | Recursos de cada dataset (portales, APIs, documentos) | dataset_slug, name, type, format, url |
| `dataset_tags.csv` | Relación entre datasets y etiquetas | dataset_slug, tag_name, tag_slug |
| `categories.csv` | Categorías anticorrupción | name, slug, icon_name, color |
| `dataset_types.csv` | Tipos de conjunto (registro, transacción, divulgación) | name, slug, icon_name |
| `statuses.csv` | Estados de disponibilidad con color e icono | name, slug, color, icon_name |
| `institutions.csv` | Instituciones públicas responsables | name, slug, acronym, website |
| `tags.csv` | Etiquetas para clasificar datasets | name, slug |
| `integrity_domains.csv` | Ejes de integridad | name, slug, question, icon_name, color |
| `research_paths.csv` | Accesos rápidos en la página de inicio | title, description, icon_name, destination_url |
| `identifiers.csv` | Identificadores de interoperabilidad (NIT, NOG, SNIP, etc.) | name, slug, description |
| `settings.csv` | Textos y configuración del portal (título, subtítulo, contacto) | key, value |

### Cómo funciona la carga

1. El hook `usePortalData` se ejecuta al montar la aplicación.
2. El servicio `dataService.ts` descarga todos los archivos CSV desde `/data/`.
3. El parser `csv.ts` convierte el texto CSV en filas de objetos.
4. `dataService.ts` transforma esas filas en objetos tipados (con relaciones entre datasets, categorías, estados, etc.).
5. Los datos se almacenan en el estado de React y se distribuyen a todos los componentes.

---

## Instalación y configuración

### Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

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

3. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

   El portal estará disponible en `http://localhost:5173`.

No se requiere configurar variables de entorno, base de datos ni ningún servicio externo. El sitio funciona completamente de forma autónoma.

---

## Cómo actualizar los datos

Para actualizar, agregar o eliminar información del portal, simplemente edita los archivos CSV en `public/data/`:

- **Agregar un nuevo dataset**: añade una fila al final de `datasets.csv` con todos los campos. Si tiene recursos o etiquetas, añade también las filas correspondientes en `resources.csv` y `dataset_tags.csv`.
- **Editar un dataset existente**: modifica la fila correspondiente en `datasets.csv`.
- **Eliminar un dataset**: elimina la fila de `datasets.csv` y las filas relacionadas en `resources.csv` y `dataset_tags.csv`.
- **Cambiar textos del portal**: edita los valores en `settings.csv`.
- **Agregar categorías, instituciones o estados**: añade filas en el CSV correspondiente.

Al recargar el sitio, los cambios se reflejan automáticamente. No es necesario reiniciar el servidor ni ejecutar comandos adicionales.

### Formato de los CSV

- Los campos de texto que contienen comas deben estar entre comillas dobles (`"..."`).
- Los valores booleanos se escriben como `true` o `false`.
- Los campos vacíos se dejan en blanco (o como cadena vacía).
- La primera fila de cada archivo es el encabezado con los nombres de las columnas.

---

## Despliegue

El sitio es estático y puede desplegarse en cualquier hosting de archivos estáticos.

1. **Construir el sitio**

   ```bash
   npm run build
   ```

   Los archivos generados se ubican en `dist/`. Los CSV de `public/data/` se copian automáticamente a `dist/data/`.

2. **Desplegar**

   Sube el contenido de `dist/` a cualquier hosting estático:

   - **Vercel**: `vercel --prod`
   - **Netlify**: arrastra la carpeta `dist/` o conecta el repositorio
   - **Cloudflare Pages**: conecta el repositorio y configura `npm run build` como comando de build
   - **GitHub Pages**: publica el contenido de `dist/` en la rama `gh-pages`

   El archivo `dist/_redirects` incluye la regla necesaria para que el enrutamiento del lado del cliente funcione correctamente (SPA fallback).

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo (Vite) |
| `npm run build` | Construye la aplicación para producción en `dist/` |
| `npm run preview` | Previsualiza la build de producción localmente |
| `npm run typecheck` | Verifica tipos con TypeScript (`tsc --noEmit`) |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |
