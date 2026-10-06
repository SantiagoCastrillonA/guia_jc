import { ReproductorEscenas, type Escena } from '../../components/visuals/ReproductorEscenas';
import styles from './EscenasMongoose.module.css';

/*
 * "Mongoose: reglas para los datos de tu emprendimiento" — once escenas. El
 * motor y los controles están en `ReproductorEscenas`; aquí van el contenido
 * y el aspecto de las piezas (EscenasMongoose.module.css).
 *
 * El código de las escenas sigue las mismas convenciones que el resto de la
 * guía: módulos de JavaScript (`import`, con `.js` en las rutas propias),
 * `node --env-file=.env` en vez del paquete dotenv, `MONGO_URL`, la base
 * `mi_negocio` y las carpetas `modelos/` y `servidor.js` de la lección 6.
 *
 * `.card`, `.tag` y `.rule` ya existen en el CSS global del sitio: aquí se
 * llaman `e-card`, `e-tag` y `e-rule` para que no se cuelen.
 */

const fila = (cols: string, celdas: string[], clase = '', attrs = '') =>
  `<div class="tr ${clase}" style="grid-template-columns:${cols}" ${attrs}>${celdas
    .map((c) => `<span>${c}</span>`)
    .join('')}</div>`;
/** Palabra del código que se resalta en amarillo a los `ms` indicados. */
const kw = (txt: string, ms: number) => `<span class="kw" data-at="${ms}:hlw">${txt}</span>`;
const regla = (top: number, nombre: string, txt: string, t: number) =>
  `<div class="e-rule a right" data-t="${t}" style="top:${top}px"><code>${nombre}</code><span>${txt}</span></div>`;
const equivalencia = (top: number, izq: string, der: string, t: number) =>
  `<div class="map-row a left" data-t="${t}" style="top:${top}px"><div class="l">${izq}</div><div class="mc" style="text-align:center;font-size:28px">→</div><div class="r">${der}</div></div>`;

