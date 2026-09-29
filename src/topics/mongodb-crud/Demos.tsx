import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import styles from './Demos.module.css';

/*
 * Tutorial animado: instalar MongoDB en el computador (Windows y macOS).
 *
 * A la izquierda, una pantalla simulada —el sitio de descarga, el instalador,
 * Compass, la Terminal— sobre un lienzo fijo de 880 × 540 que se escala al
 * ancho disponible, con un cursor que hace cada clic. A la derecha, el paso
 * explicado en texto: la simulación es apoyo, el texto es la instrucción.
 *
 * Las pantallas simuladas son HTML escrito como cadenas y montado con
 * `innerHTML`. Todas las cadenas son constantes de este archivo —ninguna
 * viene de un usuario—, así que no hay nada que escapar. Van en cadenas y no
 * en JSX porque el motor las manipula a mano (escribe letra por letra, marca
 * casillas, mueve el cursor) y eso con React sería re-renderizar a cada letra.
 *
 * Tres clases del marcado simulado se llaman distinto a lo obvio (`s-nav`,
 * `s-card`, `s-radio`): `.nav`, `.card` y `.radio` ya existen en el CSS
 * global del sitio y se colarían dentro de la simulación.
 */

type Accion = readonly [op: string, sel?: string | number, arg?: string, arg2?: string];

interface Paso {
  nombre: string;
  etiqueta: string;
  titulo: string;
  cuerpo: string[];
  nota: readonly [tipo: 'tip' | 'warn' | 'info', titulo: string, texto: string];
  pantalla: () => string;
  acciones: readonly Accion[];
}

/* ── plantillas de pantalla ─────────────────────────────────────────────── */

const campo = (id: string, ph: string) =>
  `<div class="in" id="${id}"><span class="v" data-ph="${ph}"></span><span class="caret"></span></div>`;
const navegador = (url: string, cuerpo: string) =>
  `<div class="br"><div class="br-bar"><div class="br-dots"><i></i><i></i><i></i></div><div class="url">https://<b>${url}</b></div></div><div class="br-body">${cuerpo}</div></div>`;
const aplicacion = (titulo: string, lado: string, contenido: string) =>
  `<div class="app"><div class="app-bar"><div class="br-dots"><i></i><i></i><i></i></div>${titulo}</div><div class="app-main">${lado ? `<div class="side">${lado}</div>` : ''}<div class="content">${contenido}</div></div></div>`;
const escritorio = (dentro: string) =>
  `<div class="desk">${dentro}<div class="taskbar"><span class="start"></span><span class="tb-app"></span><span class="tb-app"></span><span class="clock">5:24 p. m.</span></div></div>`;
const asistente = (dentro: string, idPie?: string) =>
  `<div class="wiz" style="width:600px"><div class="wiz-h">MongoDB 8.3 Setup</div><div class="wiz-b">${dentro}</div><div class="wiz-f"><div class="mbtn sec">Back</div><div class="mbtn pri" id="${idPie || 'w-next'}">Next</div><div class="mbtn sec">Cancel</div></div></div>`;
const terminalMac = (id: string) =>
  `<div class="mac-desk"><div class="term"><div class="term-bar"><div class="br-dots"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></div>Terminal — zsh</div><div class="term-body" id="${id}"></div></div></div>`;

const paginaDescarga = (archivo: string, ext: string) =>
  navegador(
    'mongodb.com/try/download/community',
    `
  <div class="s-nav"><span class="brand">MongoDB</span><span>Products</span><span>Resources</span></div>
  <div style="padding:26px 34px;display:flex;gap:30px">
    <div style="flex:1"><p class="h" style="font-size:24px">MongoDB Community Server</p><p class="sub">The source-available, free-to-use version of MongoDB.</p></div>
    <div class="s-card" style="width:330px">
      <div class="lab" style="margin-top:0">Version</div><div class="select">8.3 (current)</div>
      <div class="lab">Platform</div><div class="select" id="d-plat"><span class="pv">Ubuntu 24.04 x64</span></div>
      <div class="lab">Package</div><div class="select" id="d-pkg"><span class="pv">tgz</span></div>
      <div class="mbtn pri" id="d-dl" style="width:100%;margin-top:16px">Download</div>
    </div>
  </div>
  <div class="dl" id="dl" hidden><span class="fileic">${ext}</span><span>${archivo}</span><span style="margin-left:auto;color:var(--m-muted)">Abrir archivo</span></div>`,
  );

const compassConectar = (nombre: string) =>
  aplicacion(
    'MongoDB Compass',
    `<div class="ttl">Connections</div><div id="side-conn" hidden><div class="conn"><i></i>${nombre}</div></div>`,
    `<div style="text-align:center;padding-top:60px" id="welcome"><p class="h" style="font-size:24px">Welcome to MongoDB Compass</p><p class="sub">To get started, connect to an existing server</p><div class="mbtn pri" id="b-new">+ Add new connection</div></div>
   <div class="modal-bg" id="mc" hidden><div class="s-card" style="width:600px">
     <p class="h">New Connection</p><p class="sub">Manage your connection settings</p>
     <div class="lab">URI</div>${campo('uri', '')}
     <div class="lab">Name</div>${campo('cname', 'localhost:27017')}
     <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px"><div class="mbtn sec">Cancel</div><div class="mbtn sec">Save</div><div class="mbtn pri" id="b-sc">Save &amp; Connect</div></div>
   </div></div>
   <div id="after" hidden><p class="h">${nombre}</p><p class="sub">Databases: 3</p><div class="list-opt">admin <span>Storage size</span></div><div class="list-opt">config <span>Storage size</span></div><div class="list-opt">local <span>Storage size</span></div></div>
   <div class="toast" id="tc" hidden><b>✓</b> Connected to ${nombre}</div>`,
  );
