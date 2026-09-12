# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es esto

Guía interactiva (React + TypeScript + Vite) para el curso de Desarrollo Web
de Jóvenes creaTIvos: 25 sesiones, cada una con explicación, diagramas y
ejercicios interactivos. Backend en Express + MongoDB para cuentas y progreso.
En producción: https://jovenescreativos.duckdns.org

**Se trabaja en la rama `dev`.** `main` es lo que está publicado: cada push a
`main` sale al aire en unos 15 segundos sin revisión previa (autodeploy, ver
abajo y [deploy/README.md](deploy/README.md)). Por eso el build se corre
*antes* de mezclar a `main`, no después. Detalle del flujo en
[CONTRIBUTING.md](CONTRIBUTING.md). Convención de commits: `feat:` / `fix:` /
`docs:` / `style:` / `refactor:`.

## Comandos

Frontend (raíz del repo):

```bash
npm run dev      # servidor de desarrollo (vite, puerto 5173, proxy /api -> 127.0.0.1:3000)
npm run build    # typecheck (tsc -b) + build de producción — la puerta antes de mezclar a main
npm run lint     # oxlint
npm run preview  # sirve el build de producción
```

Backend (`server/`, package.json propio — hay que hacerle su propio `npm install`):

```bash
npm run dev      # node --watch server.js
npm start
```

El backend necesita un MongoDB local escuchando en `127.0.0.1:27017` y un
`server/.env` (gitignored, nunca en el repo) con `PORT`, `MONGO_URL`,
`JWT_SECRET` (mínimo 32 caracteres o el proceso no arranca), `COOKIE_SECURE` y
`ALLOW_REGISTRATION`.

No hay suite de tests en ninguno de los dos paquetes. Lo único automático es
`.github/workflows/verificar.yml`: corre `lint` + `build` del frontend y un
`node --check` de cada archivo del backend en cada push a `main`/`dev` y en
cada pull request.

## Arquitectura del frontend

**El registro central es `src/data/topics.ts`.** Es la única fuente de verdad
sobre qué sesiones existen: de ahí salen las rutas (`src/router.tsx`), las
tarjetas de la home, el contador de ejercicios y las barras de progreso. Un
tema con `published: false` aparece como "Próximamente" y no genera ruta.
Publicar un tema nuevo es: crear `src/topics/<slug>/index.tsx` (usa
`TopicPage` + `Lesson`/`Exercises` de `components/TopicPage.tsx`) y agregar su
entrada al registro con carga diferida. No hay nada más que tocar — no se
listan rutas ni tarjetas a mano en ningún otro sitio.

Cada tema vive en su propia carpeta bajo `src/topics/`; las demos
interactivas propias de un tema (si las tiene) van en un `Demos.tsx` dentro de
esa misma carpeta.

Las rutas usan el `lazy` de react-router (no `React.lazy`), a través de
`rutaLazy` / `loadTopicRoute` de `src/lib/lazyRoute.ts`: reintenta un
`import()` fallido y, si el fallo parece un chunk viejo tras un deploy,
recarga la página una sola vez para traer el `index` nuevo. Rutas que no son
temas: `/entrar` (login), `/admin`, `/recursos`.

Primitivas de ejercicio reutilizables en `src/components/exercises/` (todas se
exportan desde `index.ts`): `Quiz`, `PredictOutput`, `OrderSteps`, `TrueFalse`,
`MultiSelect`, `FillBlank`, `MatchPairs`, `CodeBlock`, y la base
`ExerciseShell`/`Feedback` para armar un tipo nuevo. Cada ejercicio necesita
un `id` único **dentro de su tema**: es la clave con la que se guarda el
progreso.

Material gráfico reutilizable en `src/components/visuals/`: `Figure`,
`Steps`/`Step`, `Callout`, `Compare`, `RefTable`, `Terminal` (todo en
`index.tsx`), más `Snippets` (recetario con estado y portapapeles, en su
propio archivo).

Segundo registro con el mismo patrón: `src/data/recursos.ts` alimenta la
página `/recursos`. Agregar un recurso es agregar una entrada ahí y nada más.

Avisos flotantes (`src/lib/avisos.tsx`): envoltura sobre `sileo`. El
`<AvisosToaster />` se monta una sola vez en `main.tsx` y todos los mensajes
salen del objeto `avisar` — así el tono y los colores viven en un solo sitio.
Se disparan al completar una sesión (`progress.tsx`), al aparecer una sesión
nueva desde la última visita (`topicVisibility.tsx`) y en cada acción del
panel de admin.

