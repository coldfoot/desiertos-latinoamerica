# Desiertos de Noticias Locales

## Estructura del Proyecto

### Archivos Principales

```
desiertos-latinoamerica/
├── index.html                 # Página principal con storytelling
├── dashboard/
│   ├── index.html            # Mapa interactivo principal
│   ├── script-dash.js        # Lógica del dashboard
│   └── informe-regional.html # Texto del informe regional
├── static/                   # Páginas estáticas por ubicación
│   ├── argentina/
│   ├── chile/
│   ├── colombia/
│   ├── mexico/
│   └── peru/
├── creditos/
│   └── index.html           # Página de créditos del proyecto
├── conclusiones/
│   └── index.html           # Página de conclusiones del estudio
├── recomendaciones/
│   └── index.html           # Página de recomendaciones
├── metodologia/
│   └── index.html           # Página de metodología del estudio
├── data.json                 # DATOS PRINCIPALES (8.2MB)
├── classes.js               # Clases JavaScript
├── script.js                # Script principal
├── viz.js                   # Visualizaciones
└── style.css                # Estilos CSS

```

## Flujo de Datos

### 1. Fuente Principal: `data.json`

**Contenido:** Todos los datos cuantitativos y cualitativos del estudio.

**Estructura:**
```json
{
  "argentina": {
    "country": [
      {
        "BASIC_INFO": {
          "AREA": 2796427,
          "CLASSIFICATION_COUNTS": {
            "BOSQUE": 48,
            "DESIERTO": 241,
            "SEMIBOSQUE": 110,
            "SEMIDESIERTO": 161
          },
          "CLASSIFICATION_PCT": {
            "BOSQUE": 0.086,
            "DESIERTO": 0.43,
            "SEMIBOSQUE": 0.196,
            "SEMIDESIERTO": 0.287
          },
          "JOURNALIST_COUNT": 17337.0,
          "LARGE_UNIT_COUNT": 28,
          "LEVEL": "country",
          "NAME": "Argentina",
          "NEWS_ORG_COUNT": 3048,
          "POPULATION": 46044703
        }
      }
    ],
    "large_units": [...],  // Provincias/estados
    "small_units": [...]   // Municipios/comunas
  }
}
```

**Datos que contiene:**
- Estadísticas por país, provincia y municipio
- Clasificaciones de ecosistemas informativos
- Conteos de periodistas y medios
- Información demográfica
- Datos de población y área
- El texto de los informes de nível província (o ciudad, para Colombia) y país
- Datos acerca de los medios en cada unidad: amenazas, funetes de financiación, temas de cobertura, etc.

### 2. Contenido Estático: Páginas HTML

**Ubicación:** `static/[pais]/[provincia]/index.html`

**Contenido:** Páginas estáticas de informes narrativos específicos por ubicación. Usadas para compartir con meta tags correctas.

**Ejemplo de estructura:**
```html
<h2 class="static-page-place-name">Salta</h2>
<h4 class="chapeu-relato">Informe | 
    <span class="chapeu-relato-author">Emiliano Venier</span>
</h4>
<h3 data-relato-modal-campo="TITLE">
    El ecosistema mediático crece y se diversifica, pero con menos periodistas
</h3>
<div data-relato-modal-campo="MEDIO">
    <p class="medio">El proyecto periodístico predominante en Salta es la estación de radio...</p>
</div>
<div data-relato-modal-campo="RELATO" class="relato-modal-content">
    <p class="relato">La provincia de Salta se encuentra en el noroeste argentino...</p>
</div>
```

**Datos que contiene:**
- Títulos de informes
- Autores
- Resúmenes ejecutivos
- Narrativas completas
- Imágenes de mapas estáticos

### 3. Contenido de Páginas Secundarias

**Ubicaciones:**
- `metodologia/index.html`
- `conclusiones/index.html`
- `recomendaciones/index.html`
- `creditos/index.html`

**Contenido:** Texto estático sobre metodología, conclusiones, recomendaciones y créditos del proyecto.

## Arquitectura JavaScript

### 1. `classes.js` - Clases Principales

**CountriesEvents:** Maneja eventos del mapa (hover, click, popups)
**Country:** Clase base para cada país con métodos específicos
**Argentina, Chile, Colombia, Mexico, Peru:** Clases específicas por país

### 2. `dashboard/script-dash.js` - Lógica del Dashboard

**Funcionalidades:**
- Manejo de estado del mapa
- Filtros por tipo de paisaje informativo
- Navegación por breadcrumbs
- Integración con URL parameters
- Renderizado de datos dinámicos

### 3. `script.js` - Script Principal

**Funcionalidades:**
- Storytelling de la página principal
- Navegación entre slides
- Manejo de eventos de país

### 4. `viz.js` - Visualizaciones

**Funcionalidades:**
- Gráficos y visualizaciones de datos
- Integración con D3.js

## Mapeo de Datos

### Datos de `data.json` → Visualización

1. **Clasificaciones:** Se mapean a colores en el mapa
   - DESIERTO → `#bc5006`
   - SEMIDESIERTO → `#dab28d`
   - SEMIBOSQUE → `#e4d25d`
   - BOSQUE → `#395300`

2. **Estadísticas:** Las básicas se muestran en paneles informativos, y las demás en visualizaciones de datos en d3.js

3. **Geografía:** Se renderiza en el mapa de Mapbox
   - Coordenadas y geometrías
   - Nombres de ubicaciones

### Datos Estáticos → Páginas

1. **Narrativas:** Se cargan desde HTML estático
2. **Imágenes:** Mapas PNG generados previamente

## Mantenimiento y Actualizaciones

### Para Actualizar Datos Cuantitativos

**Modificar `data.json`:**
   - Actualizar estadísticas
   - Cambiar clasificaciones
   - Agregar nuevas ubicaciones

### Para Actualizar Contenido Narrativo

1. **Páginas estáticas:** Editar HTML directamente
2. **Páginas secundarias:** Modificar archivos en directorios específicos
3. **Imágenes:** Reemplazar archivos PNG en `static/[pais]/[provincia]/map.png`
4. **Informes en el dashboard (excepto informe regional general)**: cambiar HTML en `data.json`
5. **Informe regional**: cambiar directamente en las páginas HTML correspondentes


## Variables de Configuración

### Dashboard Variables (`dashboard/script-dash.js`)
```javascript
const DASHBOARD_CONFIG = {
    defaultCountry: 'argentina',
    defaultView: 'latam',
    mapPadding: 50,
    animationDuration: 500,
    mobileBreakpoint: 768
};

const MAP_CONFIG = {
    center: [-60, -20],
    zoom: 4,
    minZoom: 3,
    maxZoom: 10,
    style: 'mapbox://styles/mapbox/light-v11'
};
```

### CSS Variables (`style.css`)
```css
:root {
    --color-desierto: #bc5006;
    --color-semidesierto: #dab28d;
    --color-semibosque: #e4d25d;
    --color-bosque: #395300;
    --color-accent: #EC722E;
    --color-text: #4c4c4c;
}
```

## Dependencias Externas

- **Mapbox GL JS:** Para mapas interactivos
- **D3.js:** Para visualizaciones de datos
- **Google Fonts:** Para tipografías
- **CDN:** Para librerías JavaScript

## Contactos y Recursos
En caso de dudas, escrivir a Rodrigo Menegat (rodrigo@meneg.at), coordinador de desarollo del proyecto