const accionesCompass: readonly Accion[] = [
  ['click', '#b-new'],
  ['show', '#mc'],
  ['set', '#uri', 'mongodb://localhost:27017/'],
  ['wait', 300],
  ['mark', '#uri', 'localhost:27017'],
  ['wait', 1100],
  ['unmark', '#uri'],
  ['click', '#b-sc'],
  ['hide', '#mc'],
  ['hide', '#welcome'],
  ['show', '#side-conn'],
  ['show', '#after'],
  ['show', '#tc'],
];

const compassShell = (nombre: string) =>
  aplicacion(
    'MongoDB Compass',
    `<div class="ttl">Connections</div><div class="conn"><i></i>${nombre}</div><div class="db">admin</div><div class="db">config</div><div class="db">local</div>`,
    `<div style="display:flex;justify-content:space-between;align-items:center"><p class="h">${nombre}</p><div class="mbtn sec" id="b-shell">&gt;_ Open MongoDB shell</div></div>
   <p class="sub">Databases: 3</p>
   <div class="shell" id="sh" hidden><div class="o">test&gt;</div><div><span class="p">&gt; </span><span id="cmd"></span><span class="caret"></span></div><div class="o" id="out" hidden>admin    40.00 KiB
config  108.00 KiB
local    72.00 KiB</div></div>`,
  );
const accionesShell: readonly Accion[] = [
  ['click', '#b-shell'],
  ['show', '#sh'],
  ['wait', 400],
  ['typeplain', '#cmd', 'show dbs'],
  ['wait', 400],
  ['show', '#out'],
];

/* ── Windows ────────────────────────────────────────────────────────────── */

