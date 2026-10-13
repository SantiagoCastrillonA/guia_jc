import { TutorialSimulado, type Paso, type Ruta } from '../../components/visuals/TutorialSimulado';
import styles from './TutorialVite.module.css';

/*
 * Tutorial de la sesión 16: crear el proyecto de React con Vite, por dos
 * caminos. En el navegador (StackBlitz, `vite.new/react`: lo de la clase,
 * sin instalar nada) o en el computador (`npm create vite`, Node y VS Code).
 * El motor y el marco están en `TutorialSimulado`; aquí van los pasos, las
 * pantallas simuladas y su aspecto (TutorialVite.module.css).
 *
 * El código sigue los nombres del resto de la sesión: la carpeta de los
 * componentes es `src/componentes/`.
 */

/* ── plantillas de pantalla ─────────────────────────────────────────────── */

const L = (s: string) => `<span class="l">${s || ' '}</span>`;

/** El App.jsx con el que arranca la plantilla de Vite. */
const CODIGO_PLANTILLA = [
  `<span class="k1">import</span> { useState } <span class="k1">from</span> <span class="s1">'react'</span>`,
  `<span class="k1">import</span> <span class="s1">'./App.css'</span>`,
  ``,
  `<span class="k1">function</span> <span class="f1">App</span>() {`,
  `  <span class="k1">const</span> [count, setCount] = <span class="f1">useState</span>(<span class="a1">0</span>)`,
  ``,
  `  <span class="k1">return</span> (`,
  `    <span class="t1">&lt;&gt;</span>`,
  `      <span class="t1">&lt;h1&gt;</span><span id="h1txt">Vite + React</span><span class="t1">&lt;/h1&gt;</span>`,
  `      <span class="t1">&lt;button</span> <span class="a1">onClick</span>={() =&gt; <span class="f1">setCount</span>(count + <span class="a1">1</span>)}<span class="t1">&gt;</span>`,
  `        count is {count}`,
  `      <span class="t1">&lt;/button&gt;</span>`,
  `    <span class="t1">&lt;/&gt;</span>`,
  `  )`,
  `}`,
  ``,
  `<span class="k1">export default</span> App`,
]
  .map(L)
  .join('');

/** El "Código 1" de la lección: el mismo que se muestra bajo el tutorial. */
const CODIGO_1 = [
  `<span class="k1">import</span> <span class="s1">'./App.css'</span>;`,
  ``,
  `<span class="k1">function</span> <span class="f1">App</span>() {`,
  `  <span class="k1">return</span> (`,
  `    <span class="t1">&lt;main&gt;</span>`,
  `      <span class="t1">&lt;h1&gt;</span>Dulce Horno<span class="t1">&lt;/h1&gt;</span>`,
  `      <span class="t1">&lt;p&gt;</span>Repostería artesanal en Medellín<span class="t1">&lt;/p&gt;</span>`,
  `    <span class="t1">&lt;/main&gt;</span>`,
  `  );`,
  `}`,
  ``,
  `<span class="k1">export default</span> App;`,
]
  .map(L)
  .join('');

interface OpcionesArchivo {
  dir?: boolean;
  sel?: boolean;
  id?: string;
  oculto?: boolean;
  nivel?: number;
}
/** Una fila del explorador de archivos. */
const F = (nombre: string, o: OpcionesArchivo = {}) =>
  `<div class="f${o.dir ? ' dir' : ''}${o.sel ? ' sel' : ''}"${o.id ? ` id="${o.id}"` : ''}${o.oculto ? ' hidden' : ''} style="padding-left:${6 + (o.nivel ?? 0) * 12}px">${o.dir ? '▾ ' : ''}${nombre}</div>`;

const archivosSB = (extra = '', appSel = false) => `<div class="hd">FILES</div>
  ${F('public', { dir: true })}
  ${F('src', { dir: true, id: 'f-src' })}
  ${extra}
  ${F('assets', { dir: true, nivel: 1 })}
  ${F('App.css', { nivel: 1 })}
  ${F('App.jsx', { nivel: 1, id: 'f-app', sel: appSel })}
  ${F('index.css', { nivel: 1 })}
  ${F('main.jsx', { nivel: 1 })}
  ${F('.gitignore')}${F('index.html')}${F('package.json')}${F('vite.config.js')}`;

