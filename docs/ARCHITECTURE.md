# Ultreia Web - Arquitectura

## Resumen

La web es estatica: HTML, CSS y JavaScript vanilla, sin bundler ni framework.

Piezas principales:
- `index.html`
- `pages/contacto.html`
- `pages/privacidad.html`
- `pages/terminos.html`
- `partials/header.html`
- `css/variables.css`
- `css/main.css`
- `css/mobile.css`
- `css/pages.css`
- `js/layout.js`
- `js/main.js`

## Header reutilizable

El header ya no se mantiene duplicado en cada pagina.

La fuente unica de verdad vive en:
- `partials/header.html`

Ese parcial incluye:
- header desktop
- dropdown desktop
- menu movil

Se inyecta en cada pagina mediante:
- `js/layout.js`

Cada HTML usa:
- `<div data-include="/partials/header.html"></div>`

Cuando `js/layout.js` termina de inyectar el parcial, emite:
- `ultreia:layoutready`

`js/main.js` espera ese evento para inicializar el menu cuando el header viene cargado por include.

## CSS

Responsabilidades:
- `css/variables.css`: tokens globales, offsets, alturas, gutters y medidas repetidas
- `css/main.css`: layout compartido, hero, footer, menu desktop, cookies
- `css/mobile.css`: menu movil y ajustes responsive generales
- `css/pages.css`: maquetacion especifica de contacto y legales

Regla de mantenimiento:
- si el cambio afecta al header o a los menus, editar primero `partials/header.html`
- si el cambio afecta a layout compartido, editar primero `css/main.css` o `css/mobile.css`
- usar `css/pages.css` solo para diferencias reales de contenido interno

## JavaScript

### `js/layout.js`

Hace una sola cosa:
- busca nodos con `data-include`
- carga el HTML compartido
- lo inserta en la pagina
- dispara `ultreia:layoutready`

### `js/main.js`

Se encarga de:
- menu desktop
- previews de imagen y texto
- banner de cookies
- menu movil

Bloques funcionales:
1. Menu desktop
2. Previews desktop y mobile
3. Cookies
4. Menu movil

## Menu actual

Orden principal:
- Eventos
- Conciertos
- Festival
- Management
- Booking y Ticketing

Enlaces fijos a la derecha:
- Agenda
- Contacto

`Agenda` abre una web externa en nueva pestaña.

## Convenciones

- Reutilizar variables antes de meter nuevos pixeles hardcodeados
- Mantener el header solo en `partials/header.html`
- Si una lista necesita preview de imagen, usar `data-image-target` o `data-image`
- Si una lista necesita preview de texto, usar `data-preview-target`, `data-preview-mode="detail"` y `data-detail-text`

## Riesgos conocidos

- Siguen existiendo restos de codificacion antigua en algunos archivos y assets heredados
- No hay tests automaticos ni pipeline de validacion