const WINDOWS: Paso[] = [
  {
    nombre: 'Descarga el instalador',
    etiqueta: 'navegador · mongodb.com/try/download/community',
    titulo: 'Descarga MongoDB Community Server',
    cuerpo: [
      'Entra a <code>mongodb.com/try/download/community</code>.',
      "En <span class='ui'>Version</span> deja la que viene seleccionada.",
      "En <span class='ui'>Platform</span> elige <span class='ui'>Windows x64</span> y en <span class='ui'>Package</span> elige <span class='ui'>msi</span>.",
      "Haz clic en <span class='ui'>Download</span>. Es un archivo grande: la descarga puede tardar.",
    ],
    nota: [
      'info',
      'Antes de empezar',
      'Necesitas Windows 11 de 64 bits y una cuenta con permisos de administrador. En Windows 10 suele funcionar, pero MongoDB ya no lo soporta oficialmente. Si el computador es del colegio, pídele la clave al encargado de sistemas.',
    ],
    pantalla: () => paginaDescarga('mongodb-windows-x86_64-8.3-signed.msi', 'MSI'),
    acciones: [
      ['click', '#d-plat'],
      ['text', '#d-plat .pv', 'Windows x64'],
      ['click', '#d-pkg'],
      ['text', '#d-pkg .pv', 'msi'],
      ['click', '#d-dl'],
      ['show', '#dl'],
    ],
  },
  {
    nombre: 'Abre el instalador',
    etiqueta: 'Instalador de MongoDB',
    titulo: 'Abre el instalador y acepta la licencia',
    cuerpo: [
      "Ve a <span class='ui'>Descargas</span> y haz doble clic en el archivo <code>.msi</code>.",
      "En la bienvenida haz clic en <span class='ui'>Next</span>.",
      "Marca <span class='ui'>I accept the terms in the License Agreement</span> y haz clic en <span class='ui'>Next</span>.",
    ],
    nota: [
      'info',
      'El instalador está en inglés',
      "Te marcamos el nombre exacto de cada botón. Si Windows muestra \"Windows protegió su PC\", haz clic en <span class='ui'>Más información</span> y luego <span class='ui'>Ejecutar de todas formas</span>.",
    ],
    pantalla: () =>
      escritorio(
        asistente(`
    <div id="w1"><p class="h" style="font-size:18px">Welcome to the MongoDB 8.3 Setup Wizard</p><p class="sub">The Setup Wizard will install MongoDB on your computer. Click Next to continue or Cancel to exit.</p></div>
    <div id="w2" hidden><p class="h" style="font-size:17px">End-User License Agreement</p><p class="sub">Please read the following license agreement carefully</p>
      <div style="height:90px;border:1px solid var(--m-line);border-radius:6px;padding:8px 10px;font-size:11px;color:var(--m-muted);overflow:hidden;line-height:1.5">Server Side Public License · VERSION 1 · Everyone is permitted to copy and distribute verbatim copies of this license document…</div>
      <div class="chk" id="c-lic"><span class="box"></span>I accept the terms in the License Agreement</div></div>`),
      ),
    acciones: [
      ['wait', 300],
      ['click', '#w-next'],
      ['hide', '#w1'],
      ['show', '#w2'],
      ['wait', 400],
      ['click', '#c-lic'],
      ['add', '#c-lic', 'on'],
      ['click', '#w-next'],
    ],
  },
  {
    nombre: 'Elige Complete',
    etiqueta: 'Instalador de MongoDB',
    titulo: 'Elige la instalación completa',
    cuerpo: [
      "En <span class='ui'>Choose Setup Type</span> haz clic en <span class='ui'>Complete</span>.",
      'Esto instala MongoDB con todas sus herramientas en la carpeta por defecto.',
    ],
    nota: [
      'tip',
      'No uses Custom',
      'La opción Custom es para cambiar carpetas y componentes. Para aprender, <b>Complete</b> es la correcta.',
    ],
    pantalla: () =>
      escritorio(
        asistente(`
    <p class="h" style="font-size:17px">Choose Setup Type</p><p class="sub">Choose the setup type that best suits your needs</p>
    <div class="s-radio" id="r-comp"><i></i><div><b>Complete</b><br><span style="color:var(--m-muted)">All program features will be installed. Requires the most disk space. Recommended for most users.</span></div></div>
    <div class="s-radio"><i></i><div><b>Custom</b><br><span style="color:var(--m-muted)">Allows users to choose which program features will be installed and where.</span></div></div>`),
      ),
    acciones: [
      ['wait', 300],
      ['click', '#r-comp'],
      ['add', '#r-comp', 'on'],
      ['wait', 500],
      ['click', '#w-next'],
    ],
  },
  {
    nombre: 'Configura el servicio',
    etiqueta: 'Instalador de MongoDB',
    titulo: 'Déjalo como servicio de Windows',
    cuerpo: [
      "Verifica que esté marcado <span class='ui'>Install MongoD as a Service</span>.",
      "Deja <span class='ui'>Run service as Network Service user</span> y el nombre <code>MongoDB</code>.",
      "No cambies las carpetas <span class='ui'>Data Directory</span> ni <span class='ui'>Log Directory</span>.",
      "Haz clic en <span class='ui'>Next</span>.",
    ],
    nota: [
      'tip',
      '¿Qué es un servicio?',
      'Es un programa que Windows prende solo cada vez que enciendes el computador. Así MongoDB siempre está listo y no tienes que abrirlo a mano.',
    ],
    pantalla: () =>
      escritorio(
        asistente(`
    <p class="h" style="font-size:17px">Service Configuration</p><p class="sub">Specify optional settings to configure MongoDB as a service.</p>
    <div class="chk on" id="c-svc" style="margin-top:0"><span class="box"></span><b>Install MongoD as a Service</b></div>
    <div class="s-radio on" style="margin-top:8px;padding:7px 10px"><i></i><div>Run service as Network Service user</div></div>
    <div class="kv"><span>Service Name:</span><div class="in sm">MongoDB</div></div>
    <div class="kv"><span>Data Directory:</span><div class="in sm" id="f-data">C:\\Program Files\\MongoDB\\Server\\8.3\\data\\</div></div>
    <div class="kv"><span>Log Directory:</span><div class="in sm">C:\\Program Files\\MongoDB\\Server\\8.3\\log\\</div></div>`),
      ),
    acciones: [
      ['move', '#c-svc'],
      ['wait', 500],
      ['move', '#f-data'],
      ['wait', 600],
      ['click', '#w-next'],
    ],
  },
  {
    nombre: 'Instala con Compass',
    etiqueta: 'Instalador de MongoDB',
    titulo: 'Deja marcado Compass e instala',
    cuerpo: [
      "Deja marcado <span class='ui'>Install MongoDB Compass</span> y haz clic en <span class='ui'>Next</span>.",
      "Haz clic en <span class='ui'>Install</span>.",
      "Windows pregunta si permites cambios en el dispositivo: haz clic en <span class='ui'>Sí</span>.",
      "Al terminar haz clic en <span class='ui'>Finish</span>. Compass se abre solo.",
    ],
    nota: [
      'warn',
      'Si se queda pegado',
      'Instalar Compass puede tardar varios minutos y parecer congelado. No lo canceles: espera a que termine la barra.',
    ],
    pantalla: () =>
      escritorio(
        asistente(`
    <div id="w1"><p class="h" style="font-size:17px">Install MongoDB Compass</p>
      <div class="chk on" id="c-cmp"><span class="box"></span>Install MongoDB Compass</div>
      <p class="sub" style="margin-top:10px">MongoDB Compass is the official graphical user interface for MongoDB.</p></div>
    <div id="w2" hidden><p class="h" style="font-size:17px">Ready to install MongoDB 8.3</p><p class="sub">Click Install to begin the installation.</p></div>
    <div id="w3" hidden><p class="h" style="font-size:17px">Installing MongoDB 8.3</p><p class="sub">Please wait while the Setup Wizard installs MongoDB.</p><div class="bar" id="ibar"><i></i></div></div>
    <div id="w4" hidden><p class="h" style="font-size:18px">Completed the MongoDB 8.3 Setup Wizard</p><p class="sub">Click the Finish button to exit the Setup Wizard.</p></div>`) +
          `
    <div class="uac" id="uac" hidden><div class="uac-h">Control de cuentas de usuario</div><div class="uac-b"><p style="font-size:18px;margin:0 0 10px">¿Quieres permitir que esta aplicación haga cambios en el dispositivo?</p><p style="margin:0;font-weight:700">MongoDB 8.3 Setup</p><p style="margin:4px 0 0;font-size:12px;opacity:.8">Editor comprobado: MongoDB, Inc.</p></div><div class="uac-f"><div class="mbtn" id="uac-yes" style="background:#0067c0;color:#fff">Sí</div><div class="mbtn sec">No</div></div></div>`,
      ),
    acciones: [
      ['move', '#c-cmp'],
      ['wait', 400],
      ['click', '#w-next'],
      ['hide', '#w1'],
      ['show', '#w2'],
      ['text', '#w-next', 'Install'],
      ['wait', 300],
      ['click', '#w-next'],
      ['show', '#uac'],
      ['wait', 400],
      ['click', '#uac-yes'],
      ['hide', '#uac'],
      ['hide', '#w2'],
      ['show', '#w3'],
      ['wait', 150],
      ['add', '#ibar', 'full'],
      ['wait', 2100],
      ['hide', '#w3'],
      ['show', '#w4'],
      ['text', '#w-next', 'Finish'],
      ['click', '#w-next'],
    ],
  },
  {
    nombre: 'Verifica el servicio',
    etiqueta: 'Windows · Servicios',
    titulo: 'Verifica que MongoDB esté corriendo',
    cuerpo: [
      "Presiona <span class='ui'>Windows + R</span>, escribe <code>services.msc</code> y presiona <span class='ui'>Aceptar</span>.",
      "Busca <span class='ui'>MongoDB Server (MongoDB)</span> en la lista.",
      'En la columna <span class=\'ui\'>Estado</span> debe decir <b>En ejecución</b>.',
    ],
    nota: [
      'warn',
      'Si está detenido',
      "Haz clic derecho sobre el servicio y elige <span class='ui'>Iniciar</span>. Sin este servicio corriendo, Compass no se puede conectar.",
    ],
    pantalla: () =>
      escritorio(`
    <div class="run" id="run"><div class="uac-h" style="background:#f3f3f3;color:#1b1b1b">Ejecutar</div><div style="padding:16px 18px"><p style="margin:0 0 10px;font-size:13px">Escriba el nombre del programa, carpeta, documento o recurso de Internet que desea abrir con Windows.</p><div style="display:flex;gap:8px;align-items:center"><span style="font-size:13px">Abrir:</span>${campo('run-in', '')}</div></div><div class="wiz-f" style="background:#f3f3f3"><div class="mbtn" id="run-ok" style="background:#0067c0;color:#fff">Aceptar</div><div class="mbtn sec">Cancelar</div></div></div>
    <div class="svc" id="svc" hidden><div class="uac-h" style="background:#f3f3f3;color:#1b1b1b">Servicios</div>
      <div class="svc-t"><div class="svc-r svc-hd"><span>Nombre</span><span>Estado</span><span>Tipo de inicio</span></div>
      <div class="svc-r"><span>Microsoft Defender Antivirus</span><span>En ejecución</span><span>Automático</span></div>
      <div class="svc-r"><span>Mixed Reality OpenXR</span><span></span><span>Manual</span></div>
      <div class="svc-r" id="svc-mdb"><span><b>MongoDB Server (MongoDB)</b></span><span class="run-ok">En ejecución</span><span>Automático</span></div>
      <div class="svc-r"><span>Net.Tcp Port Sharing</span><span></span><span>Deshabilitado</span></div>
      <div class="svc-r"><span>Network Connections</span><span>En ejecución</span><span>Manual</span></div></div></div>`),
    acciones: [
      ['type', '#run-in', 'services.msc'],
      ['click', '#run-ok'],
      ['hide', '#run'],
      ['show', '#svc'],
      ['wait', 400],
      ['click', '#svc-mdb'],
      ['add', '#svc-mdb', 'sel'],
      ['wait', 300],
      ['move', '#svc-mdb .run-ok'],
    ],
  },
  {
    nombre: 'Conecta Compass',
    etiqueta: 'MongoDB Compass',
    titulo: 'Conecta Compass a tu computador',
    cuerpo: [
      "Abre Compass y haz clic en <span class='ui'>Add new connection</span>.",
      'Deja el URI que viene escrito: <code>mongodb://localhost:27017</code>.',
      "Haz clic en <span class='ui'>Save &amp; Connect</span>. No necesitas usuario ni contraseña.",
    ],
    nota: [
      'tip',
      '¿Qué es localhost:27017?',
      '<code>localhost</code> significa "este mismo computador" y <code>27017</code> es la puerta por donde MongoDB escucha. Es la dirección que usaremos desde Express.',
    ],
    pantalla: () => compassConectar('localhost:27017'),
    acciones: accionesCompass,
  },
  {
    nombre: 'Abre la shell',
    etiqueta: 'MongoDB Compass · mongosh',
    titulo: 'Abre la shell y comprueba',
    cuerpo: [
      "Haz clic en <span class='ui'>&gt;_ Open MongoDB shell</span>.",
      'Escribe <code>show dbs</code> y presiona Enter.',
      'Debes ver <code>admin</code>, <code>config</code> y <code>local</code>.',
    ],
    nota: [
      'tip',
      'Punto de control',
      'Si ves las tres bases de datos, MongoDB quedó bien instalado. Usamos la shell de Compass porque el instalador de Windows no trae <code>mongosh</code> por separado.',
    ],
    pantalla: () => compassShell('localhost:27017'),
    acciones: accionesShell,
  },
];

