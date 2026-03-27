# Ultreia Web - Arquitectura y notas de mantenimiento

## Resumen

Este proyecto es una web estática compuesta por HTML, CSS y JavaScript vanilla.
No hay build step, bundler ni framework.

La home usa:
- `index.html` como documento principal.
- `css/variables.css` para tokens globales.
- `css/main.css` para layout y componentes compartidos.
- `css/mobile.css` para el comportamiento responsive y el menú móvil.
- `js/main.js` para navegación desktop, previews de imágenes, banner de cookies y menú móvil.

Las páginas internas usan:
- `pages/contacto.html`
- `pages/privacidad.html`
- `pages/terminos.html`
- `css/pages.css` para diferencias de contenido respecto a la home.

## Decisiones de estructura

### 1. Tokens primero

Los offsets y medidas clave viven en `css/variables.css`.
Esto incluye gutters, alturas de navegación, offsets del hero, límites del menú y medidas del banner de cookies.

Si hay que recolocar elementos globales, tocar primero:
- `--page-gutter`
- `--footer-gutter`
- `--nav-height`
- `--footer-height`
- `--menu-panel-padding-top`
- `--menu-col-gap`
- `--hero-bottom-offset`

### 2. Header y menú como un solo bloque visual

El dropdown desktop parte desde `top: 0` en `menu-overlay`.
El contenido interno del panel compensa con `padding-top` para no quedar tapado por la navegación.

Importante:
- El `nav` queda transparente cuando el menú está abierto.
- El fondo visual real lo pinta `menu-overlay`.
- Si se vuelve a poner fondo al `nav`, reaparece el efecto de "doble capa".

### 3. Alineación del hero

El texto de la home está alineado con el tercer tercio del layout, igual que la columna de imágenes del menú.
No está posicionado "a ojo" con `right`.

Variables implicadas:
- `--layout-width`
- `--layout-third`
- `--layout-third-start`
- `--hero-width`

### 4. Banner de cookies

Ahora mismo el banner está forzado a mostrarse siempre para maquetación.
El botón `Aceptar` no persiste estado a propósito.

Si se quiere reactivar comportamiento real:
- guardar aceptación en `localStorage`,
- arrancar el banner oculto en HTML,
- mostrarlo solo si no existe consentimiento.

## JavaScript

`js/main.js` está dividido en cuatro bloques funcionales:

1. Menú desktop
- gestiona `activeMenuId`,
- mide la altura real del panel abierto,
- abre/cierra overlay,
- sincroniza `aria-expanded`.

2. Previews de imagen
- una función genérica (`bindPreviewList`) conecta listas con contenedores de imagen,
- la misma lógica se reutiliza en desktop y móvil.

3. Banner de cookies
- inicialización mínima,
- modo visible permanente mientras se maqueta.

4. Menú móvil
- apertura/cierre del panel,
- navegación entre nivel 1 y subniveles,
- bloqueo de scroll del `body`.

## Convenciones para seguir trabajando

- Reutilizar variables de `variables.css` antes de introducir nuevos píxeles hardcodeados.
- Si un ajuste afecta a home y páginas internas, intentar resolverlo en `main.css` y no duplicarlo en `pages.css`.
- Mantener `js/main.js` agrupado por responsabilidad; evitar volver a mezclar lógica de desktop, móvil y cookies.
- Si se añade un nuevo panel de menú desktop, usar el patrón existente:
  - botón `.nav__link[data-menu="..."]`
  - panel `#menu-...`
  - listas con `data-image-target`
- Si se añade un nuevo subnivel móvil, usar:
  - item `.mobile-nav-item[data-target="..."]`
  - panel con `id` equivalente
  - listas con `data-image`

## Pendientes razonables

- Corregir la codificación de caracteres en varios HTML y comentarios CSS/JS.
- Decidir si el banner de cookies debe volver a comportamiento real.
- Extraer contenido repetido del menú a una fuente de datos si la web crece.
- Añadir una guía corta de contenido/edición para no tocar HTML a mano sin criterio de estructura.