const VISTA_PLANTILLA = `<div class="pc" id="prev-old"><h3>Vite + React</h3><div class="vbtn" id="cnt">count is 0</div><p>Edit src/App.jsx and save to test HMR</p></div>`;
const VISTA_TIENDA = (oculta: boolean) =>
  `<div class="pc light" id="prev-new"${oculta ? ' hidden' : ''}><h3>Dulce Horno</h3><p>Repostería artesanal en Medellín</p></div>`;

const stackblitz = ({ archivos, codigo, vista, extra = '' }: { archivos: string; codigo: string; vista: string; extra?: string }) => `<div class="ed" id="sb">
  <div class="ed-top"><b>vitejs-vite-k3x9</b><span>· StackBlitz</span><span class="ed-btn" id="b-sign">Sign in</span><span class="ed-btn" id="b-menu">⋯</span></div>
  <div class="ed-main">
    <div class="files" id="f-pane">${archivos}</div>
    <div class="code" id="code"><div class="tabh"><span>App.jsx</span></div>${codigo}</div>
    <div class="prev" id="prev"><div class="pb">localhost:5173</div>${vista}</div>
  </div>${extra}</div>`;

const navegadorEscribe = (cuerpo: string) =>
  `<div class="br"><div class="br-bar"><div class="br-dots"><i></i><i></i><i></i></div><div class="in" id="url"><span class="v" data-ph="Busca o escribe una dirección"></span><span class="caret"></span></div></div><div class="br-body">${cuerpo}</div></div>`;
const navegador = (url: string, cuerpo: string) =>
  `<div class="br"><div class="br-bar"><div class="br-dots"><i></i><i></i><i></i></div><div class="url">${url.startsWith('localhost') ? 'http://' : 'https://'}<b>${url}</b></div></div><div class="br-body">${cuerpo}</div></div>`;

/* El prompt va en un atributo entre comillas: ahí `>` no necesita escaparse,
   y el motor lo pone como texto, así que tampoco debe venir escapado. */
const P_INICIO = 'PS C:\\Users\\laura\\proyectos> ';
const P_APP = 'PS C:\\Users\\laura\\proyectos\\mi-tienda-react> ';
const terminal = (id: string, prompt: string, antes = '') =>
  `<div class="term"><div class="term-bar"><span class="br-dots"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></span><span class="tt">Terminal</span></div><div class="term-body" id="${id}" data-prompt="${prompt}">${antes}</div></div>`;
const lineaAnterior = (prompt: string, cmd: string, salida = '') =>
  `<div><span class="pr">${prompt.replace('>', '&gt;')}</span>${cmd}</div>${salida ? `<div class="ou">${salida}</div>` : ''}`;

const archivosVS = (appSel: boolean) => `<div class="hd">MI-TIENDA-REACT</div>
  ${F('node_modules', { dir: true })}
  ${F('public', { dir: true })}
  ${F('src', { dir: true })}
  ${F('assets', { dir: true, nivel: 1 })}
  ${F('App.css', { nivel: 1 })}
  ${F('App.jsx', { nivel: 1, id: 'v-app', sel: appSel })}
  ${F('index.css', { nivel: 1 })}
  ${F('main.jsx', { nivel: 1, id: 'v-main' })}
  ${F('.gitignore')}${F('eslint.config.js')}${F('index.html', { id: 'v-index' })}${F('package.json')}${F('README.md')}${F('vite.config.js')}`;
const vscode = ({ codigo, derecha = '', appSel = false }: { codigo: string; derecha?: string; appSel?: boolean }) => `<div class="ed">
  <div class="ed-top" style="justify-content:center"><span>mi-tienda-react — Visual Studio Code</span></div>
  <div class="ed-main"><div class="act"><i></i><i></i><i></i></div>
    <div class="files" id="f-pane" style="width:180px">${archivosVS(appSel)}</div>
    <div class="code" id="code"><div class="tabh"><span>App.jsx</span></div><div class="body">${codigo}</div></div>${derecha}</div></div>`;

