import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import styles from './EscenasMongoSql.module.css';

/*
 * "¿Qué es MongoDB y en qué se diferencia de SQL?" — reproductor de escenas.
 *
 * Nueve escenas sobre un lienzo fijo de 1280 × 720 que se escala al ancho.
 * Cada pieza de una escena trae `data-t` (a qué milisegundo aparece) y a veces
 * `data-at="ms:clase"` (a qué milisegundo cambia de estado). El reproductor
 * programa esos tiempos, lleva la barra de progreso y, si está en
 * "reproducir", pasa sola a la escena siguiente.
 *
 * Igual que en los tutoriales de Demos.tsx, las escenas son HTML escrito como
 * cadenas constantes de este archivo y se montan con `innerHTML`: nada viene
 * de un usuario. `.card` ya existe en el CSS global del sitio, así que aquí la
 * tarjeta se llama `e-card`.
 */

interface Escena {
  titulo: string;
  /** Narración bajo el reproductor. Admite <b> y <code>. */
  texto: string;
  /** Cuánto se queda la escena completa en pantalla antes de pasar. */
  pausa: number;
  html: string;
}

const fila = (cols: string, celdas: string[], clase = '', attrs = '') =>
  `<div class="tr ${clase}" style="grid-template-columns:${cols}" ${attrs}>${celdas
    .map((c) => `<span>${c}</span>`)
    .join('')}</div>`;

