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
- Se reorganizó el menú principal al orden:
  - Eventos
  - Conciertos
  - Festival
  - Management
  - Booking y Ticketing
- `Agenda` dejó de ser dropdown y pasó a ser enlace externo junto a `Contacto`, abriendo en pestaña nueva.
- Se añadió una estructura provisional para el nuevo bloque `Conciertos` en desktop y móvil.
- `Management` pasó a tener una estructura de tres columnas:
  - texto + artistas a la izquierda,
  - servicios en la columna central,
  - preview dinámico a la derecha con imagen para artistas y texto explicativo para servicios.
- Se actualizó la interacción del header:
  - el área activa de cada item ocupa todo el bloque vertical del nav,
  - desaparece la línea inferior de hover,
  - el item activo queda en blanco y el resto se atenúan.
- Se ajustó el banner de cookies:
  - texto en dos líneas,
  - `Aceptar` alineado abajo a la derecha,
  - caja más ancha.
- Se sustituyeron los placeholders de `Eventos` por nombres reales en públicos y privados.
- Se formatearon los años de `Eventos Públicos` como texto pequeño en superíndice.
- `Conciertos` pasó a mostrar casos reales con preview de imagen.
- Se conectaron imágenes reales para:
  - `Guillan - Sala Siroco`
  - `Sobrezero - Sala Siroco`
  - `Manussian - Sala Moby Dick`
- Se actualizó el vídeo de fondo para usar `images/Video_de_fondo.mp4` en home y contacto.
- `.vercel/` se ignora en git para no versionar el enlace local con Vercel.

### Estado especial

- El banner de cookies está en modo maqueta:
  - siempre visible,
  - `Aceptar` no persiste estado.

### Riesgos conocidos

- Hay problemas de codificación de caracteres en algunos archivos existentes.
- No hay pipeline de validación ni tests automáticos.