/* ── macOS ──────────────────────────────────────────────────────────────── */

const MAC: Paso[] = [
  {
    nombre: 'Herramientas de Xcode',
    etiqueta: 'Terminal',
    titulo: 'Instala las herramientas de desarrollador',
    cuerpo: [
      "Abre la app <span class='ui'>Terminal</span> (búscala con Cmd + Espacio).",
      'Escribe <code>xcode-select --install</code> y presiona Enter.',
      "En la ventana que aparece haz clic en <span class='ui'>Instalar</span> y espera.",
    ],
    nota: [
      'info',
      'Si ya las tienes',
      'Si la Terminal dice <code>already installed</code>, perfecto: salta al siguiente paso.',
    ],
    pantalla: () =>
      terminalMac('tm') +
      `<div class="macdlg" id="xdlg" hidden><p style="font-weight:700;margin:0 0 6px">El comando "xcode-select" requiere las herramientas de desarrollo de línea de comandos.</p><p style="margin:0 0 14px;font-size:12px;color:var(--m-muted)">¿Quieres instalar las herramientas ahora?</p><div style="display:flex;gap:8px;justify-content:flex-end"><div class="mbtn sec">No ahora</div><div class="mbtn" id="x-ok" style="background:#0a84ff;color:#fff">Instalar</div></div></div>`,
    acciones: [
      ['cmd', '#tm', 'xcode-select --install', ''],
      ['show', '#xdlg'],
      ['wait', 300],
      ['click', '#x-ok'],
      ['hide', '#xdlg'],
      ['out', '#tm', 'xcode-select: note: install requested for command line developer tools'],
    ],
  },
  {
    nombre: 'Instala Homebrew',
    etiqueta: 'Terminal',
    titulo: 'Instala Homebrew',
    cuerpo: [
      'Entra a <code>brew.sh</code> y copia el comando de instalación.',
      'Pégalo en la Terminal y presiona Enter. Te pedirá la contraseña de tu Mac: al escribirla no se ve nada, es normal.',
      "Al final, copia y ejecuta los comandos que aparecen en <span class='ui'>Next steps</span>.",
    ],
    nota: [
      'warn',
      'No te saltes Next steps',
      'En Mac con chip Apple (M1, M2…) esos comandos agregan <code>brew</code> al PATH. Si no los ejecutas, verás <code>command not found: brew</code>.',
    ],
    pantalla: () => terminalMac('tm'),
    acciones: [
      [
        'cmd',
        '#tm',
        '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
        '==> Checking for `sudo` access (which may request your password)...\nPassword:',
      ],
      ['wait', 500],
      [
        'out',
        '#tm',
        '==> Installation successful!\n==> Next steps:\n- Run these commands in your terminal to add Homebrew to your PATH:',
      ],
    ],
  },
  {
    nombre: 'Instala MongoDB',
    etiqueta: 'Terminal',
    titulo: 'Instala MongoDB con Homebrew',
    cuerpo: [
      'Agrega el repositorio oficial: <code>brew tap mongodb/brew</code>. Si Homebrew te pide confiar en él, ejecuta <code>brew trust mongodb/brew</code>.',
      'Actualiza Homebrew: <code>brew update</code>',
      'Instala: <code>brew install mongodb-community@9.0</code>',
    ],
    nota: [
      'info',
      'El número de versión',
      'Usa el número que indique la guía oficial en ese momento. Si hay una versión más nueva, cambia <code>@9.0</code> por esa. Esta instalación ya incluye <code>mongosh</code>.',
    ],
    pantalla: () => terminalMac('tm'),
    acciones: [
      ['cmd', '#tm', 'brew tap mongodb/brew', '==> Tapping mongodb/brew'],
      ['cmd', '#tm', 'brew update', 'Already up-to-date.'],
      [
        'cmd',
        '#tm',
        'brew install mongodb-community@9.0',
        '==> Installing mongodb-community@9.0 from mongodb/brew\n🍺  mongodb-community@9.0 was successfully installed!',
      ],
    ],
  },
  {
    nombre: 'Arranca el servicio',
    etiqueta: 'Terminal',
    titulo: 'Arranca MongoDB como servicio',
    cuerpo: [
      'Ejecuta <code>brew services start mongodb-community@9.0</code>',
      'Comprueba con <code>brew services list</code>: debe decir <b>started</b>.',
    ],
    nota: [
      'warn',
      'Si macOS lo bloquea',
      "Si aparece un aviso de que el desarrollador no se pudo verificar, ve a <span class='ui'>Configuración del Sistema → Privacidad y seguridad</span> y haz clic en <span class='ui'>Abrir igualmente</span>.",
    ],
    pantalla: () => terminalMac('tm'),
    acciones: [
      [
        'cmd',
        '#tm',
        'brew services start mongodb-community@9.0',
        '==> Successfully started `mongodb-community@9.0`',
      ],
      [
        'cmd',
        '#tm',
        'brew services list',
        'Name                  Status  User  File\nmongodb-community@9.0 <g>started</g> laura ~/Library/LaunchAgents/…',
      ],
    ],
  },
  {
    nombre: 'Instala Compass',
    etiqueta: 'navegador · mongodb.com/try/download/compass',
    titulo: 'Descarga e instala Compass',
    cuerpo: [
      'En Mac, Compass se descarga aparte: entra a <code>mongodb.com/try/download/compass</code>.',
      "En <span class='ui'>Platform</span> elige <span class='ui'>macOS arm64</span> si tu Mac tiene chip Apple, o <span class='ui'>macOS x64</span> si es Intel.",
      "Abre el <code>.dmg</code> y arrastra Compass a <span class='ui'>Aplicaciones</span>.",
    ],
    nota: [
      'tip',
      '¿Qué chip tiene mi Mac?',
      "Menú Apple → <span class='ui'>Acerca de esta Mac</span>. Si dice Chip Apple M1, M2, M3 o M4, elige arm64.",
    ],
    pantalla: () =>
      navegador(
        'mongodb.com/try/download/compass',
        `
    <div class="s-nav"><span class="brand">MongoDB</span><span>Products</span><span>Resources</span></div>
    <div style="padding:26px 34px;display:flex;gap:30px">
      <div style="flex:1"><p class="h" style="font-size:24px">MongoDB Compass Download</p><p class="sub">The GUI for MongoDB.</p></div>
      <div class="s-card" style="width:330px">
        <div class="lab" style="margin-top:0">Version</div><div class="select">1.x (Stable)</div>
        <div class="lab">Platform</div><div class="select" id="c-plat"><span class="pv">Windows 64-bit (10+)</span></div>
        <div class="lab">Package</div><div class="select" id="c-pkg"><span class="pv">exe</span></div>
        <div class="mbtn pri" id="c-dl" style="width:100%;margin-top:16px">Download</div>
      </div>
    </div>
    <div class="dmg" id="dmg" hidden><div class="dmg-bar">MongoDB Compass</div><div class="dmg-b"><div class="dmg-ic" id="dmg-app"><span class="leaf"></span>MongoDB Compass</div><div class="dmg-arrow">→</div><div class="dmg-ic" id="dmg-apps"><span class="fold"></span>Applications</div></div></div>`,
      ),
    acciones: [
      ['click', '#c-plat'],
      ['text', '#c-plat .pv', 'macOS arm64 (M1+)'],
      ['text', '#c-pkg .pv', 'dmg'],
      ['click', '#c-dl'],
      ['wait', 300],
      ['show', '#dmg'],
      ['wait', 300],
      ['move', '#dmg-app'],
      ['drag', '#dmg-app', '#dmg-apps'],
      ['add', '#dmg-apps', 'sel'],
    ],
  },
  {
    nombre: 'Conecta Compass',
    etiqueta: 'MongoDB Compass',
    titulo: 'Conecta Compass a tu computador',
    cuerpo: [
      "Abre Compass desde <span class='ui'>Aplicaciones</span> y haz clic en <span class='ui'>Add new connection</span>.",
      'Deja el URI <code>mongodb://localhost:27017</code>.',
      "Haz clic en <span class='ui'>Save &amp; Connect</span>.",
    ],
    nota: [
      'warn',
      'Si sale ECONNREFUSED',
      'El servicio no está corriendo. Vuelve a la Terminal y ejecuta <code>brew services start mongodb-community@9.0</code>.',
    ],
    pantalla: () => compassConectar('localhost:27017'),
    acciones: accionesCompass,
  },
  {
    nombre: 'Abre la shell',
    etiqueta: 'MongoDB Compass · mongosh',
    titulo: 'Abre la shell y comprueba',
    cuerpo: [
      "Haz clic en <span class='ui'>&gt;_ Open MongoDB shell</span> (o escribe <code>mongosh</code> en la Terminal).",
      'Escribe <code>show dbs</code> y presiona Enter.',
      'Debes ver <code>admin</code>, <code>config</code> y <code>local</code>.',
    ],
    nota: [
      'tip',
      'Punto de control',
      'Si ves las tres bases de datos, MongoDB quedó bien instalado. ¡Listo para el CRUD!',
    ],
    pantalla: () => compassShell('localhost:27017'),
    acciones: accionesShell,
  },
];