/* ── en el navegador (StackBlitz) ───────────────────────────────────────── */

const NAVEGADOR: Paso[] = [
  {
    nombre: 'Abre vite.new/react',
    etiqueta: 'navegador · vite.new/react',
    titulo: 'Abre un proyecto nuevo en el navegador',
    cuerpo: [
      "Abre <span class='ui'>Chrome</span> o <span class='ui'>Edge</span> en una ventana normal (no incógnito).",
      'En la barra de direcciones escribe <code>vite.new/react</code> y presiona Enter.',
      'Espera unos segundos: StackBlitz prepara el proyecto e instala todo por ti.',
    ],
    nota: ['info', 'Sin instalar nada', 'Todo corre dentro del navegador. Por eso no necesitas Node.js ni VS Code para empezar.'],
    pantalla: () =>
      navegadorEscribe(`<div class="newtab" id="newtab"><b>Nueva pestaña</b>Escribe una dirección arriba</div>
    <div class="boot" id="boot" hidden><div class="spin"></div><div>Booting WebContainer…</div><div class="tenue">Installing dependencies</div></div>
    <div id="sbw" hidden>${stackblitz({ archivos: archivosSB(), codigo: `<div class="body">${CODIGO_PLANTILLA}</div>`, vista: VISTA_PLANTILLA })}</div>`),
    acciones: [
      ['type', '#url', 'vite.new/react'],
      ['key', 'Enter'],
      ['hide', '#newtab'],
      ['show', '#boot'],
      ['wait', 1700],
      ['hide', '#boot'],
      ['show', '#sbw'],
    ],
  },
  {
    nombre: 'Conoce la pantalla',
    etiqueta: 'StackBlitz · vitejs-vite',
    titulo: 'Las tres zonas de la pantalla',
    cuerpo: [
      '<b>Izquierda:</b> los archivos del proyecto.',
      '<b>Centro:</b> el código del archivo que abriste.',
      '<b>Derecha:</b> la página funcionando, como la vería un cliente.',
    ],
    nota: [
      'tip',
      'El archivo de hoy',
      'Casi todo lo haremos en <code>src/App.jsx</code> y en la carpeta <code>src/componentes</code> que vamos a crear.',
    ],
    pantalla: () =>
      stackblitz({
        archivos: archivosSB(),
        codigo: `<div class="body">${CODIGO_PLANTILLA}</div>`,
        vista: VISTA_PLANTILLA,
        extra: `<div class="co" id="co1" hidden style="left:20px;top:44px">1 · Archivos</div><div class="co" id="co2" hidden style="left:300px;top:44px">2 · Código</div><div class="co" id="co3" hidden style="left:690px;top:44px">3 · La página</div>`,
      }),
    acciones: [
      ['add', '#f-pane', 'spot'],
      ['show', '#co1'],
      ['move', '#f-pane'],
      ['wait', 900],
      ['rm', '#f-pane', 'spot'],
      ['add', '#code', 'spot'],
      ['show', '#co2'],
      ['move', '#code'],
      ['wait', 900],
      ['rm', '#code', 'spot'],
      ['add', '#prev', 'spot'],
      ['show', '#co3'],
      ['move', '#prev'],
      ['wait', 1000],
      ['rm', '#prev', 'spot'],
    ],
  },
  {
    nombre: 'Prueba el ejemplo',
    etiqueta: 'StackBlitz · vitejs-vite',
    titulo: 'Haz clic en el botón del ejemplo',
    cuerpo: ["En la página de la derecha haz clic en <span class='ui'>count is 0</span>.", 'Cada clic suma 1.'],
    nota: [
      'tip',
      'Guarda esta pregunta',
      '¿Cómo sabe la página que tiene que cambiar el número? Eso es el <b>state</b>, y lo explica la lección 4.',
    ],
    pantalla: () => stackblitz({ archivos: archivosSB(), codigo: `<div class="body">${CODIGO_PLANTILLA}</div>`, vista: VISTA_PLANTILLA }),
    acciones: [
      ['click', '#cnt'],
      ['text', '#cnt', 'count is 1'],
      ['click', '#cnt'],
      ['text', '#cnt', 'count is 2'],
      ['click', '#cnt'],
      ['text', '#cnt', 'count is 3'],
    ],
  },
  {
    nombre: 'Empieza de cero',
    etiqueta: 'StackBlitz · src/App.jsx',
    titulo: 'Reemplaza App.jsx por el Código 1',
    cuerpo: [
      'Abre <code>src/App.jsx</code>.',
      "Selecciona todo con <span class='ui'>Ctrl + A</span> y pega el Código 1 (está justo debajo de este tutorial).",
      'Borra también el contenido de <code>App.css</code>.',
      "Guarda con <span class='ui'>Ctrl + S</span>: la página de la derecha cambia sola.",
    ],
    nota: ['warn', 'Si la página no cambia', 'Casi siempre es porque no guardaste. Ctrl + S después de cada cambio.'],
    pantalla: () =>
      stackblitz({
        archivos: archivosSB(),
        codigo: `<div class="body" id="code-old">${CODIGO_PLANTILLA}</div><div class="body" id="code-new" hidden>${CODIGO_1}</div>`,
        vista: VISTA_PLANTILLA + VISTA_TIENDA(true),
      }),
    acciones: [
      ['click', '#f-app'],
      ['add', '#f-app', 'sel'],
      ['click', '#code'],
      ['key', 'Ctrl + A'],
      ['add', '#code', 'selall'],
      ['wait', 500],
      ['key', 'Ctrl + V'],
      ['hide', '#code-old'],
      ['rm', '#code', 'selall'],
      ['show', '#code-new'],
      ['wait', 600],
      ['key', 'Ctrl + S'],
      ['hide', '#prev-old'],
      ['show', '#prev-new'],
      ['add', '#prev-new', 'flash'],
    ],
  },
  {
    nombre: 'Crea componentes/',
    etiqueta: 'StackBlitz · archivos',
    titulo: 'Crea la carpeta componentes y tu primer archivo',
    cuerpo: [
      "Clic derecho en <code>src</code> → <span class='ui'>New Folder</span> → escribe <code>componentes</code>.",
      "Clic derecho en <code>componentes</code> → <span class='ui'>New File</span> → escribe <code>Encabezado.jsx</code>.",
      'Ojo: <b>E mayúscula</b>, como todo componente.',
    ],
    nota: [
      'info',
      '¿Por qué una carpeta?',
      'Para tener cada pieza de la página en su propio archivo. La carpeta no viene en el proyecto: la creas tú.',
    ],
    pantalla: () =>
      stackblitz({
        archivos: archivosSB(
          `<div class="f in-row" id="nf" hidden style="padding-left:18px">▾ <span class="v"></span><span class="caret"></span></div>${F('componentes', { dir: true, nivel: 1, id: 'f-comp', oculto: true })}<div class="f in-row" id="nfile" hidden style="padding-left:30px"><span class="v"></span><span class="caret"></span></div>${F('Encabezado.jsx', { nivel: 2, id: 'f-enc', oculto: true })}`,
          true,
        ),
        codigo: `<div class="body">${CODIGO_1}</div>`,
        vista: VISTA_TIENDA(false),
        extra: `<div class="ctx" id="ctx1" hidden style="left:70px;top:88px"><div>New File</div><div id="ctx1-folder">New Folder</div><div>Rename</div></div><div class="ctx" id="ctx2" hidden style="left:90px;top:112px"><div id="ctx2-file">New File</div><div>New Folder</div><div>Rename</div></div>`,
      }),
    acciones: [
      ['click', '#f-src'],
      ['show', '#ctx1'],
      ['move', '#ctx1-folder'],
      ['add', '#ctx1-folder', 'hv'],
      ['click', '#ctx1-folder'],
      ['hide', '#ctx1'],
      ['show', '#nf'],
      ['typeplain', '#nf .v', 'componentes'],
      ['key', 'Enter'],
      ['hide', '#nf'],
      ['show', '#f-comp'],
      ['wait', 300],
      ['click', '#f-comp'],
      ['show', '#ctx2'],
      ['move', '#ctx2-file'],
      ['add', '#ctx2-file', 'hv'],
      ['click', '#ctx2-file'],
      ['hide', '#ctx2'],
      ['show', '#nfile'],
      ['typeplain', '#nfile .v', 'Encabezado.jsx'],
      ['key', 'Enter'],
      ['hide', '#nfile'],
      ['show', '#f-enc'],
      ['add', '#f-enc', 'sel'],
    ],
  },
  {
    nombre: 'Guarda tu proyecto',
    etiqueta: 'StackBlitz · guardar',
    titulo: 'Antes de cerrar, guarda tu proyecto',
    cuerpo: [
      "<b>Con cuenta:</b> haz clic en <span class='ui'>Sign in</span> e inicia sesión con GitHub. El proyecto queda guardado en tu cuenta.",
      "<b>Sin cuenta:</b> abre el menú <span class='ui'>⋯</span> y elige <span class='ui'>Download Project</span> para bajar un <code>.zip</code>.",
      'Guarda el enlace o el <code>.zip</code> donde lo encuentres para la próxima clase.',
    ],
    nota: [
      'warn',
      'Si cierras la pestaña sin guardar',
      'El proyecto se puede perder. Tendrías que rehacerlo con el Código 1 de esta lección.',
    ],
    pantalla: () =>
      stackblitz({
        archivos: archivosSB(`${F('componentes', { dir: true, nivel: 1 })}${F('Encabezado.jsx', { nivel: 2 })}`),
        codigo: `<div class="body">${CODIGO_1}</div>`,
        vista: VISTA_TIENDA(false),
        extra: `<div class="modal-bg" id="modal" hidden><div class="mcard"><span class="mx" id="modal-x">×</span><h4>Sign in to StackBlitz</h4><p>Guarda tus proyectos y ábrelos desde cualquier computador.</p><div class="mbtn" id="gh">Sign in with GitHub</div></div></div>
      <div class="menu" id="menu" hidden><div id="m-dl">Download Project</div><div>Share</div><div>Settings</div></div>
      <div class="dl" id="dl" hidden><span class="fileic">ZIP</span><span>vitejs-vite-k3x9.zip</span><span class="tenue" style="margin-left:auto">Descarga completa</span></div>`,
      }),
    acciones: [
      ['click', '#b-sign'],
      ['show', '#modal'],
      ['move', '#gh'],
      ['wait', 1000],
      ['click', '#modal-x'],
      ['hide', '#modal'],
      ['click', '#b-menu'],
      ['show', '#menu'],
      ['move', '#m-dl'],
      ['add', '#m-dl', 'hv'],
      ['click', '#m-dl'],
      ['hide', '#menu'],
      ['show', '#dl'],
    ],
  },
];

