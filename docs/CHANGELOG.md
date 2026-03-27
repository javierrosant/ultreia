# Changelog interno

## 2026-03-27

### Hecho

- Se unifico el header de home, contacto y paginas legales para que usen exactamente la misma estructura visual.
- Se extrajo el header completo a `partials/header.html`.
- Se anadio `js/layout.js` para cargar parciales reutilizables desde los HTML.
- `js/main.js` ahora espera a que el layout compartido exista antes de inicializar menus y previews.
- `index.html`, `pages/contacto.html`, `pages/privacidad.html` y `pages/terminos.html` pasaron a consumir el header compartido.
- Las paginas internas cargan tambien `css/mobile.css` para reutilizar el mismo comportamiento responsive del header.
- Se mantuvieron los cambios previos de menu, cookies, mobile y previews.

### Motivo

Antes, el header de la home y el de las paginas internas estaban desacoplados.
Eso obligaba a tocar varios HTML cada vez que cambiaba navegacion, orden, enlaces o menu movil.

Con el parcial compartido:
- el header se cambia en un solo archivo
- todas las paginas heredan el cambio
- se reduce el riesgo de divergencias entre home e internas

### Pendiente razonable

- Si la web sigue creciendo, valorar extraer tambien el footer a un parcial compartido.