const ESCENAS: Escena[] = [
  {
    titulo: '¿Dónde viven los datos?',
    texto:
      'Cuando alguien se registra en tu emprendimiento, sus datos tienen que guardarse en un lugar que no se borre al apagar el servidor: una <b>base de datos</b>. Hay dos grandes familias: las <b>relacionales (SQL)</b> y las <b>NoSQL</b>, como <b>MongoDB</b>.',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="mgc">// escena 1</small>¿Dónde viven los datos?</div>
  <div class="form a left" data-t="400" style="left:110px;top:200px;width:330px">
    <div style="font-weight:800;font-size:20px">Regístrate</div>
    <div class="lab">Nombre</div><div class="inp">Laura Gómez</div>
    <div class="lab">Email</div><div class="inp">laura@correo.com</div>
    <div class="go">Crear cuenta</div>
  </div>
  <svg class="lines abs" style="left:450px;top:330px" width="220" height="60" viewBox="0 0 220 60"><path pathLength="1" data-t="1400" d="M10 30 H200" stroke="var(--yellow)"/><path pathLength="1" data-t="1900" d="M185 15 L205 30 L185 45" stroke="var(--yellow)"/></svg>
  <svg class="a pop abs" data-t="2000" style="left:690px;top:215px" width="190" height="240" viewBox="0 0 190 240">
    <ellipse cx="95" cy="40" rx="85" ry="28" fill="var(--panel-2)" stroke="var(--muted)" stroke-width="3"/>
    <path d="M10 40 V190 A85 28 0 0 0 180 190 V40" fill="var(--panel)" stroke="var(--muted)" stroke-width="3"/>
    <path d="M10 90 A85 28 0 0 0 180 90 M10 140 A85 28 0 0 0 180 140" fill="none" stroke="var(--line)" stroke-width="3"/>
    <text x="95" y="145" text-anchor="middle" font-family="JetBrains Mono Variable, monospace" font-size="56" font-weight="800" fill="var(--yellow)">?</text>
  </svg>
  <div class="a up abs" data-t="3000" style="left:560px;top:500px;display:flex;gap:18px">
    <span class="chip sqlc">Relacional (SQL)</span><span class="mc" style="font-size:22px;align-self:center">o</span><span class="chip mgc">NoSQL · MongoDB</span>
  </div>`,
  },
  {
    titulo: 'SQL: todo en tablas',
    texto:
      'Una base de datos relacional guarda la información en <b>tablas</b>, como una hoja de cálculo. Cada <b>fila</b> es un usuario y cada <b>columna</b> es un dato. La regla: todas las filas tienen <b>exactamente las mismas columnas</b>, definidas de antemano.',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="sqlc">// escena 2 · relacional</small>SQL: todo en tablas</div>
  <div class="tbl a up" data-t="400" style="left:110px;top:220px;width:760px">
    <div class="cap-t">tabla: usuarios</div>
    ${fila('80px 230px 280px 1fr', ['id', 'nombre', 'email', 'ciudad'], 'th a', "data-t='400' data-at='2800:hl'")}
    ${fila('80px 230px 280px 1fr', ['1', 'Laura Gómez', 'laura@correo.com', 'Medellín'], 'a left', "data-t='1100'")}
    ${fila('80px 230px 280px 1fr', ['2', 'Andrés Ruiz', 'andres@correo.com', 'Cali'], 'a left', "data-t='1500'")}
    ${fila('80px 230px 280px 1fr', ['3', 'Valentina Mora', 'vale@correo.com', 'Bogotá'], 'a left', "data-t='1900'")}
  </div>
  <div class="a right abs" data-t="2900" style="left:900px;top:228px;width:320px;font-size:21px;line-height:1.4">
    <span class="yc" style="font-weight:800">← Columnas fijas</span><br><span class="mc">Todas las filas tienen las mismas.</span>
  </div>
  <div class="a up abs" data-t="3600" style="left:110px;top:520px;display:flex;gap:14px;align-items:center">
    <span class="mc" style="font-size:19px">Ejemplos:</span><span class="chip sqlc">MySQL</span><span class="chip sqlc">PostgreSQL</span><span class="chip sqlc">SQL Server</span>
  </div>`,
  },
  {
    titulo: 'Relaciones y JOIN',
    texto:
      'Si Laura hace varios pedidos, SQL no los mete en su fila: crea <b>otra tabla</b> y los conecta con un número, el <code>usuario_id</code>. Para ver a Laura con sus pedidos hay que <b>unir las tablas</b> con un <code>JOIN</code>. Por eso se llaman bases de datos <b>relacionales</b>.',
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="sqlc">// escena 3 · relacional</small>Relaciones entre tablas</div>
  <div class="tbl a left" data-t="300" style="left:60px;top:175px;width:320px">
    <div class="cap-t">usuarios</div>
    ${fila('70px 1fr', ['id', 'nombre'], 'th')}
    ${fila('70px 1fr', ["<b class='yc'>1</b>", 'Laura Gómez'], '', "data-at='2600:hl'")}
    ${fila('70px 1fr', ['2', 'Andrés Ruiz'], '', "data-at='2600:dim'")}
  </div>
  <div class="tbl a right" data-t="700" style="left:560px;top:175px;width:660px">
    <div class="cap-t">pedidos</div>
    ${fila('70px 150px 1fr 150px', ['id', 'usuario_id', 'producto', 'total'], 'th')}
    ${fila('70px 150px 1fr 150px', ['10', "<b class='yc'>1</b>", 'Collar artesanal', '45000'], '', "data-at='2600:hl'")}
    ${fila('70px 150px 1fr 150px', ['11', "<b class='yc'>1</b>", 'Aretes de plata', '38000'], '', "data-at='2600:hl'")}
    ${fila('70px 150px 1fr 150px', ['12', '2', 'Pulsera tejida', '25000'], '', "data-at='2600:dim'")}
  </div>
  <svg class="lines abs" style="left:380px;top:175px" width="180" height="200" viewBox="0 0 180 200">
    <path pathLength="1" data-t="1500" d="M0 72 C 90 72, 90 72, 180 72" stroke="var(--yellow)"/>
    <path pathLength="1" data-t="1800" d="M0 72 C 90 72, 90 120, 180 120" stroke="var(--yellow)"/>
    <path pathLength="1" data-t="2100" d="M0 120 C 90 120, 90 168, 180 168" stroke="var(--muted)"/>
  </svg>
  <div class="code a up" data-t="3200" style="left:60px;top:410px"><span class="k">SELECT</span> nombre, producto <span class="k">FROM</span> usuarios
<span class="k">JOIN</span> pedidos <span class="k">ON</span> pedidos.usuario_id = usuarios.id
<span class="k">WHERE</span> usuarios.id = <span class="s">1</span>;</div>
  <div class="tbl a up" data-t="4300" style="left:760px;top:430px;width:460px;outline-color:var(--yellow)">
    <div class="cap-t yc">resultado del JOIN</div>
    ${fila('1fr 1fr', ['nombre', 'producto'], 'th')}
    ${fila('1fr 1fr', ['Laura Gómez', 'Collar artesanal'])}
    ${fila('1fr 1fr', ['Laura Gómez', 'Aretes de plata'])}
  </div>`,
  },
  {
    titulo: 'Cambiar la estructura',
    texto:
      '¿Y si ahora quieres guardar el Instagram de los clientes? En SQL primero hay que <b>cambiar la estructura de la tabla</b> con <code>ALTER TABLE</code>. La columna nueva aparece en <b>todas</b> las filas, aunque la mayoría quede vacía (<code>NULL</code>).',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="sqlc">// escena 4 · relacional</small>¿Un dato nuevo? Cambia la tabla</div>
  <div class="code a up" data-t="300" style="left:110px;top:175px;width:1060px"><span class="typed" data-type="ALTER TABLE usuarios ADD COLUMN instagram VARCHAR(50);" data-t="600"></span></div>
  <div class="tbl a up" data-t="300" style="left:110px;top:320px;width:1060px">
    <div class="cap-t">tabla: usuarios</div>
    <div class="tr th" style="grid-template-columns:70px 230px 260px 170px 1fr"><span>id</span><span>nombre</span><span>email</span><span>ciudad</span><span class="newcol" data-at="3300:in">instagram</span></div>
    <div class="tr" style="grid-template-columns:70px 230px 260px 170px 1fr"><span>1</span><span>Laura Gómez</span><span>laura@correo.com</span><span>Medellín</span><span class="newcol" data-at="3600:in">@laura.joyas</span></div>
    <div class="tr" style="grid-template-columns:70px 230px 260px 170px 1fr"><span>2</span><span>Andrés Ruiz</span><span>andres@correo.com</span><span>Cali</span><span class="newcol null" data-at="3800:in">NULL</span></div>
    <div class="tr" style="grid-template-columns:70px 230px 260px 170px 1fr"><span>3</span><span>Valentina Mora</span><span>vale@correo.com</span><span>Bogotá</span><span class="newcol null" data-at="4000:in">NULL</span></div>
  </div>
  <div class="a up abs rc" data-t="4400" style="left:110px;top:560px;font-size:22px;font-weight:700">La columna se agrega a todos, la usen o no.</div>`,
  },
  {
    titulo: 'MongoDB: documentos',
    texto:
      'MongoDB guarda cada usuario como un <b>documento</b>: un objeto muy parecido a los de JavaScript. La regla aquí es <b>lo que se usa junto, se guarda junto</b>: la dirección, los intereses y hasta los pedidos pueden ir dentro del mismo documento. Sin <code>JOIN</code>.',
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="mgc">// escena 5 · mongodb</small>Un documento por usuario</div>
  <div class="tbl a left" data-t="300" data-at="3000:dim" style="left:60px;top:200px;width:300px">
    <div class="cap-t">usuarios</div>${fila('60px 1fr', ['id', 'nombre'], 'th')}${fila('60px 1fr', ['1', 'Laura Gómez'])}
  </div>
  <div class="tbl a left" data-t="500" data-at="3000:dim" style="left:60px;top:380px;width:300px">
    <div class="cap-t">pedidos</div>${fila('1fr 100px', ['producto', 'user'], 'th')}${fila('1fr 100px', ['Collar', '1'])}${fila('1fr 100px', ['Aretes', '1'])}
  </div>
  <svg class="lines abs" style="left:370px;top:250px" width="150" height="260" viewBox="0 0 150 260"><path pathLength="1" data-t="1000" d="M0 10 C 80 10, 70 120, 140 120" stroke="var(--mongo)"/><path pathLength="1" data-t="1200" d="M0 220 C 80 220, 70 130, 140 130" stroke="var(--mongo)"/></svg>
  <div class="doc blk a pop" data-t="1500" style="left:540px;top:195px;width:660px"><div class="doc-h">colección: usuarios</div><span class="ln a" data-t="1700"><span class="p">{</span></span><span class="ln a" data-t="1900">  <span class="kk">_id</span>: <span class="n">ObjectId</span>(<span class="s">'66f9…'</span>),</span><span class="ln a" data-t="2100">  <span class="kk">nombre</span>: <span class="s">'Laura Gómez'</span>,</span><span class="ln a" data-t="2300">  <span class="kk">email</span>: <span class="s">'laura@correo.com'</span>,</span><span class="ln a emb" data-t="2700">  <span class="kk">direccion</span>: { <span class="kk">ciudad</span>: <span class="s">'Medellín'</span>, <span class="kk">barrio</span>: <span class="s">'Laureles'</span> },</span><span class="ln a emb" data-t="3100">  <span class="kk">intereses</span>: [<span class="s">'accesorios'</span>, <span class="s">'ropa'</span>],</span><span class="ln a emb" data-t="3500">  <span class="kk">pedidos</span>: [</span><span class="ln a emb" data-t="3700">    { <span class="kk">producto</span>: <span class="s">'Collar artesanal'</span>, <span class="kk">total</span>: <span class="n">45000</span> },</span><span class="ln a emb" data-t="3900">    { <span class="kk">producto</span>: <span class="s">'Aretes de plata'</span>, <span class="kk">total</span>: <span class="n">38000</span> }</span><span class="ln a emb" data-t="4000">  ]</span><span class="ln a" data-t="4100"><span class="p">}</span></span></div>
  <div class="a up abs mgc" data-t="4600" style="left:540px;top:600px;font-size:22px;font-weight:700">Todo lo de Laura, en un solo lugar.</div>`,
  },
  {
    titulo: 'Una colección flexible',
    texto:
      'Los documentos se agrupan en <b>colecciones</b>. A diferencia de una tabla, <b>cada documento puede tener campos distintos</b>: Laura tiene Instagram, Andrés tiene teléfono y nadie tuvo que cambiar la estructura. Ojo: flexible no significa desordenado. En la sesión 14 le pondremos reglas con <b>Mongoose</b>.',
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="mgc">// escena 6 · mongodb</small>Cada documento, su propia forma</div>
  <div class="coll a" data-t="300" style="left:60px;top:170px;width:1160px;height:440px"><div class="coll-h">colección: usuarios</div></div>
  <div class="doc a up" data-t="800" style="left:95px;top:215px;width:350px;font-size:17px">{
  <span class="kk">nombre</span>: <span class="s">'Laura Gómez'</span>,
  <span class="kk">email</span>: <span class="s">'laura@…'</span>,
  <span class="emb"><span class="kk">instagram</span>: <span class="s">'@laura.joyas'</span></span>
}<span class="badge a pop" data-t="3000">✓ válido</span></div>
  <div class="doc a up" data-t="1400" style="left:465px;top:215px;width:350px;font-size:17px">{
  <span class="kk">nombre</span>: <span class="s">'Andrés Ruiz'</span>,
  <span class="kk">email</span>: <span class="s">'andres@…'</span>,
  <span class="emb"><span class="kk">telefono</span>: <span class="s">'3001234567'</span></span>
}<span class="badge a pop" data-t="3200">✓ válido</span></div>
  <div class="doc a up" data-t="2000" style="left:835px;top:215px;width:350px;font-size:17px">{
  <span class="kk">nombre</span>: <span class="s">'Valentina Mora'</span>,
  <span class="kk">email</span>: <span class="s">'vale@…'</span>
}<span class="badge a pop" data-t="3400">✓ válido</span></div>
  <div class="a up abs" data-t="4000" style="left:95px;top:470px;width:1090px;font-size:24px;line-height:1.45">
    <span class="mgc" style="font-weight:800">Sin ALTER TABLE y sin columnas vacías.</span><br>
    <span class="yc">Pero flexible ≠ desordenado:</span> <span class="mc">en S14 le pondremos reglas con Mongoose.</span>
  </div>`,
  },
  {
    titulo: 'Mismo concepto, otro nombre',
    texto:
      "Muchas ideas son las mismas con otro nombre: una <b>tabla</b> es una <b>colección</b>, una <b>fila</b> es un <b>documento</b> y una <b>columna</b> es un <b>campo</b>. Y en vez de escribir SQL, a MongoDB le hablamos con objetos: <code>find({ ciudad: 'Medellín' })</code>.",
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="yc">// escena 7 · diccionario</small>Mismo concepto, otro nombre</div>
  <div class="map-row a left" data-t="400" style="top:160px"><div class="l">Tabla</div><div class="mc" style="text-align:center;font-size:30px">→</div><div class="r">Colección</div></div>
  <div class="map-row a left" data-t="900" style="top:236px"><div class="l">Fila</div><div class="mc" style="text-align:center;font-size:30px">→</div><div class="r">Documento</div></div>
  <div class="map-row a left" data-t="1400" style="top:312px"><div class="l">Columna</div><div class="mc" style="text-align:center;font-size:30px">→</div><div class="r">Campo</div></div>
  <div class="map-row a left" data-t="1900" style="top:388px"><div class="l">JOIN</div><div class="mc" style="text-align:center;font-size:30px">→</div><div class="r">Embeber<small>($lookup si hace falta)</small></div></div>
  <div class="code a up" data-t="2800" style="left:150px;top:500px;width:475px;font-size:17px"><span class="c">-- SQL</span>
<span class="k">SELECT</span> * <span class="k">FROM</span> usuarios
<span class="k">WHERE</span> ciudad = <span class="s">'Medellín'</span>;</div>
  <div class="code a up" data-t="3400" style="left:655px;top:500px;width:475px;font-size:17px;border-color:color-mix(in srgb,var(--mongo) 50%,transparent)"><span class="c">// MongoDB</span>
<span class="b">db</span>.usuarios.<span class="f">find</span>({
  ciudad: <span class="s">'Medellín'</span>
})</div>`,
  },
  {
    titulo: '¿Cuál uso?',
    texto:
      'Ninguna es mejor que la otra: <b>depende del problema</b>. SQL brilla cuando los datos tienen muchas relaciones y una estructura estable, como la contabilidad o un inventario. MongoDB brilla cuando los datos cambian de forma y se leen juntos, como un catálogo o perfiles de usuario. Muchas empresas usan las dos.',
    pausa: 5500,
    html: `
  <div class="ttl a up" data-t="0"><small class="yc">// escena 8</small>¿Cuál uso?</div>
  <div class="e-card a left" data-t="400" style="left:60px;top:180px;width:560px;border-color:color-mix(in srgb,var(--sql) 55%,transparent)">
    <h3 class="sqlc">Relacional (SQL)</h3>
    <ul><li>Muchas relaciones entre datos</li><li>Estructura estable que casi no cambia</li><li>Reglas estrictas desde el diseño</li></ul>
    <p class="mc" style="font-size:18px;margin:18px 0 0">Ej.: contabilidad, inventarios, matrículas</p>
  </div>
  <div class="e-card a right" data-t="1000" style="left:660px;top:180px;width:560px;border-color:color-mix(in srgb,var(--mongo) 55%,transparent)">
    <h3 class="mgc">MongoDB</h3>
    <ul><li>Datos que cambian de forma</li><li>Datos que se leen juntos</li><li>Apps en JavaScript: casi sin traducir</li></ul>
    <p class="mc" style="font-size:18px;margin:18px 0 0">Ej.: catálogos, perfiles, contenido, <span class="mgc">tu emprendimiento</span></p>
  </div>
  <div class="a pop abs big" data-t="2200" style="left:0;width:1280px;top:520px;text-align:center">Ninguna es mejor: <span class="yc">depende del problema.</span></div>`,
  },
  {
    titulo: 'En resumen',
    texto:
      'MongoDB es una base de datos <b>NoSQL</b> que guarda <b>documentos</b> parecidos a objetos de JavaScript, agrupados en <b>colecciones</b>. Por eso encaja tan bien con Node y Express. Ahora sí: ¡a instalarlo y hacer nuestro primer CRUD!',
    pausa: 6000,
    html: `
  <div class="ttl a up" data-t="0"><small class="mgc">// escena 9</small>En resumen</div>
  <div class="a left abs" data-t="500" style="left:60px;top:180px;display:flex;gap:18px;align-items:center;font-size:28px"><span class="chip sqlc" style="font-size:20px">SQL</span>Tablas, filas iguales, relaciones con JOIN</div>
  <div class="a left abs" data-t="1100" style="left:60px;top:260px;display:flex;gap:18px;align-items:center;font-size:28px"><span class="chip mgc" style="font-size:20px">MongoDB</span>Documentos flexibles, lo que se usa junto va junto</div>
  <div class="code a up" data-t="1800" style="left:60px;top:360px;width:720px;font-size:22px;border-color:color-mix(in srgb,var(--mongo) 50%,transparent)"><span class="k">const</span> usuario = { nombre: <span class="s">'Laura'</span> }  <span class="c">// JavaScript</span>
{ nombre: <span class="s">'Laura'</span> }                  <span class="c">// MongoDB</span></div>
  <div class="a pop abs" data-t="2800" style="left:830px;top:360px;width:390px;background:var(--mongo);color:var(--bg);border-radius:14px;padding:22px 26px">
    <div style="font-family:var(--mono);font-size:16px">Siguiente:</div>
    <div style="font-size:30px;font-weight:800;line-height:1.2">Instalar MongoDB y hacer CRUD</div>
  </div>`,
  },
];

const ANCHO_LIENZO = 1280;

export function MongoVsSql() {
  const [escena, setEscena] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(true);
  /** Subirlo repite la escena actual. */
  const [vuelta, setVuelta] = useState(0);
  /** No arranca hasta que el reproductor se ve por primera vez. */
  const [activo, setActivo] = useState(false);

  const raizRef = useRef<HTMLDivElement>(null);
  const vistaRef = useRef<HTMLDivElement>(null);
  const lienzoRef = useRef<HTMLDivElement>(null);
  const barraRef = useRef<HTMLElement>(null);
  const reproduciendoRef = useRef(reproduciendo);
  const visibleRef = useRef(false);
  const finRef = useRef(0);

  useEffect(() => {
    reproduciendoRef.current = reproduciendo;
  }, [reproduciendo]);

  // El lienzo mide 1280 px de diseño y se escala al ancho que haya.
  useEffect(() => {
    const vista = vistaRef.current;
    const lienzo = lienzoRef.current;
    if (!vista || !lienzo) return;
    const ajustar = () => {
      lienzo.style.transform = `scale(${vista.clientWidth / ANCHO_LIENZO})`;
    };
    ajustar();
    const observador = new ResizeObserver(ajustar);
    observador.observe(vista);
    return () => observador.disconnect();
  }, []);

  // Arranca al verse y no avanza de escena mientras está fuera de pantalla: en
  // una lección larga, si corriera desde que carga la página, el estudiante
  // llegaría a la mitad de la explicación.
  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        visibleRef.current = entrada.isIntersecting;
        if (entrada.isIntersecting) setActivo(true);
      },
      { threshold: 0.4 },
    );
    observador.observe(raiz);
    return () => observador.disconnect();
  }, []);

  // La línea de tiempo de la escena: programa cada pieza y lleva la barra.
  useEffect(() => {
    const lienzo = lienzoRef.current;
    if (!activo || !lienzo) return;
    const rapido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const temporizadores: number[] = [];
    let cuadro = 0;
    const en = (ms: number, fn: () => void) =>
      temporizadores.push(window.setTimeout(fn, rapido ? 0 : ms));

    const teclear = (el: HTMLElement, texto: string) => {
      if (rapido) {
        el.textContent = texto;
        el.classList.add('done');
        return;
      }
      let i = 0;
      el.textContent = '';
      const paso = () => {
        el.textContent = texto.slice(0, ++i);
        if (i < texto.length) temporizadores.push(window.setTimeout(paso, 45));
        else el.classList.add('done');
      };
      paso();
    };

    const sc = ESCENAS[escena];
    lienzo.innerHTML = sc.html;
    let maxT = 0;
    lienzo.querySelectorAll<HTMLElement>('[data-t]').forEach((el) => {
      const t = Number(el.dataset.t);
      maxT = Math.max(maxT, t);
      const texto = el.dataset.type;
      if (texto) en(t, () => teclear(el, texto));
      else en(t, () => el.classList.add('in'));
    });
    lienzo.querySelectorAll<HTMLElement>('[data-at]').forEach((el) => {
      (el.dataset.at ?? '').split(',').forEach((par) => {
        const [ms, clase] = par.split(':');
        maxT = Math.max(maxT, Number(ms));
        en(Number(ms), () => el.classList.add(clase));
      });
    });

    const inicio = performance.now();
    const fin = inicio + maxT + sc.pausa;
    finRef.current = fin;

    const avanzar = () => {
      const p = Math.min(1, (performance.now() - inicio) / (fin - inicio));
      if (barraRef.current) {
        barraRef.current.style.transform = `scaleX(${(escena + p) / ESCENAS.length})`;
      }
      if (p < 1) {
        cuadro = requestAnimationFrame(avanzar);
        return;
      }
      if (escena === ESCENAS.length - 1) {
        setReproduciendo(false);
        return;
      }
      if (!reproduciendoRef.current) return;
      // Terminó la escena pero el reproductor no se ve: espera a que vuelva.
      if (!visibleRef.current) {
        cuadro = requestAnimationFrame(avanzar);
        return;
      }
      setEscena(escena + 1);
    };
    avanzar();

    return () => {
      temporizadores.forEach(clearTimeout);
      cancelAnimationFrame(cuadro);
    };
  }, [activo, escena, vuelta]);

  function ir(k: number) {
    setEscena(Math.max(0, Math.min(ESCENAS.length - 1, k)));
    setVuelta((n) => n + 1);
  }

  function alternar() {
    const nuevo = !reproduciendo;
    setReproduciendo(nuevo);
    // Si la escena ya había terminado, "reproducir" sigue con la próxima; en la
    // última, vuelve a empezar.
    if (nuevo && performance.now() >= finRef.current) {
      ir(escena === ESCENAS.length - 1 ? 0 : escena + 1);
    }
  }

  // Teclas solo con el foco dentro del reproductor, como en los tutoriales.
  function alTeclado(e: KeyboardEvent<HTMLDivElement>) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const destino = e.target as HTMLElement;
    if (destino.closest('input, textarea, [contenteditable="true"]')) return;
    // Sobre un botón, Espacio y Enter lo activan: no se toca.
    if (destino.closest('button') && (e.key === ' ' || e.key === 'Enter')) return;
    if (e.key === ' ') {
      e.preventDefault();
      alternar();
    } else if (e.key === 'ArrowRight') ir(escena + 1);
    else if (e.key === 'ArrowLeft') ir(escena - 1);
    else if (e.key.toLowerCase() === 'r') ir(escena);
  }

  const sc = ESCENAS[escena];

  return (
    <div className={styles.raiz} ref={raizRef} tabIndex={-1} onKeyDown={alTeclado}>
      <div className={styles.cabecera}>
        <div>
          <div className={styles.prompt}>sesion13 --explica bases-de-datos</div>
          <p className={styles.titulo}>¿Qué es MongoDB y en qué se diferencia de SQL?</p>
        </div>
        <div className={styles.leyenda}>
          <span data-c="sql">Relacional (SQL)</span>
          <span data-c="mongo">MongoDB</span>
        </div>
      </div>

      <section className={styles.reproductor}>
        <div className={styles.vista} ref={vistaRef} role="img" aria-label={`Escena: ${sc.titulo}`}>
          <div className={styles.lienzo} ref={lienzoRef} />
        </div>
        <div className={styles.progreso}>
          <i ref={barraRef} />
        </div>
        <div className={styles.controles}>
          <button type="button" className={styles.boton} onClick={() => ir(escena - 1)} disabled={escena === 0}>
            ← Anterior
          </button>
          <button type="button" className={`${styles.boton} ${styles.botonPri}`} onClick={alternar}>
            {reproduciendo ? '❚❚ Pausa' : '▶ Reproducir'}
          </button>
          <button type="button" className={styles.boton} onClick={() => ir(escena)}>
            ↻ Repetir escena
          </button>
          <button
            type="button"
            className={styles.boton}
            onClick={() => ir(escena + 1)}
            disabled={escena === ESCENAS.length - 1}
          >
            Siguiente →
          </button>
          <div className={styles.puntos}>
            {ESCENAS.map((s, k) => (
              <button
                key={k}
                type="button"
                data-estado={k === escena ? 'actual' : k < escena ? 'hecho' : undefined}
                aria-label={`Escena ${k + 1}: ${s.titulo}`}
                aria-current={k === escena ? 'step' : undefined}
                title={s.titulo}
                onClick={() => ir(k)}
              >
                {k + 1}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.narracion} aria-live="polite">
        <div className={styles.numero}>
          Escena {escena + 1} de {ESCENAS.length}
        </div>
        <h3 className={styles.tituloEscena}>{sc.titulo}</h3>
        <p className={styles.texto} dangerouslySetInnerHTML={{ __html: sc.texto }} />
        <div className={styles.pista}>Espacio: pausa/continúa · ← → cambiar de escena · R repetir</div>
      </section>
    </div>
  );
}