const ESCENAS: Escena[] = [
  {
    titulo: 'MongoDB guarda lo que le des',
    texto:
      "En la sesión 13 vimos que MongoDB es flexible. El problema: también acepta errores. Aquí falta el email, el campo se escribió <code>emial</code> y el rol <code>'superadmin'</code> no existe en nuestro emprendimiento… y aun así MongoDB responde que todo salió bien.",
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="mgc">// escena 1 · el problema</small>MongoDB guarda lo que le des</div>
  <div class="code blk a left" data-t="400" style="left:60px;top:175px;width:640px">
    <span class="ln a" data-t="500"><span class="b">db</span>.usuarios.<span class="f">insertOne</span>({</span>
    <span class="ln a" data-t="800">  nombre: <span class="s">'Andrés Ruiz'</span>,</span>
    <span class="ln a" data-t="1100">  ${kw('emial', 3000)}: <span class="s">'andres@correo.com'</span>,</span>
    <span class="ln a" data-t="1400">  rol: ${kw("<span class='s'>'superadmin'</span>", 3500)}</span>
    <span class="ln a" data-t="1700">})</span>
  </div>
  <div class="code a up" data-t="2200" style="left:60px;top:410px;width:640px;font-size:17px;border-color:color-mix(in srgb,var(--mongo) 50%,transparent)"><span class="f">{ acknowledged: true,</span>
<span class="f">  insertedId: ObjectId('66fa…') }</span>   <span class="c">// ✓ guardado</span></div>
  <div class="e-card a right" data-t="2800" style="left:760px;top:175px;width:460px;border-color:color-mix(in srgb,var(--red) 55%,transparent)">
    <h3 class="rc">Lo que se coló</h3>
    <div class="a" data-t="3000" style="font-size:21px;line-height:1.5;margin-top:6px">✗ <code style="font-family:var(--mono);color:var(--yellow)">emial</code> con error de tipeo</div>
    <div class="a" data-t="3500" style="font-size:21px;line-height:1.5">✗ un rol que no existe</div>
    <div class="a" data-t="4000" style="font-size:21px;line-height:1.5">✗ un usuario sin email (sin login)</div>
  </div>
  <div class="a up abs" data-t="4800" style="left:60px;top:560px;width:1160px;font-size:26px;line-height:1.4">
    <span style="font-weight:800">Flexible no significa desordenado.</span> <span class="sc" style="font-weight:800">Necesitamos un portero que revise.</span>
  </div>`,
  },
  {
    titulo: 'Mongoose: el portero',
    texto:
      '<b>Mongoose</b> es una librería de Node.js que se pone entre tu servidor de Express y MongoDB. Antes de guardar, <b>revisa cada documento con las reglas que tú definiste</b>. Si cumple, pasa a la base de datos. Si no, lo devuelve con un error que explica qué falló.',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 2 · mongoose</small>Mongoose es el portero</div>
  <div class="node a left" data-t="300" style="left:40px;top:395px;width:220px;height:110px;border-color:color-mix(in srgb,var(--yellow) 60%,transparent)"><b class="yc">Express</b><span>servidor.js</span></div>
  <div class="rail a" data-t="500" style="left:270px;top:448px;width:780px"></div>
  <div class="node a pop" data-t="800" style="left:520px;top:200px;width:250px;height:130px;border-color:var(--mgs)"><b class="sc">Mongoose</b><span>revisa las reglas<br>del modelo</span></div>
  <svg class="a abs" data-t="900" style="left:640px;top:330px" width="10" height="60" viewBox="0 0 10 60"><path d="M5 0 V60" stroke="var(--mgs)" stroke-width="3" stroke-dasharray="6 6" fill="none"/></svg>
  <div class="gate a" data-t="900" data-at="2300:ok,5400:no" style="left:640px;top:390px;height:120px"></div>
  <svg class="a pop abs" data-t="1100" style="left:1065px;top:365px" width="170" height="175" viewBox="0 0 170 175">
    <ellipse cx="85" cy="28" rx="75" ry="22" fill="var(--panel-2)" stroke="var(--mongo)" stroke-width="3"/>
    <path d="M10 28 V145 A75 22 0 0 0 160 145 V28" fill="var(--panel)" stroke="var(--mongo)" stroke-width="3"/>
    <path d="M10 68 A75 22 0 0 0 160 68 M10 108 A75 22 0 0 0 160 108" fill="none" stroke="var(--line)" stroke-width="3"/>
  </svg>
  <div class="a abs mgc" data-t="1100" style="left:1065px;top:548px;width:170px;text-align:center;font-weight:800;font-size:22px">MongoDB</div>
  <div class="pkt a pop" data-t="1500" data-at="1800:go" style="left:280px;top:426px">{ email ✓ }</div>
  <div class="pkt a pop" data-t="4300" data-at="4600:bounce,5400:bad" style="left:280px;top:426px">{ emial ✗ }</div>
  <div class="a pop abs rc" data-t="5600" style="left:330px;top:500px;font-family:var(--mono);font-size:19px;font-weight:800">ValidationError</div>
  <div class="a up abs" data-t="6300" style="left:40px;top:600px;display:flex;gap:16px;align-items:center;flex-wrap:wrap">
    <span class="chip sc">npm install mongoose</span><span class="mc" style="font-size:20px">Librería de Node.js · también se le llama <b style="color:var(--fg)">ODM</b></span>
  </div>`,
  },
  {
    titulo: 'Instalar y guardar la llave',
    texto:
      'Se instala con npm. La <b>cadena de conexión</b> va en un archivo <code>.env</code>: es la llave de tu base de datos, por eso el <code>.env</code> se agrega a <code>.gitignore</code> y nunca se sube a GitHub. Node lo lee solo si arrancas con <code>--env-file</code>, sin instalar nada más. Usamos <code>127.0.0.1</code> en vez de <code>localhost</code> para evitar un error de conexión común en Node.',
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 3 · instalar</small>Instalar y guardar la llave</div>
  <div class="code a up" data-t="300" style="left:60px;top:170px;width:1160px"><span class="mc">$ </span><span class="typed" data-type="npm install mongoose" data-t="500"></span></div>
  <div class="tree a left" data-t="2200" style="left:60px;top:285px;width:440px"><span class="ln">mi-emprendimiento/</span><span class="ln a" data-t="2400">├── <span class="new">config/db.js</span></span><span class="ln a" data-t="2600">├── <span class="new">modelos/Usuario.js</span></span><span class="ln a" data-t="2800">├── <span class="sec">.env</span>          <span class="mc">← la llave</span></span><span class="ln a" data-t="3000">├── .gitignore</span><span class="ln">├── package.json</span><span class="ln">└── servidor.js</span></div>
  <div class="code a right" data-t="3400" style="left:560px;top:315px;width:660px;font-size:16px;border-color:color-mix(in srgb,var(--red) 50%,transparent)"><div class="code-h">.env</div>MONGO_URL=<span class="s">mongodb://127.0.0.1:27017/</span><span class="f">mi_negocio</span></div>
  <div class="code a right" data-t="4000" style="left:560px;top:450px;width:660px;font-size:16px"><div class="code-h">.gitignore</div>node_modules
.env</div>
  <div class="a up abs rc" data-t="4800" style="left:560px;top:585px;font-size:21px;font-weight:700">El .env nunca se sube a GitHub.</div>`,
  },
  {
    titulo: 'Conectar con la base de datos',
    texto:
      'En <code>config/db.js</code> escribimos una función que se conecta con <code>mongoose.connect()</code>. Como conectarse toma tiempo, usamos <code>async/await</code> y <code>try/catch</code>, igual que con <code>fetch</code>. En <code>servidor.js</code> la importamos —con el <code>.js</code> al final, que en los módulos de JavaScript es obligatorio— y la llamamos una sola vez, al arrancar con <code>node --env-file=.env</code>.',
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 4 · conectar</small>Conectar con MongoDB</div>
  <div class="code blk a left" data-t="300" style="left:60px;top:190px;width:690px;font-size:16px"><div class="code-h">config/db.js</div>
    <span class="ln"><span class="k">import</span> mongoose <span class="k">from</span> <span class="s">'mongoose'</span>;</span>
    <span class="ln">&nbsp;</span>
    <span class="ln"><span class="k">export default async function</span> <span class="f">conectarDB</span>() {</span>
    <span class="ln">  <span class="k">try</span> {</span>
    <span class="ln emb a" data-t="900">    <span class="k">await</span> mongoose.<span class="f">connect</span>(process.env.MONGO_URL);</span>
    <span class="ln">    console.<span class="f">log</span>(<span class="s">'✅ Conectado a MongoDB'</span>);</span>
    <span class="ln">  } <span class="k">catch</span> (error) {</span>
    <span class="ln">    console.<span class="f">error</span>(<span class="s">'❌ Error al conectar:'</span>, error.message);</span>
    <span class="ln">    process.<span class="f">exit</span>(<span class="n">1</span>);</span>
    <span class="ln">  }</span>
    <span class="ln">}</span>
  </div>
  <div class="code blk a right" data-t="1800" style="left:775px;top:190px;width:450px;font-size:16px;border-color:color-mix(in srgb,var(--yellow) 45%,transparent)"><div class="code-h">servidor.js</div>
    <span class="ln"><span class="k">import</span> express <span class="k">from</span> <span class="s">'express'</span>;</span>
    <span class="ln emb a" data-t="2200"><span class="k">import</span> conectarDB <span class="k">from</span></span>
    <span class="ln emb a" data-t="2200">  <span class="s">'./config/db.js'</span>;</span>
    <span class="ln">&nbsp;</span>
    <span class="ln"><span class="k">const</span> app = <span class="f">express</span>();</span>
    <span class="ln emb a" data-t="3000"><span class="k">await</span> <span class="f">conectarDB</span>();</span>
  </div>
  <div class="code a up" data-t="3800" style="left:775px;top:470px;width:450px;font-size:16px;border-color:color-mix(in srgb,var(--mongo) 50%,transparent)"><span class="mc">$ node --env-file=.env servidor.js</span>
<span class="typed f" data-type="✅ Conectado a MongoDB" data-t="4300"></span></div>`,
  },
  {
    titulo: 'El Schema: tu dibujo, en código',
    texto:
      'En la tarea dibujaste el modelo de tu usuario: campo, tipo, obligatorio y único. Ese dibujo se convierte en un <b>Schema</b>, el plano que Mongoose usa para revisar. Cada fila del papel es una línea de código: el tipo pasa a ser <code>type</code>, lo obligatorio <code>required</code> y lo único <code>unique</code>.',
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 5 · schema</small>Del papel al Schema</div>
  <div class="tbl a left" data-t="300" style="left:40px;top:185px;width:470px">
    <div class="cap-t">tu dibujo (tarea S13)</div>
    ${fila('130px 95px 1fr 100px', ['campo', 'tipo', '¿oblig.?', '¿único?'], 'th')}
    ${fila('130px 95px 1fr 100px', ['nombre', 'texto', 'sí', 'no'], '', "data-at='1300:ok'")}
    ${fila('130px 95px 1fr 100px', ['email', 'texto', 'sí', "<b class='yc'>sí</b>"], '', "data-at='1700:ok'")}
    ${fila('130px 95px 1fr 100px', ['telefono', 'texto', 'no', 'no'], '', "data-at='2100:ok'")}
    ${fila('130px 95px 1fr 100px', ['rol', 'texto', 'sí', 'no'], '', "data-at='2500:ok'")}
    ${fila('130px 95px 1fr 100px', ['activo', 'sí/no', 'no', 'no'], '', "data-at='2900:ok'")}
    ${fila('130px 95px 1fr 100px', ['direccion', 'objeto', 'no', 'no'], '', "data-at='3300:ok'")}
    ${fila('130px 95px 1fr 100px', ['intereses', 'lista', 'no', 'no'], '', "data-at='3700:ok'")}
  </div>
  <div class="code blk a right" data-t="800" style="left:540px;top:185px;width:700px;font-size:16px"><div class="code-h">modelos/Usuario.js</div>
    <span class="ln"><span class="k">import</span> mongoose <span class="k">from</span> <span class="s">'mongoose'</span>;</span>
    <span class="ln">&nbsp;</span>
    <span class="ln"><span class="k">const</span> usuarioSchema = <span class="k">new</span> mongoose.<span class="f">Schema</span>({</span>
    <span class="ln a" data-t="1300">  nombre:    { type: <span class="b">String</span>, required: <span class="n">true</span> },</span>
    <span class="ln a" data-t="1700">  email:     { type: <span class="b">String</span>, required: <span class="n">true</span>, ${kw("unique: <span class='n'>true</span>", 4400)} },</span>
    <span class="ln a" data-t="2100">  telefono:  { type: <span class="b">String</span> },</span>
    <span class="ln a" data-t="2500">  rol:       { type: <span class="b">String</span>, required: <span class="n">true</span> },</span>
    <span class="ln a" data-t="2900">  activo:    { type: <span class="b">Boolean</span> },</span>
    <span class="ln a" data-t="3300">  direccion: { ciudad: <span class="b">String</span>, barrio: <span class="b">String</span> },</span>
    <span class="ln a" data-t="3700">  intereses: [<span class="b">String</span>]</span>
    <span class="ln">});</span>
  </div>
  <div class="a up abs" data-t="4600" style="left:40px;top:585px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;font-family:var(--mono);font-size:17px">
    <span class="mc">tipos:</span><span class="chip bc">texto → String</span><span class="chip bc">número → Number</span><span class="chip bc">sí/no → Boolean</span><span class="chip bc">fecha → Date</span><span class="chip bc">lista → [ ]</span>
  </div>`,
  },
  {
    titulo: 'Las reglas del Schema',
    texto:
      'Además del tipo, cada campo puede llevar reglas. <code>required</code> lo vuelve obligatorio, <code>enum</code> limita los valores posibles y <code>default</code> pone un valor cuando no lo envían. <code>trim</code> y <code>lowercase</code> limpian el texto antes de guardarlo. Y <code>timestamps</code> agrega solo las fechas de creación y actualización, así que ya no necesitamos <code>fechaRegistro</code>.',
    pausa: 5500,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 6 · reglas</small>Las reglas del Schema</div>
  <div class="code blk a left" data-t="300" style="left:50px;top:165px;width:775px;font-size:16px"><div class="code-h">modelos/Usuario.js</div>
    <span class="ln"><span class="k">const</span> usuarioSchema = <span class="k">new</span> mongoose.<span class="f">Schema</span>({</span>
    <span class="ln">  nombre: { type: <span class="b">String</span>, ${kw('required', 1000)}: <span class="n">true</span>, ${kw('trim', 3800)}: <span class="n">true</span> },</span>
    <span class="ln">  email: {</span>
    <span class="ln">    type: <span class="b">String</span>,</span>
    <span class="ln">    ${kw('required', 1000)}: [<span class="n">true</span>, <span class="s">'El email es obligatorio'</span>],</span>
    <span class="ln">    ${kw('unique', 1700)}: <span class="n">true</span>,</span>
    <span class="ln">    ${kw('lowercase', 3800)}: <span class="n">true</span>,</span>
    <span class="ln">    ${kw('trim', 3800)}: <span class="n">true</span></span>
    <span class="ln">  },</span>
    <span class="ln">  rol: { type: <span class="b">String</span>, ${kw('enum', 2400)}: [<span class="s">'cliente'</span>, <span class="s">'admin'</span>], ${kw('default', 3100)}: <span class="s">'cliente'</span> },</span>
    <span class="ln">  activo: { type: <span class="b">Boolean</span>, ${kw('default', 3100)}: <span class="n">true</span> },</span>
    <span class="ln">  direccion: { ciudad: <span class="b">String</span>, barrio: <span class="b">String</span> },</span>
    <span class="ln">  intereses: [<span class="b">String</span>]</span>
    <span class="ln">}, { ${kw('timestamps', 4500)}: <span class="n">true</span> });</span>
  </div>
  ${regla(165, 'required', 'Obligatorio. Sin él, no se guarda.', 1000)}
  ${regla(239, 'unique', 'No se repite. Crea el índice de S13.', 1700)}
  ${regla(313, 'enum', 'Solo acepta esos valores.', 2400)}
  ${regla(387, 'default', 'Valor si no lo envían.', 3100)}
  ${regla(461, 'trim', 'Quita espacios. lowercase pasa a minúscula.', 3800)}
  ${regla(535, 'timestamps', 'createdAt y updatedAt, solos.', 4500)}
  <div class="a up abs mc" data-t="5200" style="left:50px;top:610px;width:775px;font-size:18px;line-height:1.4"><span class="yc" style="font-weight:700">Ojo:</span> <code style="font-family:var(--mono);color:var(--fg)">unique</code> no es una validación de Mongoose: es un índice de MongoDB. Si el email se repite, el error es <span class="rc">E11000</span>.</div>`,
  },
  {
    titulo: 'Schema → Model → documentos',
    texto:
      "Con el Schema creamos un <b>Model</b>: <code>mongoose.model('Usuario', usuarioSchema)</code>. El Schema es el plano y el Model es el molde que fabrica y busca usuarios. Por convención se escribe en singular y con mayúscula; Mongoose guarda los documentos en la colección <code>usuarios</code>, en minúscula y plural.",
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 7 · model</small>Schema → Model → documentos</div>
  <div class="e-card a up" data-t="300" style="left:60px;top:175px;width:300px;height:250px;border-color:color-mix(in srgb,var(--mgs) 40%,transparent)">
    <div class="mc" style="font-family:var(--mono);font-size:15px">Schema</div>
    <h3 class="sc">El plano</h3>
    <p>Dice qué campos hay y qué reglas cumplen.</p>
    <svg width="250" height="60" viewBox="0 0 250 60" style="margin-top:14px"><g stroke="var(--mgs)" stroke-width="2" fill="none" opacity=".6"><rect x="1" y="1" width="248" height="58" rx="6" stroke-dasharray="6 5"/><path d="M14 18 H120 M14 32 H170 M14 46 H95"/></g></svg>
  </div>
  <div class="a abs mc" data-t="900" style="left:375px;top:270px;font-size:40px">→</div>
  <div class="e-card a pop" data-t="1100" style="left:430px;top:175px;width:330px;height:250px;border:2px solid var(--mgs)">
    <div class="mc" style="font-family:var(--mono);font-size:15px">Model</div>
    <h3 class="sc">El molde</h3>
    <p>Crea, busca, actualiza y borra usuarios.</p>
    <div style="font-family:var(--mono);font-size:40px;font-weight:800;color:var(--fg);margin-top:18px">Usuario</div>
  </div>
  <div class="a abs mc" data-t="1800" style="left:775px;top:270px;font-size:40px">→</div>
  <div class="coll a" data-t="2000" style="left:830px;top:175px;width:390px;height:250px"><div class="coll-h">colección: usuarios</div></div>
  <div class="doc a up" data-t="2300" style="left:855px;top:205px;width:340px;font-size:15px;padding:8px 14px">{ <span class="kk">nombre</span>: <span class="s">'Laura Gómez'</span>, … }</div>
  <div class="doc a up" data-t="2600" style="left:855px;top:275px;width:340px;font-size:15px;padding:8px 14px">{ <span class="kk">nombre</span>: <span class="s">'Andrés Ruiz'</span>, … }</div>
  <div class="doc a up" data-t="2900" style="left:855px;top:345px;width:340px;font-size:15px;padding:8px 14px">{ <span class="kk">nombre</span>: <span class="s">'Valentina Mora'</span>, … }</div>
  <div class="code blk a up" data-t="3500" style="left:60px;top:475px;width:820px;font-size:18px"><div class="code-h">modelos/Usuario.js (final del archivo)</div>
    <span class="ln"><span class="k">const</span> <span class="sc" style="font-weight:800">Usuario</span> = mongoose.<span class="f">model</span>(<span class="s">'Usuario'</span>, usuarioSchema);</span>
    <span class="ln"><span class="k">export default</span> Usuario;</span>
  </div>
  <div class="a right abs" data-t="4300" style="left:910px;top:478px;width:310px;font-size:20px;line-height:1.4">
    <span class="sc" style="font-family:var(--mono);font-weight:800">'Usuario'</span> → <span class="mgc" style="font-family:var(--mono);font-weight:800">usuarios</span><br><span class="mc">Mongoose pone el nombre de la colección en minúscula y plural.</span>
  </div>`,
  },
  {
    titulo: 'Validación en acción',
    texto:
      'Repetimos el usuario mal hecho de la escena 1, ahora con Mongoose: no se guarda y el error dice exactamente qué falló. El campo <code>emial</code> ni siquiera aparece en el error: como no está en el Schema, Mongoose lo ignora. Con los datos correctos, Mongoose limpia el email y completa <code>rol</code>, <code>activo</code> y las fechas por su cuenta.',
    pausa: 6000,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 8 · validación</small>Validación en acción</div>
  <div class="code blk a left" data-t="300" style="left:50px;top:165px;width:560px;font-size:16px">
    <span class="ln"><span class="k">await</span> Usuario.<span class="f">create</span>({</span>
    <span class="ln">  nombre: <span class="s">'Andrés Ruiz'</span>,</span>
    <span class="ln">  emial: <span class="s">'andres@correo.com'</span>,</span>
    <span class="ln">  rol: <span class="s">'superadmin'</span></span>
    <span class="ln">});</span>
  </div>
  <div class="err blk a pop" data-t="1300" style="left:650px;top:165px;width:580px">
    <span class="ln rc" style="font-weight:800">ValidationError: Usuario validation failed</span>
    <span class="ln a" data-t="1800">✗ email: El email es obligatorio</span>
    <span class="ln a" data-t="2300">✗ rol: \`superadmin\` is not a valid enum</span>
    <span class="ln a" data-t="2300">       value for path \`rol\`.</span>
    <span class="ln a mc" data-t="2900">· emial: ignorado, no está en el Schema</span>
  </div>
  <div class="a abs mgc" data-t="3600" style="left:50px;top:360px;font-family:var(--mono);font-size:16px">// con los datos correctos:</div>
  <div class="code blk a left" data-t="3700" style="left:50px;top:395px;width:560px;font-size:16px;border-color:color-mix(in srgb,var(--mongo) 50%,transparent)">
    <span class="ln"><span class="k">await</span> Usuario.<span class="f">create</span>({</span>
    <span class="ln">  nombre: <span class="s">'Andrés Ruiz'</span>,</span>
    <span class="ln">  email: <span class="s">' Andres@Correo.com '</span></span>
    <span class="ln">});</span>
  </div>
  <div class="doc a pop" data-t="4600" style="left:650px;top:360px;width:580px;font-size:15px;padding:12px 18px"><span class="p">{</span>
  <span class="kk">_id</span>: <span class="n">ObjectId</span>(<span class="s">'66fb…'</span>),
  <span class="kk">nombre</span>: <span class="s">'Andrés Ruiz'</span>,
<span class="a" data-t="5000">  <span class="kk">email</span>: <span class="s">'andres@correo.com'</span>,  <span class="e-tag">trim · lowercase</span></span>
<span class="a" data-t="5400">  <span class="kk">rol</span>: <span class="s">'cliente'</span>,  <span class="e-tag">default</span></span>
<span class="a" data-t="5400">  <span class="kk">activo</span>: <span class="n">true</span>,  <span class="e-tag">default</span></span>
<span class="a" data-t="5800">  <span class="kk">createdAt</span>: <span class="n">2026-10-13T15:04:00.000Z</span>,  <span class="e-tag">timestamps</span></span>
<span class="a" data-t="5800">  <span class="kk">updatedAt</span>: <span class="n">2026-10-13T15:04:00.000Z</span>,</span>
  <span class="kk">__v</span>: <span class="n">0</span>
<span class="p">}</span></div>`,
  },
  {
    titulo: 'CRUD: de la shell a Mongoose',
    texto:
      'Los comandos de la sesión 13 casi no cambian: en vez de <code>db.usuarios</code> usamos el Model <code>Usuario</code>. Dos diferencias: todo devuelve una promesa, así que va con <code>await</code>, y en <code>updateOne</code> Mongoose pone el <code>$set</code> por ti. Ojo: al actualizar, las reglas solo se revisan si agregas <code>{ runValidators: true }</code>.',
    pausa: 5500,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 9 · crud</small>De la shell a Mongoose</div>
  <div class="map-h a mgc" data-t="200" style="left:110px">mongosh (S13)</div>
  <div class="map-h a sc" data-t="200" style="left:640px">Mongoose (S14) · con await</div>
  ${equivalencia(180, 'insertOne()', 'Usuario.create()', 400)}
  ${equivalencia(250, 'find()', 'Usuario.find()', 800)}
  ${equivalencia(320, 'findOne()', 'Usuario.findOne() / findById()', 1200)}
  ${equivalencia(390, 'updateOne(f, { $set })', 'Usuario.updateOne(f, cambios)', 1600)}
  ${equivalencia(460, 'deleteOne()', 'Usuario.deleteOne()', 2000)}
  <div class="code a up" data-t="2800" style="left:90px;top:560px;width:1100px;font-size:17px"><span class="k">await</span> Usuario.<span class="f">updateOne</span>({ email: <span class="s">'laura@correo.com'</span> }, { rol: <span class="s">'admin'</span> }, { ${kw('runValidators', 3800)}: <span class="n">true</span> });</div>
  <div class="a up abs sc" data-t="3300" style="left:90px;top:640px;font-size:19px;font-weight:700">Sin $set: Mongoose lo agrega solo. ¿Te acuerdas del error de la pausa activa?</div>`,
  },
  {
    titulo: 'En tu ruta de Express',
    texto:
      'Así se ve en la API. La ruta <code>POST /usuarios</code> recibe los datos del formulario en <code>req.body</code> (por eso necesitamos <code>express.json()</code>) y se los pasa a <code>Usuario.create()</code>. Si las reglas se cumplen, responde <b>201</b> con el usuario creado. Si algo falla, el <code>catch</code> responde <b>400</b> con el mensaje del error.',
    pausa: 5500,
    html: `
  <div class="ttl a up" data-t="0"><small class="yc">// escena 10 · express + mongoose</small>En tu ruta de Express</div>
  <div class="code blk a left" data-t="300" style="left:50px;top:170px;width:700px;font-size:16px"><div class="code-h">servidor.js</div>
    <span class="ln"><span class="k">import</span> Usuario <span class="k">from</span> <span class="s">'./modelos/Usuario.js'</span>;</span>
    <span class="ln">app.<span class="f">use</span>(express.<span class="f">json</span>());</span>
    <span class="ln">&nbsp;</span>
    <span class="ln">app.<span class="f">post</span>(<span class="s">'/usuarios'</span>, <span class="k">async</span> (req, res) => {</span>
    <span class="ln">  <span class="k">try</span> {</span>
    <span class="ln emb a" data-t="1800">    <span class="k">const</span> usuario = <span class="k">await</span> Usuario.<span class="f">create</span>(req.body);</span>
    <span class="ln embg a" data-t="3000">    res.<span class="f">status</span>(<span class="n">201</span>).<span class="f">json</span>(usuario);</span>
    <span class="ln">  } <span class="k">catch</span> (error) {</span>
    <span class="ln a" data-t="4200" style="background:color-mix(in srgb,var(--red) 14%,transparent);border-radius:4px">    res.<span class="f">status</span>(<span class="n">400</span>).<span class="f">json</span>({ error: error.message });</span>
    <span class="ln">  }</span>
    <span class="ln">});</span>
  </div>
  <div class="node a right" data-t="1000" style="left:800px;top:170px;width:420px;height:84px;border-color:color-mix(in srgb,var(--yellow) 60%,transparent)"><b class="yc" style="font-size:22px">POST /usuarios</b><span>{ nombre, email, … } en req.body</span></div>
  <div class="a abs mc" data-t="1500" style="left:995px;top:258px;font-size:26px">↓</div>
  <div class="node a right" data-t="1800" style="left:800px;top:296px;width:420px;height:84px;border-color:var(--mgs)"><b class="sc" style="font-size:22px">Mongoose revisa el Schema</b><span>required · enum · unique…</span></div>
  <div class="a abs mc" data-t="2400" style="left:900px;top:384px;font-size:26px">↙</div>
  <div class="a abs mc" data-t="2400" style="left:1090px;top:384px;font-size:26px">↘</div>
  <div class="node a pop" data-t="3000" style="left:800px;top:424px;width:200px;height:96px;border-color:var(--mongo)"><b class="mgc" style="font-size:24px">✓ 201</b><span>Usuario creado</span></div>
  <div class="node a pop" data-t="4200" style="left:1020px;top:424px;width:200px;height:96px;border-color:var(--red)"><b class="rc" style="font-size:24px">✗ 400</b><span>Datos inválidos</span></div>
  <div class="a up abs mc" data-t="5000" style="left:50px;top:560px;width:1170px;font-size:20px;line-height:1.4">Las rutas GET, PUT y DELETE siguen el mismo patrón: <span class="sc" style="font-family:var(--mono)">async</span>, <span class="sc" style="font-family:var(--mono)">await Usuario…</span> y <span class="sc" style="font-family:var(--mono)">try/catch</span>.</div>`,
  },
  {
    titulo: 'En resumen',
    texto:
      'Mongoose conecta Express con MongoDB y le pone reglas a tus datos. La cadena de conexión vive en el <code>.env</code>, el <b>Schema</b> define campos y reglas, y el <b>Model</b> <code>Usuario</code> hace el CRUD con <code>await</code>. Todavía falta algo en nuestro usuario: la contraseña. Eso viene en la próxima sesión.',
    pausa: 6000,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 11</small>En resumen</div>
  <div class="a left abs" data-t="500" style="left:60px;top:175px;display:flex;gap:18px;align-items:center;font-size:26px"><span class="chip" style="color:var(--red);font-size:18px;min-width:150px;justify-content:center">.env</span>La cadena de conexión, fuera de GitHub</div>
  <div class="a left abs" data-t="1000" style="left:60px;top:250px;display:flex;gap:18px;align-items:center;font-size:26px"><span class="chip sc" style="font-size:18px;min-width:150px;justify-content:center">Schema</span>Los campos y sus reglas</div>
  <div class="a left abs" data-t="1500" style="left:60px;top:325px;display:flex;gap:18px;align-items:center;font-size:26px"><span class="chip sc" style="font-size:18px;min-width:150px;justify-content:center">Model</span><span><span style="font-family:var(--mono)">Usuario</span>: crea, busca, actualiza y borra</span></div>
  <div class="a left abs" data-t="2000" style="left:60px;top:400px;display:flex;gap:18px;align-items:center;font-size:26px"><span class="chip yc" style="font-size:18px;min-width:150px;justify-content:center">await</span>Todo lo de Mongoose devuelve una promesa</div>
  <div class="code a up" data-t="2600" style="left:60px;top:500px;width:720px;font-size:18px;border-color:color-mix(in srgb,var(--red) 45%,transparent)">password: <span class="s">'&lt;texto plano&gt;'</span>   <span class="c">// ✗ nunca así</span>
password: <span class="s">'$2b$10$…'</span>         <span class="c">// ✓ hash, en S15</span></div>
  <div class="a pop abs" data-t="3400" style="left:830px;top:470px;width:390px;background:var(--mgs);color:var(--bg);border-radius:14px;padding:22px 26px">
    <div style="font-family:var(--mono);font-size:16px">Siguiente · Sesión 15</div>
    <div style="font-size:30px;font-weight:800;line-height:1.2">Contraseñas seguras con hash</div>
  </div>`,
  },
];

const LEYENDA = [
  { color: 'var(--color-code)', texto: 'Express' },
  { color: 'var(--color-morado)', texto: 'Mongoose' },
  { color: 'var(--color-accent)', texto: 'MongoDB' },
];

/** Animación de la sesión 14: qué es Mongoose y cómo se usa. */
export function ExplicaMongoose() {
  return (
    <ReproductorEscenas
      prompt="sesion14 --explica mongoose"
      titulo="Mongoose: reglas para los datos de tu emprendimiento"
      leyenda={LEYENDA}
      escenas={ESCENAS}
      claseEscenas={styles.escenas}
      acento="var(--color-morado)"
    />
  );
}
