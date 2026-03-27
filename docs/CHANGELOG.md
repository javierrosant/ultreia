# Changelog interno

## 2026-03-27

Refactor de estructura y mantenimiento sin cambiar la intención visual general.

### Hecho

- Se unificó el header con el dropdown desktop para que se perciban como un único bloque visual.
- Se eliminó la línea y la capa diferenciada del header en páginas internas.
- Se alineó el texto principal de la home con la tercera columna del layout.
- Se retiró el CTA `Contacta` del footer de la home.
- Se movieron medidas repetidas a `css/variables.css`.
- Se simplificó `js/main.js` separando:
  - menú desktop,
  - previews de imágenes,
  - banner de cookies,
  - menú móvil.
- Se documentó la arquitectura del proyecto en `docs/ARCHITECTURE.md`.

### Estado especial

- El banner de cookies está en modo maqueta:
  - siempre visible,
  - `Aceptar` no persiste estado.

### Riesgos conocidos

- Hay problemas de codificación de caracteres en algunos archivos existentes.
- No hay pipeline de validación ni tests automáticos.