const RUTAS = { win: WINDOWS, mac: MAC } as const;
type Ruta = keyof typeof RUTAS;

const CURSOR = `<svg class="cursor" id="cur" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.4-6.8L4 20z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
const ANCHO_ESCENA = 880;

/* ── motor de animación ─────────────────────────────────────────────────── */

interface Motor {
  escena: HTMLDivElement;
  escala: () => number;
  /** Con movimiento reducido todo pasa de golpe: sin esperas ni tecleo. */
  rapido: boolean;
  /** Falso en cuanto el paso cambia o el componente se desmonta. */
  vivo: () => boolean;
}

const dormir = (m: Motor, ms: number) =>
  m.rapido ? Promise.resolve() : new Promise<void>((r) => setTimeout(r, ms));

const buscar = (m: Motor, sel: string) => m.escena.querySelector<HTMLElement>(sel);

function escapar(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function posicion(m: Motor, el: HTMLElement) {
  const a = el.getBoundingClientRect();
  const b = m.escena.getBoundingClientRect();
  const k = m.escala();
  return { x: (a.left - b.left + a.width / 2) / k, y: (a.top - b.top + a.height / 2) / k };
}

async function moverA(m: Motor, el: HTMLElement | null) {
  const cursor = buscar(m, '#cur');
  if (!cursor || !el) return;
  const p = posicion(m, el);
  cursor.style.transform = `translate(${p.x - 4}px, ${p.y - 2}px)`;
  await dormir(m, 760);
}

async function presionar(m: Motor, el: HTMLElement | null) {
  if (!el) return;
  if (!m.rapido) {
    const p = posicion(m, el);
    const onda = document.createElement('div');
    onda.className = 'ripple';
    onda.style.left = `${p.x}px`;
    onda.style.top = `${p.y}px`;
    m.escena.appendChild(onda);
    setTimeout(() => onda.remove(), 520);
  }
  el.classList.add('pressed');
  await dormir(m, 180);
  el.classList.remove('pressed');
}

function enfocar(m: Motor, el: HTMLElement | null) {
  m.escena.querySelectorAll('.in.focus').forEach((f) => f.classList.remove('focus'));
  el?.classList.add('focus');
}

function agregarSalida(el: HTMLElement, texto: string) {
  const linea = document.createElement('div');
  linea.className = 'ou';
  linea.innerHTML = escapar(texto)
    .replace(/&lt;g&gt;/g, '<g>')
    .replace(/&lt;\/g&gt;/g, '</g>');
  el.appendChild(linea);
}

async function teclear(m: Motor, span: Element | null, texto: string, velocidad: number) {
  if (!span) return;
  if (m.rapido) {
    span.textContent = texto;
    return;
  }
  for (const letra of texto) {
    if (!m.vivo()) return;
    span.textContent += letra;
    await dormir(m, velocidad);
  }
}

async function ejecutar(m: Motor, [op, sel, arg = '', arg2]: Accion) {
  const el = typeof sel === 'string' ? buscar(m, sel) : null;
  switch (op) {
    case 'move':
      await moverA(m, el);
      break;
    case 'click':
      await moverA(m, el);
      await presionar(m, el);
      if (el?.classList.contains('in')) enfocar(m, el);
      break;
    case 'type':
      await moverA(m, el);
      await presionar(m, el);
      enfocar(m, el);
      await teclear(m, el?.querySelector('.v') ?? null, arg, 55);
      break;
    case 'typeplain':
      await teclear(m, el, arg, 90);
      break;
    case 'set': {
      const v = el?.querySelector('.v');
      if (v) v.textContent = arg;
      break;
    }
    case 'text':
      if (el) el.textContent = arg;
      break;
    case 'mark': {
      const v = el?.querySelector('.v');
      if (v)
        v.innerHTML = escapar(v.textContent ?? '').replace(
          escapar(arg),
          `<span class="hl">${escapar(arg)}</span>`,
        );
      break;
    }
    case 'unmark': {
      const v = el?.querySelector('.v');
      if (v) v.textContent = v.textContent ?? '';
      break;
    }
    case 'show':
      if (el) el.hidden = false;
      await dormir(m, 250);
      break;
    case 'hide':
      if (el) el.hidden = true;
      break;
    case 'add':
      el?.classList.add(arg);
      break;
    case 'wait':
      await dormir(m, typeof sel === 'number' ? sel : 0);
      break;
    case 'cmd': {
      if (!el) break;
      const linea = document.createElement('div');
      linea.innerHTML = `<span class="pr">laura@MacBook ~ % </span><span class="c"></span><span class="caret"></span>`;
      el.appendChild(linea);
      await teclear(m, linea.querySelector('.c'), arg, arg.length > 40 ? 12 : 55);
      linea.querySelector('.caret')?.remove();
      await dormir(m, 350);
      if (arg2) agregarSalida(el, arg2);
      await dormir(m, 500);
      break;
    }
    case 'out':
      if (el) agregarSalida(el, arg);
      await dormir(m, 400);
      break;
    case 'drag': {
      const hacia = buscar(m, arg);
      if (!el || !hacia) break;
      const a = posicion(m, el);
      const b = posicion(m, hacia);
      const fantasma = document.createElement('div');
      fantasma.className = 'ghost';
      fantasma.style.transform = `translate(${a.x - 24}px, ${a.y - 24}px)`;
      m.escena.appendChild(fantasma);
      fantasma.getBoundingClientRect();
      fantasma.style.transform = `translate(${b.x - 24}px, ${b.y - 24}px)`;
      await moverA(m, hacia);
      await dormir(m, 200);
      fantasma.remove();
      break;
    }
  }
}

/* ── componente ─────────────────────────────────────────────────────────── */

export function InstalarMongo() {
  const [ruta, setRuta] = useState<Ruta>('win');
  const [paso, setPaso] = useState(0);
  const [auto, setAuto] = useState(false);
  const [terminado, setTerminado] = useState(false);
  /** Subirlo repite el paso actual (botón "Repetir" o tecla R). */
  const [vuelta, setVuelta] = useState(0);

  const vistaRef = useRef<HTMLDivElement>(null);
  const escenaRef = useRef<HTMLDivElement>(null);
  const pasosRef = useRef<HTMLOListElement>(null);
  const escalaRef = useRef(1);
  const autoRef = useRef(auto);

  const pasos = RUTAS[ruta];
  const actual = pasos[paso];

  useEffect(() => {
    autoRef.current = auto;
  }, [auto]);

  // El lienzo mide 880 px de diseño y se escala al ancho que haya.
  useEffect(() => {
    const vista = vistaRef.current;
    const escena = escenaRef.current;
    if (!vista || !escena) return;
    const ajustar = () => {
      escalaRef.current = vista.clientWidth / ANCHO_ESCENA;
      escena.style.transform = `scale(${escalaRef.current})`;
    };
    ajustar();
    const observador = new ResizeObserver(ajustar);
    observador.observe(vista);
    return () => observador.disconnect();
  }, []);

  // Cada cambio de ruta, de paso o de "vuelta" monta la pantalla y la anima.
  useEffect(() => {
    const escena = escenaRef.current;
    if (!escena) return;
    let vivo = true;
    let temporizador = 0;
    const lista = RUTAS[ruta];
    const p = lista[paso];

    const motor: Motor = {
      escena,
      escala: () => escalaRef.current,
      rapido: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      vivo: () => vivo,
    };

    escena.innerHTML = `${p.pantalla()}${CURSOR}<div class="sim">simulación</div>`;
    const cursor = buscar(motor, '#cur');
    if (cursor) {
      // El cursor arranca abajo a la derecha, sin animar ese primer salto.
      cursor.style.transition = 'none';
      cursor.style.transform = 'translate(700px, 470px)';
      cursor.getBoundingClientRect();
      cursor.style.transition = '';
    }

    (async () => {
      await dormir(motor, 350);
      for (const accion of p.acciones) {
        if (!vivo) return;
        await ejecutar(motor, accion);
      }
      if (!vivo) return;
      enfocar(motor, null);
      if (autoRef.current) {
        temporizador = window.setTimeout(() => {
          if (!autoRef.current) return;
          if (paso < lista.length - 1) setPaso(paso + 1);
          else setAuto(false);
        }, 2600);
      }
    })();

    return () => {
      vivo = false;
      clearTimeout(temporizador);
    };
  }, [ruta, paso, vuelta]);

  // En pantallas angostas la fila de pasos se desliza de lado: se centra en el
  // paso actual. Se mueve el `scrollLeft` de la fila y no se usa
  // `scrollIntoView`, que además desplazaría la página hacia arriba o abajo.
  useEffect(() => {
    const fila = pasosRef.current;
    const actualLi = fila?.querySelector<HTMLElement>('[aria-current="step"]');
    if (!fila || !actualLi || fila.scrollWidth <= fila.clientWidth) return;
    // Medido contra la propia fila: `offsetLeft` se mide contra el ancestro
    // posicionado más cercano, que aquí es la sección de la lección.
    const caja = fila.getBoundingClientRect();
    const item = actualLi.getBoundingClientRect();
    fila.scrollTo({
      left: fila.scrollLeft + item.left - caja.left - caja.width / 2 + item.width / 2,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [paso, ruta]);

  function ir(k: number) {
    setTerminado(false);
    setPaso(Math.max(0, Math.min(pasos.length - 1, k)));
  }

  function cambiarRuta(r: Ruta) {
    setRuta(r);
    setTerminado(false);
    setPaso(0);
  }

  function siguiente() {
    if (paso === pasos.length - 1) {
      setAuto(false);
      setTerminado(true);
      return;
    }
    ir(paso + 1);
  }

  function alternarAuto() {
    const nuevo = !auto;
    setAuto(nuevo);
    // Al encenderlo, el paso actual se repite y luego sigue solo.
    if (nuevo) setVuelta((n) => n + 1);
  }

  // Las teclas solo cuentan con el foco dentro del tutorial: a nivel de
  // documento, la R le robaría letras a cualquier ejercicio de la página.
  function alTeclado(e: KeyboardEvent<HTMLDivElement>) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const destino = e.target as HTMLElement;
    if (destino.closest('input, textarea, [contenteditable="true"]')) return;
    if (e.key === 'ArrowRight') ir(paso + 1);
    else if (e.key === 'ArrowLeft') ir(paso - 1);
    else if (e.key.toLowerCase() === 'r') setVuelta((n) => n + 1);
  }

  const [tipoNota, tituloNota, textoNota] = actual.nota;

  return (
    <div className={styles.raiz} tabIndex={-1} onKeyDown={alTeclado}>
      <div className={styles.cabecera}>
        <div>
          <div className={styles.prompt}>sesion13 --tutorial instalacion-local</div>
          <p className={styles.titulo}>Instala MongoDB en tu computador</p>
        </div>
        <div className={styles.pestanas} role="tablist" aria-label="Sistema operativo">
          {(
            [
              ['win', 'Windows', '8 pasos · instalador .msi'],
              ['mac', 'macOS', '7 pasos · Homebrew'],
            ] as const
          ).map(([id, nombre, detalle]) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={ruta === id}
              aria-controls="tutorial-mongo"
              className={styles.pestana}
              onClick={() => cambiarRuta(id)}
            >
              {nombre}
              <small>{detalle}</small>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.cuerpo} id="tutorial-mongo" role="tabpanel" aria-labelledby={`tab-${ruta}`}>
        {/* Los controles van bajo la pantalla, como los de un video, y no en la
            tarjeta del paso: dentro de ella la alargaban hasta 200 px más que
            la pantalla en un portátil de 1366 px, y quedaba un hueco abajo. */}
        <div className={styles.columnaPantalla}>
          <section className={styles.ventana}>
            <div className={styles.ventanaBarra}>
              <span className={styles.punto} data-c="rojo" />
              <span className={styles.punto} data-c="amarillo" />
              <span className={styles.punto} data-c="verde" />
              <span className={styles.ventanaEtiqueta}>{actual.etiqueta}</span>
            </div>
            <div
              className={styles.vista}
              ref={vistaRef}
              role="img"
              aria-label={`Simulación: ${actual.titulo}`}
            >
              <div className={styles.escena} ref={escenaRef} />
            </div>
          </section>

          <div className={styles.controles}>
            <button type="button" className={styles.boton} onClick={() => ir(paso - 1)} disabled={paso === 0}>
              ← Anterior
            </button>
            <button type="button" className={styles.boton} onClick={() => setVuelta((n) => n + 1)}>
              ↻ Repetir
            </button>
            <button type="button" className={`${styles.boton} ${styles.botonPri}`} onClick={siguiente}>
              {paso === pasos.length - 1 ? 'Terminar ✓' : 'Siguiente →'}
            </button>
            <button type="button" className={styles.boton} aria-pressed={auto} onClick={alternarAuto}>
              {auto ? 'Avanzando solo…' : 'Avanzar solo'}
            </button>
            <span className={styles.pista}>← → para moverte · R para repetir</span>
          </div>
        </div>

        <aside className={styles.panel}>
          <div className={styles.tarjeta} aria-live="polite">
            <div className={styles.numero}>
              {terminado ? '¡Instalación completa!' : `Paso ${paso + 1} de ${pasos.length}`}
            </div>
            <h3 className={styles.tituloPaso}>{actual.titulo}</h3>
            <ol className={styles.lista}>
              {actual.cuerpo.map((linea, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: linea }} />
              ))}
            </ol>
            <div className={styles.nota} data-tipo={tipoNota}>
              <b>{tituloNota}</b>
              <span dangerouslySetInnerHTML={{ __html: textoNota }} />
            </div>
          </div>
        </aside>
      </div>

      {/* El progreso va en fila y a todo el ancho, no como lista junto al
          panel: vertical, sus ocho renglones alargaban la columna derecha y
          dejaban un hueco enorme bajo la pantalla simulada. */}
      <ol className={styles.pasos} ref={pasosRef} aria-label="Pasos del tutorial">
        {pasos.map((s, k) => {
          const hecho = terminado || k < paso;
          const esActual = !terminado && k === paso;
          return (
            <li
              key={k}
              data-estado={esActual ? 'actual' : hecho ? 'hecho' : undefined}
              aria-current={esActual ? 'step' : undefined}
            >
              <button type="button" onClick={() => ir(k)}>
                <span className={styles.circulo}>{hecho ? '✓' : k + 1}</span>
                <span className={styles.nombrePaso}>{s.nombre}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
