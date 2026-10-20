# Pro-Dog Estética Canina — sitio web

Landing estática (HTML + CSS + JS, sin build) para Pro-Dog, estética canina en Tijuana.

## Estructura

```
index.html     página completa
styles.css     estilos (paleta tomada del logo)
main.js        burbujas, calculadora de precios, galería, revelados
_headers       caché de assets para Cloudflare Pages
robots.txt
assets/        logo recortado, fotos en WebP, favicon, imagen para compartir (og.jpg)
```

## Subir a GitHub

```bash
cd pro-dog
git init
git add .
git commit -m "Sitio Pro-Dog"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/pro-dog.git
git push -u origin main
```

## Desplegar en Cloudflare Pages

1. Cloudflare → Workers & Pages → Create → Pages → Connect to Git.
2. Elige el repo `pro-dog`.
3. Framework preset: **None**. Build command: *(vacío)*. Build output directory: `/`.
4. Deploy. Queda en `pro-dog.pages.dev`; luego se conecta el dominio en Custom domains.

## Antes de entregar al cliente

- **Horario:** Google solo muestra "cierra 6 pm" y "abre sábados y domingos". Confirmar hora de apertura y días.
- **Facebook:** el enlace del footer busca la página; reemplazarlo por la URL real.
- **Crédito:** en el footer, poner la URL de Línea Frontera en el enlace del crédito (`href="#"`).
- **Imagen OG:** para que la vista previa en WhatsApp funcione al 100%, cambiar `assets/og.jpg` en las meta etiquetas por la URL absoluta (ej. `https://prodog.mx/assets/og.jpg`).
- **Reseñas:** son 3 reseñas reales de Google con sus respuestas; si llegan más, se agregan copiando un bloque `<article class="msg">`.

## Qué tiene

- Burbujas flotando en el hero que se revientan al tocarlas.
- Letrero redondo que "se cuelga" al cargar, como el de la pared del local.
- Patito nadando sobre el agua animada.
- Calculadora de precios por tamaño y servicio, con botón de WhatsApp que manda el mensaje ya armado ("quiero agendar baño y corte para perro mediano").
- Galería tipo fotos pegadas con cinta, con vista ampliada.
- Reseñas de Google con respuestas del dueño.
- Mapa + botones de Google Maps, Waze, Apple Maps y llamar.
- Barra fija en celular con WhatsApp y Cómo llegar.
- Respeta "reducir movimiento" del sistema; accesible por teclado.