Progreso y sesión (`src/lib/progress.tsx`, `src/lib/auth.tsx`): con sesión
activa el progreso se guarda en el servidor; sin sesión, en `localStorage`.
Al iniciar sesión, lo resuelto como anónimo se fusiona con la cuenta y se
limpia el `localStorage`. `src/lib/api.ts` es el único cliente HTTP — todo va
al mismo origen (`/api/...`), la sesión viaja en cookie httpOnly. Los
providers se anidan en `main.tsx`: `AuthProvider` › `TopicVisibilityProvider`
› `ProgressProvider` › router.

La **racha** de días de práctica (`src/lib/racha.ts`) vive **solo en
`localStorage`**: el servidor guarda *qué* ejercicios se resolvieron, no
*cuándo*, así que cambiar de equipo la reinicia.

Tema claro/oscuro en `src/lib/tema.tsx` + `src/styles/temas.css`: patrón de
tres estados — sin elección propia sigue `prefers-color-scheme` sin escribir
en `<html>`; al tocar el botón se fija `data-theme` y se guarda. El primer
valor lo pinta un script inline en `index.html` antes del primer frame, para
que quien eligió claro no vea un fogonazo oscuro.

### Visibilidad y semanas de los temas

`topics.ts` dice qué temas **existen** (`published`); un segundo mecanismo
decide cuáles se **ven ahora** y en qué semana, y se maneja desde `/admin`
**sin deploy**:

- Backend: modelo `TopicSetting` (`server/src/models.js`) — un doc por tema
  solo si alguna vez se tocó; su ausencia significa "disponible". Guarda
  `enabled` y `weekStart`/`weekEnd` como texto `'YYYY-MM-DD'` a propósito (son
  días del calendario del salón, no un instante — un `Date` los correría de
  día según la zona horaria del servidor).
- API: `GET /api/topics/visibility` (público) y `PATCH /api/admin/topics/:slug`
  (admin).
- Frontend: `src/lib/topicVisibility.tsx` consume esa API; `src/lib/semanas.ts`
  calcula la semana por defecto de cada sesión desde una fecha ancla
  (`ANCLA_LUNES` / `ANCLA_SESION`, 2 sesiones por semana). Cualquier fecha
  guardada en el servidor manda sobre ese cálculo.

## Arquitectura del backend (`server/`)

Express + Mongoose, un solo proceso escuchando en `127.0.0.1` (nginx hace de
proxy/TLS delante). Piezas en `server/src/`:

- `models.js` — `User` (username/passwordHash con bcrypt, role
  `student`/`admin`, `active`), `Progress` (un doc por usuario, array de
  entradas `{topicSlug, exerciseId, solvedAt}`; `toMap()` lo devuelve como
  `{slug: [ids]}`) y `TopicSetting` (ver arriba).
- `auth.js` — middleware `loadUser` (nunca falla: solo no autentica),
  `requireAuth` / `requireAdmin`. Sesión por JWT de 7 días en la cookie
  httpOnly `jc_session`.
- `routes.js` — API de cuentas, progreso, visibilidad de temas y panel de
  admin. Toda la entrada se valida con `zod`; login y registro pasan por
  `express-rate-limit` (20 intentos por IP cada 15 min). La **primera cuenta
  registrada queda como `admin`**. `ALLOW_REGISTRATION=false` cierra el
  registro público pero `/admin/users` sigue creando cuentas. Nunca se deja la
  instalación sin un admin activo.
- `deploy.js` — webhook de autodeploy (ver abajo).

`server.js` monta helmet, guarda el body crudo en `req.rawBody` (necesario
para verificar la firma HMAC del webhook de GitHub, que se calcula sobre los
bytes exactos) y nunca filtra el stack de error al cliente.

## Reglas de diseño y movimiento

- Todo color, tipografía, radio y sombra sale de las variables de
  `src/styles/nocturne.css` (sistema de diseño Nocturne). No se escriben hex
  ni px sueltos. Colores de apoyo en `src/styles/layout.css`: `--color-tech`
  (datos y progreso) y `--color-ok` / `--color-off` (encendido/apagado).
- El acento (`#9184d9`) se usa como línea y como brillo, nunca como relleno
  grande. La única superficie saturada es la banda de cifras de la home.
- `src/lib/motion.ts` da tres transiciones —`enter`, `settle`, `springy`— más
  el paso `STAGGER`. Una cuarta necesita una razón. Sus curvas coinciden con
  los tokens `--ease-*` / `--dur-*` de CSS. Nada de UI por encima de 300 ms.
- Toda animación respeta `prefers-reduced-motion`; los efectos de `:hover`
  están limitados a punteros finos. Las entradas desplazan, nunca desvanecen
  (un `opacity: 0` congelado deja el elemento invisible hasta un F5).

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
