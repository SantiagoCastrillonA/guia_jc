# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es esto

Guía interactiva (React + TypeScript + Vite) para el curso de Desarrollo Web
de Jóvenes creaTIvos: 25 sesiones, cada una con explicación, diagramas y
ejercicios interactivos. Backend en Express + MongoDB para cuentas y progreso.
En producción: https://jovenescreativos.duckdns.org — cada push a `main` se despliega
solo (ver [deploy/README.md](deploy/README.md)).

## Comandos

Frontend (raíz del repo):

```bash
npm run dev      # servidor de desarrollo (vite, proxy /api -> :3000)
npm run build    # typecheck (tsc -b) + build de producción
npm run lint     # oxlint
npm run preview  # sirve el build de producción
```

Backend (`server/`, package.json propio):

```bash
npm run dev      # node --watch server.js, espera Mongo en 127.0.0.1:27017
npm start
```

No hay suite de tests configurada en ninguno de los dos paquetes.

## Arquitectura del frontend

**El registro central es `src/data/topics.ts`.** Es la única fuente de verdad
sobre qué sesiones existen: de ahí salen las rutas (`src/router.tsx`), las
tarjetas de la home, el contador de ejercicios y las barras de progreso. Un
tema con `published: false` aparece como "Próximamente" y no genera ruta.
Publicar un tema nuevo es: crear `src/topics/<slug>/index.tsx` (usa
`TopicPage` + `Lesson`/`Exercises` de `components/TopicPage.tsx`) y agregar su
entrada al registro con carga diferida (`lazy(() => import(...))`). No hay
nada más que tocar — no se listan rutas ni tarjetas a mano en ningún otro
sitio.

Cada tema vive en su propia carpeta bajo `src/topics/`; las demos
interactivas propias de un tema (si las tiene) van en un `Demos.tsx` dentro de
esa misma carpeta.

Primitivas de ejercicio reutilizables en `src/components/exercises/`: `Quiz`,
`PredictOutput`, `OrderSteps`, `TrueFalse`, `MultiSelect`, `FillBlank`,
`MatchPairs`, `CodeBlock`, y la base `ExerciseShell`/`Feedback` para armar un
tipo nuevo. Cada ejercicio necesita un `id` único **dentro de su tema**: es la
clave con la que se guarda el progreso.

Material gráfico reutilizable en `src/components/visuals/`: `Figure`,
`Steps`/`Step`, `Callout`, `Compare`, `RefTable`, `Terminal`.

Avisos flotantes (`src/lib/avisos.tsx`): envoltura sobre `sileo`. El
`<AvisosToaster />` se monta una sola vez en `main.tsx` y todos los mensajes
salen del objeto
`avisar` — así el tono y los colores viven en un solo sitio. Se disparan al
completar una sesión (`progress.tsx`), al aparecer una sesión nueva desde la
última visita (`topicVisibility.tsx`) y en cada acción del panel de admin.

Progreso y sesión (`src/lib/progress.tsx`, `src/lib/auth.tsx`): con sesión
activa el progreso se guarda en el servidor; sin sesión, en `localStorage`.
`src/lib/api.ts` es el único cliente HTTP — todo va al mismo origen
(`/api/...`), la sesión viaja en cookie httpOnly.

## Arquitectura del backend (`server/`)

Express + Mongoose, un solo proceso escuchando en `127.0.0.1` (nginx hace de
proxy/TLS delante). Piezas en `server/src/`:

- `models.js` — `User` (username/passwordHash con bcrypt, role `student`/`admin`) y `Progress` (un doc por usuario, un array de entradas `{topicSlug, exerciseId}`).
- `auth.js` — `loadUser` middleware, sesión por JWT en cookie.
- `routes.js` — API de cuentas, progreso y panel de admin.
- `deploy.js` — webhook de autodeploy (ver abajo).

`server.js` monta helmet, guarda el body crudo en `req.rawBody` (necesario
para verificar la firma HMAC del webhook de GitHub, que se calcula sobre los
bytes exactos) y nunca filtra el stack de error al cliente.

## Reglas de diseño y movimiento

- Todo color, tipografía, radio y sombra sale de las variables de
  `src/styles/nocturne.css` (sistema de diseño Nocturne). No se escriben hex
  ni px sueltos.
- El acento (`#9184d9`) se usa como línea y como brillo, nunca como relleno
  grande. La única superficie saturada es la banda de cifras de la home.
- Curvas y duraciones salen de `src/lib/motion.ts` y de los tokens `--ease-*`
  / `--dur-*`. Nada de UI por encima de 300 ms.
- Toda animación respeta `prefers-reduced-motion`; los efectos de `:hover`
  están limitados a punteros finos.

## Autodeploy — la trampa a conocer

El endpoint `POST /api/deploy` (`server/src/deploy.js`) autentica por firma
HMAC de GitHub, no por sesión, y **solo escribe una señal en disco**
(`/run/guia-jc/deploy.request`). El servicio `guia-jc-api` corre con
`NoNewPrivileges=true`, así que no puede escalar privilegios él mismo — no
puede hacer `sudo`. Una `systemd.path` observa la señal y dispara el
redespliegue como root en su propio servicio. Si se rompe esa cadena
(el `.path`/`.service` de systemd), el síntoma es engañoso: GitHub recibe 202
del webhook y todo parece ir bien, pero no pasa nada en el servidor. Ver
[deploy/README.md](deploy/README.md) para la lista completa de piezas y cómo
diagnosticar el último despliegue.

Los secretos (`DEPLOY_SECRET`, JWT, `.env` en general) viven **solo en el
servidor** (`/srv/guia-jc-api/.env`), nunca en el repo.