/* ── en el computador (Vite local) ──────────────────────────────────────── */

const COMPUTADOR: Paso[] = [
  {
    nombre: 'Verifica Node.js',
    etiqueta: 'Terminal',
    titulo: 'Revisa tu versión de Node.js',
    cuerpo: [
      'Abre una terminal (en Windows, PowerShell o la terminal de VS Code; en Mac, Terminal).',
      'Escribe <code>node -v</code> y presiona Enter.',
      'Necesitas la versión <b>20.19</b> o más nueva (o <b>22.12</b> o más nueva).',
    ],
    nota: [
      'warn',
      'Si tu versión es más vieja',
      'Descarga la versión LTS desde <code>nodejs.org</code> e instálala. Vite no arranca con versiones antiguas de Node.',
    ],
    pantalla: () => terminal('tm', P_INICIO),
    acciones: [['cmd', '#tm', 'node -v', 'v22.12.0']],
  },
  {
    nombre: 'Crea el proyecto',
    etiqueta: 'Terminal',
    titulo: 'Crea el proyecto con Vite',
    cuerpo: [
      'Escribe <code>npm create vite@latest mi-tienda-react -- --template react</code>',
      '<code>mi-tienda-react</code> es el nombre de la carpeta: puedes usar el de tu emprendimiento, en minúsculas y con guiones.',
      '<code>--template react</code> elige React con JavaScript sin pasar por el menú.',
    ],
    nota: [
      'info',
      'Si te hace alguna pregunta',
      'Según la versión, la terminal puede preguntar algo extra. Acepta la opción por defecto con Enter. Si un tutorial dice <code>npx create-react-app</code>, está viejo: esa herramienta está descontinuada.',
    ],
    pantalla: () => terminal('tm', P_INICIO, lineaAnterior(P_INICIO, 'node -v', 'v22.12.0')),
    acciones: [
      [
        'cmd',
        '#tm',
        'npm create vite@latest mi-tienda-react -- --template react',
        '\nScaffolding project in C:\\Users\\laura\\proyectos\\mi-tienda-react...\n\nDone. Now run:\n\n  cd mi-tienda-react\n  npm install\n  npm run dev',
      ],
    ],
  },
  {
    nombre: 'Instala las dependencias',
    etiqueta: 'Terminal',
    titulo: 'Entra a la carpeta e instala',
    cuerpo: [
      'Entra a la carpeta: <code>cd mi-tienda-react</code>',
      'Instala lo que el proyecto necesita: <code>npm install</code>',
      'Se crea la carpeta <code>node_modules</code>. Igual que en Node: no se toca ni se sube a GitHub.',
    ],
    nota: ['tip', '¿Qué instala?', 'React, ReactDOM y Vite, según lo que dice el <code>package.json</code>. Tarda un poco la primera vez.'],
    pantalla: () => terminal('tm', P_INICIO),
    acciones: [
      ['cmd', '#tm', 'cd mi-tienda-react', ''],
      ['prompt', '#tm', P_APP],
      ['cmd', '#tm', 'npm install', '\nadded 152 packages, and audited 153 packages in 14s\n\nfound <g>0</g> vulnerabilities'],
    ],
  },
  {
    nombre: 'Arranca el servidor',
    etiqueta: 'Terminal',
    titulo: 'Arranca el servidor de desarrollo',
    cuerpo: [
      'Escribe <code>npm run dev</code>',
      "Busca la línea <span class='ui'>Local</span>: tu página está en <code>http://localhost:5173</code>.",
      'Deja esta terminal abierta mientras trabajas.',
    ],
    nota: ['tip', 'Para detenerlo', "<span class='ui'>Ctrl + C</span> en la terminal, igual que con tu servidor de Express."],
    pantalla: () => terminal('tm', P_APP),
    acciones: [
      [
        'cmd',
        '#tm',
        'npm run dev',
        '\n  <g>VITE</g> ready in 412 ms\n\n  >  Local:   <u>http://localhost:5173/</u>\n  >  Network: use --host to expose\n  >  press h + enter to show help',
      ],
    ],
  },
  {
    nombre: 'Ábrelo en el navegador',
    etiqueta: 'navegador · localhost:5173',
    titulo: 'Mira tu proyecto en el navegador',
    cuerpo: [
      'Abre <code>http://localhost:5173</code> en el navegador.',
      'Verás la página de ejemplo de Vite + React.',
      "Haz clic en <span class='ui'>count is 0</span>: el número sube.",
    ],
    nota: [
      'info',
      '¿Qué es localhost:5173?',
      '<code>localhost</code> es tu propio computador y <code>5173</code> es el puerto que usa Vite. Solo tú ves esta página.',
    ],
    pantalla: () =>
      navegador(
        'localhost:5173',
        `<div class="vpage"><div class="logos"><i></i><i></i></div><h2>Vite + React</h2><div class="vbtn" id="cnt">count is 0</div><small>Edit src/App.jsx and save to test HMR</small></div>`,
      ),
    acciones: [
      ['click', '#cnt'],
      ['text', '#cnt', 'count is 1'],
      ['click', '#cnt'],
      ['text', '#cnt', 'count is 2'],
      ['click', '#cnt'],
      ['text', '#cnt', 'count is 3'],
    ],
  },
  {
    nombre: 'Ábrelo en VS Code',
    etiqueta: 'Visual Studio Code',
    titulo: 'Abre la carpeta en VS Code',
    cuerpo: [
      "En VS Code: <span class='ui'>File → Open Folder</span> y elige <code>mi-tienda-react</code>.",
      '<code>src/App.jsx</code>: el componente principal. Aquí trabajas.',
      '<code>src/main.jsx</code>: conecta React con la página. No se toca.',
      '<code>index.html</code>: la única página HTML. Tampoco se toca.',
    ],
    nota: [
      'tip',
      'El resto',
      '<code>package.json</code> tiene los scripts (<code>npm run dev</code>) y <code>node_modules</code> las dependencias. Lo demás es configuración.',
    ],
    pantalla: () =>
      vscode({ codigo: CODIGO_PLANTILLA }) +
      `<div class="co" id="co-a" hidden style="left:222px;top:178px">← aquí trabajas</div><div class="co" id="co-m" hidden style="left:222px;top:224px">← no se toca</div><div class="co" id="co-i" hidden style="left:222px;top:293px">← no se toca</div>`,
    acciones: [
      ['move', '#v-app'],
      ['add', '#v-app', 'spot'],
      ['show', '#co-a'],
      ['wait', 800],
      ['move', '#v-main'],
      ['add', '#v-main', 'spot'],
      ['show', '#co-m'],
      ['wait', 800],
      ['move', '#v-index'],
      ['add', '#v-index', 'spot'],
      ['show', '#co-i'],
      ['wait', 800],
    ],
  },
  {
    nombre: 'Edita y guarda',
    etiqueta: 'VS Code + navegador',
    titulo: 'Cambia un texto y mira la magia',
    cuerpo: [
      'En <code>App.jsx</code> cambia <code>Vite + React</code> por el nombre de tu emprendimiento.',
      "Guarda con <span class='ui'>Ctrl + S</span>.",
      'El navegador se actualiza solo, sin recargar la página.',
    ],
    nota: [
      'info',
      'Punto de control',
      'Si ves tu nombre en el navegador, tu proyecto local está listo. Desde aquí los pasos son los mismos que en StackBlitz.',
    ],
    pantalla: () =>
      vscode({
        codigo: CODIGO_PLANTILLA,
        appSel: true,
        derecha: `<div class="prev" style="width:230px"><div class="pb">localhost:5173</div><div class="pc"><h3 id="ph1">Vite + React</h3><div class="vbtn">count is 0</div></div></div>`,
      }),
    acciones: [
      ['move', '#h1txt'],
      ['add', '#h1txt', 'hl'],
      ['wait', 600],
      ['text', '#h1txt', ''],
      ['typeplain', '#h1txt', 'Dulce Horno'],
      ['key', 'Ctrl + S'],
      ['rm', '#h1txt', 'hl'],
      ['text', '#ph1', 'Dulce Horno'],
      ['add', '#ph1', 'flash'],
    ],
  },
];

/* Fuera del componente para que no cambien en cada render: el efecto de la
   animación depende de ellas. */
const RUTAS: readonly Ruta[] = [
  { id: 'nav', nombre: 'En el navegador', detalle: '6 pasos · vite.new/react · el de la clase', pasos: NAVEGADOR },
  { id: 'pc', nombre: 'En tu computador', detalle: '7 pasos · npm create vite', pasos: COMPUTADOR },
];

/** Crear el proyecto de React con Vite: en StackBlitz o en el computador. */
export function CrearProyectoVite() {
  return (
    <TutorialSimulado
      prompt="sesion16 --tutorial vite"
      titulo="Crea tu proyecto de React con Vite"
      rutas={RUTAS}
      etiquetaRutas="Dónde crear el proyecto"
      mensajeFin="¡Proyecto listo!"
      clasePantalla={styles.pantallas}
      acento="var(--color-react)"
    />
  );
}
