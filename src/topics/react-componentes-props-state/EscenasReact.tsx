import { ReproductorEscenas, type Escena } from '../../components/visuals/ReproductorEscenas';
import styles from './EscenasReact.module.css';

/*
 * "React por dentro": doce escenas repartidas en tres videos cortos, cada uno
 * junto a la lección que explica:
 *
 *   - ExplicaComponentes (4): el problema, el molde, Mayúscula y JSX, el árbol.
 *   - ExplicaProps (3): los datos viajan, el nombre coincide, bajan y no se tocan.
 *   - ExplicaEstado (5): variable vs. state, cómo se actualiza la pantalla,
 *     cada render empieza de cero, cada tarjeta su cuenta, y el resumen.
 *
 * Un solo video de doce escenas quedaba lejos de las lecciones: el
 * estudiante veía props y state antes de leer qué eran. El motor y los
 * controles están en `ReproductorEscenas`; aquí van el contenido y, en
 * EscenasReact.module.css, el aspecto de las piezas.
 *
 * El código sigue los nombres del resto de la sesión: el componente es
 * `TarjetaProducto` y vive en `src/componentes/`.
 */

/** Palabra del código que se resalta a los `ms` indicados. */
const kw = (txt: string, ms: number, clase = 'hl') => `<span class="kw" data-at="${ms}:${clase}">${txt}</span>`;
const PUNTERO = `<svg class="ptr" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.4-6.8L4 20z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
/** Cursor quieto junto al botón y una onda por cada clic. */
const clics = (x: number, y: number, tiempos: number[]) =>
  `<div class="a abs" data-t="${Math.max(0, tiempos[0] - 500)}" style="left:${x + 4}px;top:${y - 12}px">${PUNTERO}</div>` +
  tiempos.map((ms) => `<div class="rip" data-at="${ms}:go" style="left:${x}px;top:${y - 6}px"></div>`).join('');
/** Valor de `data-seq`: el texto que tiene la pieza a cada milisegundo. */
const seq = (pares: [number, string][]) => pares.map(([ms, t]) => `${ms}:${t}`).join('|');

const DULCES: [string, string][] = [
  ['Torta', '$45.000'],
  ['Galletas', '$18.000'],
  ['Cupcakes', '$30.000'],
  ['Brownie', '$9.000'],
  ['Cheesecake', '$52.000'],
  ['Alfajores', '$15.000'],
  ['Tres leches', '$40.000'],
  ['Milhoja', '$12.000'],
  ['Pie de limón', '$38.000'],
  ['Muffin', '$7.000'],
  ['Rollo canela', '$8.500'],
  ['Merengón', '$22.000'],
];

const LEYENDA = [
  { color: 'var(--color-react)', texto: 'Componente' },
  { color: 'var(--color-morado)', texto: 'Props' },
  { color: 'var(--color-accent)', texto: 'State' },
  { color: 'var(--color-code)', texto: 'JSX / JS' },
];

/* ── 1 · componentes y JSX ──────────────────────────────────────────────── */

const COMPONENTES: Escena[] = [
  {
    titulo: '¿12 veces el mismo bloque?',
    texto:
      'Dulce Horno vende 12 productos. Con HTML puro, cada tarjeta es un bloque copiado y pegado. Si mañana la tarjeta lleva un botón nuevo o cambia su diseño, hay que editar los 12 bloques… y es muy fácil olvidar uno.',
    pausa: 4000,
    html: `
  <div class="ttl a up" data-t="0"><small class="rc">// escena 1 · el problema</small>¿12 veces el mismo bloque?</div>
  <div class="code a left" data-t="300" style="left:60px;top:175px;width:520px;font-size:17px"><div class="code-h">index.html</div><span class="ln"><span class="t">&lt;article</span> <span class="p">class</span>=<span class="s">"tarjeta"</span><span class="t">&gt;</span></span><span class="ln">  <span class="t">&lt;h3&gt;</span>Torta de chocolate<span class="t">&lt;/h3&gt;</span></span><span class="ln">  <span class="t">&lt;p&gt;</span>$45.000<span class="t">&lt;/p&gt;</span></span><span class="ln"><span class="t">&lt;/article&gt;</span></span><span class="ln"><span class="t">&lt;article</span> <span class="p">class</span>=<span class="s">"tarjeta"</span><span class="t">&gt;</span></span><span class="ln">  <span class="t">&lt;h3&gt;</span>Galletas de avena<span class="t">&lt;/h3&gt;</span></span><span class="ln">  <span class="t">&lt;p&gt;</span>$18.000<span class="t">&lt;/p&gt;</span></span><span class="ln"><span class="t">&lt;/article&gt;</span></span><span class="ln"><span class="t">&lt;article</span> <span class="p">class</span>=<span class="s">"tarjeta"</span><span class="t">&gt;</span></span><span class="ln">  <span class="t">&lt;h3&gt;</span>Cupcakes<span class="t">&lt;/h3&gt;</span></span><span class="ln">  <span class="t">&lt;p&gt;</span>$30.000<span class="t">&lt;/p&gt;</span></span><span class="ln"><span class="t">&lt;/article&gt;</span></span><span class="ln c">&lt;!-- …y 9 bloques más --&gt;</span></div>
  ${DULCES.map(
    ([n, p], i) =>
      `<div class="mini a pop fl" data-t="${700 + i * 110}" data-at="${3200 + i * 140}:go" style="left:${640 + (i % 4) * 150}px;top:${175 + Math.floor(i / 4) * 106}px">${n}<span>${p}</span></div>`,
  ).join('')}
  <div class="a up abs" data-t="2800" style="left:640px;top:500px;width:580px;font-size:22px;line-height:1.4">Cambiar el diseño = <b class="yc">editar 12 bloques</b>.</div>
  <div class="a up abs" data-t="5200" style="left:60px;top:600px;width:1160px;font-size:28px;font-weight:800">Mejor: <span class="rc">un molde que se escribe una sola vez.</span></div>`,
  },
  {
    titulo: 'Un componente es un molde',
    texto:
      'Un <b>componente</b> es una función de JavaScript que devuelve lo que se ve en pantalla. Se escribe una vez y se usa las veces que quieras: <code>TarjetaProducto</code> es el molde y cada tarjeta es una copia hecha con ese molde. Si arreglas el molde, se arreglan todas.',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="rc">// escena 2 · componente</small>Un componente es un molde</div>
  <div class="code a left" data-t="300" style="left:60px;top:190px;width:560px"><div class="code-h">src/componentes/TarjetaProducto.jsx</div><span class="ln"><span class="k">function</span> <span class="cp">${kw('TarjetaProducto', 1400)}</span>(props) {</span><span class="ln">  <span class="k">return</span> (</span><span class="ln">    <span class="t">&lt;article</span> <span class="p">className</span>=<span class="s">"tarjeta"</span><span class="t">&gt;</span></span><span class="ln">      <span class="t">&lt;h3&gt;</span>{props.nombre}<span class="t">&lt;/h3&gt;</span></span><span class="ln">      <span class="t">&lt;p&gt;</span>{props.precio}<span class="t">&lt;/p&gt;</span></span><span class="ln">    <span class="t">&lt;/article&gt;</span></span><span class="ln">  );</span><span class="ln">}</span></div>
  <div class="arrow a" data-t="1600" style="left:640px;top:235px">→</div>
  <div class="dash a pop" data-t="1800" style="left:690px;top:180px;width:230px;height:140px;display:grid;place-items:center"><div style="text-align:center"><div class="fm rc" style="font-size:20px;font-weight:800">TarjetaProducto</div><div class="mc" style="font-size:16px">el molde</div></div></div>
  ${(
    [
      ['Torta de chocolate', '$45.000', -285, 25],
      ['Galletas de avena', '$18.000', -285, -105],
      ['Cupcakes de vainilla', '$30.000', -285, -235],
    ] as const
  )
    .map(
      ([n, p, sx, sy], i) =>
        `<div class="pcard fly" data-at="${2500 + i * 700}:go" style="left:980px;top:${170 + i * 130}px;width:240px;--sx:${sx}px;--sy:${sy}px;padding:12px 16px"><h4 style="font-size:19px">${n}</h4><span class="pr">${p}</span></div>`,
    )
    .join('')}
  <div class="code a up" data-t="4600" style="left:60px;top:500px;width:860px;font-size:17px"><div class="code-h">src/App.jsx · así se usa</div><span class="ln"><span class="t">&lt;</span><span class="cp">TarjetaProducto</span> <span class="p">nombre</span>=<span class="s">"Torta de chocolate"</span> <span class="p">precio</span>=<span class="s">"$45.000"</span> <span class="t">/&gt;</span></span></div>
  <div class="a up abs" data-t="5400" style="left:60px;top:600px;width:1160px;font-size:26px;font-weight:800">Se escribe <span class="rc">una vez</span>. Se usa <span class="rc">las veces que quieras</span>.</div>`,
  },
  {
    titulo: 'Mayúscula y JSX',
    texto:
      'La Mayúscula no es un capricho: en minúscula, React busca una etiqueta HTML; en Mayúscula, busca tu función. Y JSX no es HTML: antes de llegar al navegador, cada etiqueta se convierte en una llamada de JavaScript que produce un objeto. Ese objeto es lo que React lee para saber qué dibujar.',
    pausa: 5500,
    html: `
  <div class="ttl a up" data-t="0"><small class="yc">// escena 3 · jsx</small>Mayúscula y JSX</div>
  <div class="abs a fm mc" data-t="200" style="left:60px;top:160px;font-size:16px">¿quién es quién?</div>
  ${(
    [
      ['&lt;header&gt;', 'etiqueta HTML', 'bc', 500],
      ['&lt;TarjetaProducto /&gt;', 'tu componente', 'rc', 1100],
      ['&lt;tarjetaProducto /&gt;', 'HTML inexistente · no se ve', 'xc', 1700],
    ] as const
  )
    .map(
      ([c, l, cl, t], i) =>
        `<div class="a left abs" data-t="${t}" style="left:60px;top:${195 + i * 86}px;width:560px;height:68px;display:flex;align-items:center;gap:14px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:0 18px"><span class="fm ${cl}" style="font-size:18px;font-weight:700;width:228px;flex:none">${c}</span><span class="mc" style="font-size:22px">→</span><span class="${cl}" style="font-size:17px;font-weight:700">${l}</span></div>`,
    )
    .join('')}
  <div class="a up abs" data-t="2300" style="left:60px;top:470px;width:560px;font-size:19px;line-height:1.45"><b>Minúscula</b> = etiqueta de HTML.<br><b class="rc">Mayúscula</b> = una función que tú escribiste.</div>
  <div class="abs a fm mc" data-t="2800" style="left:680px;top:160px;font-size:16px">lo que pasa por debajo</div>
  <div class="code a right" data-t="3000" style="left:680px;top:195px;width:540px"><span class="ln"><span class="t">&lt;</span><span class="cp">TarjetaProducto</span> <span class="p">nombre</span>=<span class="s">"Torta"</span> <span class="t">/&gt;</span></span></div>
  <div class="a abs mc" data-t="3600" style="left:700px;top:262px;font-size:16px">↓ el compilador lo convierte en</div>
  <div class="code a right" data-t="3900" style="left:680px;top:295px;width:540px;font-size:17px"><span class="ln"><span class="f">jsx</span>(<span class="cp">TarjetaProducto</span>, { <span class="p">nombre</span>: <span class="s">"Torta"</span> })</span></div>
  <div class="a abs mc" data-t="4500" style="left:700px;top:362px;font-size:16px">↓ que devuelve un objeto</div>
  <div class="code a right" data-t="4800" style="left:680px;top:395px;width:540px;font-size:17px"><span class="ln">{ <span class="p">type</span>: <span class="cp">TarjetaProducto</span>,</span><span class="ln">  <span class="p">props</span>: { <span class="p">nombre</span>: <span class="s">"Torta"</span> } }</span></div>
  <div class="a up abs" data-t="5600" style="left:680px;top:505px;width:540px;font-size:19px;line-height:1.45">JSX <b class="yc">es JavaScript</b>. Por eso usa <span class="fm yc">className</span> y llaves <span class="fm yc">{ }</span>.</div>`,
  },
  {
    titulo: 'Una página es un árbol de componentes',
    texto:
      'Toda la página sale de un componente principal, <code>App</code>, que junta a los demás: el encabezado, las tarjetas y el pie. Cada caja es un componente en su propio archivo. Al mismo componente <code>TarjetaProducto</code> lo usamos tres veces.',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="rc">// escena 4 · árbol</small>Un árbol de componentes</div>
  <svg class="a abs" data-t="900" style="left:60px;top:180px" width="520" height="160" viewBox="0 0 520 160" aria-hidden="true"><g stroke="var(--line)" stroke-width="3" fill="none"><path d="M260 56 V100 H72 V140"/><path d="M260 100 H280 V140"/><path d="M260 100 H462 V140"/></g></svg>
  <div class="node a pop" data-t="400" style="left:250px;top:180px;width:140px;height:56px">App</div>
  <div class="node a up" data-t="1200" style="left:50px;top:320px;width:165px;height:56px">Encabezado</div>
  <div class="node a up" data-t="1800" style="left:230px;top:320px;width:220px;height:56px">TarjetaProducto <span class="pc" style="font-size:15px;margin-left:6px">×3</span></div>
  <div class="node a up" data-t="2400" style="left:465px;top:320px;width:115px;height:56px">Pie</div>
  <div class="code a up" data-t="3000" style="left:60px;top:420px;width:520px;font-size:16px;line-height:1.55"><div class="code-h">src/App.jsx</div><span class="ln"><span class="k">function</span> <span class="cp">App</span>() {</span><span class="ln">  <span class="k">return</span> (</span><span class="ln">    <span class="t">&lt;main&gt;</span></span><span class="ln">      <span class="t">&lt;</span><span class="cp">Encabezado</span> <span class="t">/&gt;</span></span><span class="ln">      <span class="t">&lt;</span><span class="cp">TarjetaProducto</span> <span class="c">… /&gt; ×3</span></span><span class="ln">      <span class="t">&lt;</span><span class="cp">Pie</span> <span class="t">/&gt;</span></span><span class="ln">    <span class="t">&lt;/main&gt;</span></span><span class="ln">  );</span><span class="ln">}</span></div>
  <div class="browser a right" data-t="400" style="left:640px;top:175px;width:580px;height:480px"><div class="bb"><i></i><i></i><i></i><span>localhost:5173</span></div></div>
  <div class="dash a pop" data-t="1200" style="left:665px;top:235px;width:530px;height:70px;display:flex;align-items:center;padding:0 18px"><span class="lbl">&lt;Encabezado /&gt;</span><b style="color:var(--web-fg);font-size:24px">Dulce Horno</b></div>
  ${DULCES.slice(0, 3)
    .map(
      ([n, p], i) =>
        `<div class="dash a pop" data-t="${1800 + i * 200}" style="left:${665 + i * 180}px;top:330px;width:170px;height:190px"><span class="lbl" style="font-size:11px;right:6px">&lt;TarjetaProducto /&gt;</span><div class="pcard" style="left:8px;top:14px;width:150px;padding:10px 12px;gap:4px;background:var(--web-bg-2)"><h4 style="font-size:17px">${n}</h4><span class="pr" style="font-size:16px">${p}</span><span class="bt" style="font-size:12px;padding:5px 8px">Agregar</span></div></div>`,
    )
    .join('')}
  <div class="dash a pop" data-t="2400" style="left:665px;top:545px;width:530px;height:80px;display:flex;align-items:center;padding:0 18px"><span class="lbl">&lt;Pie /&gt;</span><span style="color:var(--web-muted);font-size:17px">WhatsApp · Instagram · Medellín</span></div>`,
  },
];

/* ── 2 · props ──────────────────────────────────────────────────────────── */

const PROPS: Escena[] = [
  {
    titulo: 'Props: los datos viajan a la tarjeta',
    texto:
      'Los atributos que escribes en la etiqueta se juntan en un objeto llamado <b>props</b> y llegan como argumento a la función. Dentro del molde, <code>{props.nombre}</code> significa "aquí va el nombre que me entreguen". El molde es el mismo; lo que cambia son los datos.',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="pc">// escena 1 · props</small>Props: los datos viajan a la tarjeta</div>
  <div class="code a left" data-t="300" style="left:60px;top:190px;width:560px;font-size:19px"><div class="code-h">src/App.jsx</div><span class="ln"><span class="t">&lt;</span><span class="cp">TarjetaProducto</span></span><span class="ln">  ${kw(`<span class="p">nombre</span>=<span class="s">"Torta de chocolate"</span>`, 1200)}</span><span class="ln">  ${kw(`<span class="p">precio</span>=<span class="s">"$45.000"</span>`, 1600)}</span><span class="ln"><span class="t">/&gt;</span></span></div>
  <div class="a abs mc" data-t="2000" style="left:300px;top:345px;font-size:30px">↓</div>
  <div class="code a up" data-t="2200" style="left:60px;top:395px;width:560px;font-size:18px;border-color:color-mix(in srgb,var(--props) 60%,transparent)"><div class="code-h">lo que recibe la función</div><span class="ln"><span class="p">props</span> = {</span><span class="ln">  <span class="p">nombre</span>: <span class="s">"Torta de chocolate"</span>,</span><span class="ln">  <span class="p">precio</span>: <span class="s">"$45.000"</span></span><span class="ln">}</span></div>
  <div class="pcard a right" data-t="600" style="left:760px;top:200px;width:440px;height:250px;padding:24px 28px;gap:14px">
    <h4><span class="slot" data-seq="${seq([[0, '{props.nombre}'], [4300, 'Torta de chocolate']])}" style="font-size:18px"></span></h4>
    <span class="pr"><span class="slot" data-seq="${seq([[0, '{props.precio}'], [5000, '$45.000']])}" style="font-size:18px"></span></span>
    <span class="bt">Agregar al pedido</span>
  </div>
  <div class="pkt fly" data-at="3300:go,4300:gone" style="left:790px;top:220px;--sx:-560px;--sy:230px">nombre</div>
  <div class="pkt fly" data-at="4000:go,5000:gone" style="left:790px;top:290px;--sx:-560px;--sy:190px">precio</div>
  <div class="a abs fm mc" data-t="600" style="left:760px;top:465px;font-size:15px">src/componentes/TarjetaProducto.jsx · en pantalla</div>
  <div class="a up abs" data-t="5600" style="left:60px;top:600px;width:1160px;font-size:24px;line-height:1.4"><span class="fm pc" style="font-weight:800">function TarjetaProducto(props)</span> · props es el <b>argumento</b> de la función.</div>`,
  },
  {
    titulo: 'El nombre tiene que coincidir',
    texto:
      'Si en <code>App.jsx</code> escribes <code>valor</code> pero el molde lee <code>props.precio</code>, la tarjeta no encuentra el dato: <code>props.precio</code> vale <code>undefined</code> y React no dibuja nada. Lo peligroso es que <b>no aparece ningún error</b>. La palabra tiene que ser exactamente la misma en los dos archivos.',
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="pc">// escena 2 · props</small>El nombre tiene que coincidir</div>
  <div class="code a left" data-t="300" style="left:60px;top:190px;width:520px;font-size:18px"><div class="code-h">src/App.jsx</div><span class="ln"><span class="t">&lt;</span><span class="cp">TarjetaProducto</span></span><span class="ln">  <span class="p">nombre</span>=<span class="s">"Torta de chocolate"</span></span><span class="ln">  ${kw(`<span class="p">valor</span>`, 1600, 'hlx')}=<span class="s">"$45.000"</span></span><span class="ln"><span class="t">/&gt;</span></span></div>
  <div class="code a left" data-t="900" style="left:60px;top:420px;width:520px;font-size:18px"><div class="code-h">src/componentes/TarjetaProducto.jsx</div><span class="ln"><span class="t">&lt;h3&gt;</span>{props.nombre}<span class="t">&lt;/h3&gt;</span></span><span class="ln"><span class="t">&lt;p&gt;</span>{${kw('props.precio', 2200, 'hlx')}}<span class="t">&lt;/p&gt;</span></span></div>
  <div class="a pop abs xc fm" data-t="2800" style="left:330px;top:362px;font-size:20px;font-weight:800">valor ≠ precio</div>
  <div class="pcard a right" data-t="3200" style="left:680px;top:190px;width:400px;height:220px;padding:24px 28px;gap:14px"><h4>Torta de chocolate</h4><span class="hole"></span><span class="bt">Agregar al pedido</span></div>
  <div class="a pop abs xc fm" data-t="3800" style="left:1090px;top:262px;width:140px;font-size:15px;line-height:1.4">← undefined:<br>no se ve nada</div>
  <div class="console a up" data-t="4400" style="left:680px;top:440px;width:540px"><div class="h">Consola del navegador (F12)</div><span class="mc">(sin errores)</span></div>
  <div class="a up abs" data-t="5000" style="left:60px;top:600px;width:1160px;font-size:24px;line-height:1.4">Misma palabra en los dos archivos: <span class="fm pc" style="font-weight:800">precio="…"</span> → <span class="fm pc" style="font-weight:800">props.precio</span></div>`,
  },
  {
    titulo: 'Las props bajan y no se cambian',
    texto:
      'Los datos viajan en una sola dirección: del padre (<code>App</code>) al hijo (<code>TarjetaProducto</code>). El hijo solo los lee. Si intenta cambiarlos, React lo bloquea con un error. Cuando más adelante el hijo necesite avisarle algo al padre, el padre le pasará una función como prop.',
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="pc">// escena 3 · props</small>Las props bajan y no se cambian</div>
  <div class="node a pop" data-t="300" style="left:480px;top:190px;width:280px;height:64px">App <span class="mc" style="font-size:14px;font-weight:400;margin-left:8px">el padre</span></div>
  <svg class="a abs" data-t="800" style="left:600px;top:256px" width="40" height="110" viewBox="0 0 40 110" aria-hidden="true"><path d="M20 0 V95" stroke="var(--props)" stroke-width="4"/><path d="M8 88 L20 106 L32 88" fill="var(--props)"/></svg>
  <div class="pkt a pop" data-t="1000" style="left:650px;top:290px">props</div>
  <div class="node a pop" data-t="1300" style="left:480px;top:370px;width:280px;height:64px">TarjetaProducto <span class="mc" style="font-size:14px;font-weight:400;margin-left:8px">el hijo</span></div>
  <div class="a left abs" data-t="1700" style="left:60px;top:200px;width:380px;display:flex;flex-direction:column;gap:18px;font-size:21px;line-height:1.35">
    <div><b class="pc">1.</b> El padre decide los datos.</div>
    <div><b class="pc">2.</b> El hijo solo los lee.</div>
    <div><b class="pc">3.</b> Nunca suben solos del hijo al padre.</div>
  </div>
  <div class="code a right" data-t="2600" style="left:800px;top:190px;width:420px;font-size:18px"><div class="code-h">dentro de TarjetaProducto</div><span class="ln markx a" data-t="3000">props.precio = <span class="s">'$0'</span>;</span></div>
  <div class="err a pop" data-t="3600" style="left:800px;top:290px;width:420px"><span class="xc" style="font-weight:800">TypeError:</span> Cannot assign to read only property 'precio' of object</div>
  <div class="a up abs" data-t="4400" style="left:60px;top:500px;width:1160px;font-size:22px;line-height:1.45;color:var(--muted)">¿Y si el hijo necesita avisar algo, como "agregaron una torta"? El padre le pasa una <b style="color:var(--fg)">función</b> como prop. Lo vemos en otra sesión.</div>`,
  },
];

/* ── 3 · state y render ─────────────────────────────────────────────────── */

const ESTADO: Escena[] = [
  {
    titulo: 'Variable normal vs. state',
    texto:
      'A la izquierda, una variable normal: el valor sí cambia (la consola lo muestra), pero React no se entera y la pantalla sigue en 0. A la derecha, <b>state</b> con <code>useState</code>: <code>setCantidad</code> cambia el valor y le avisa a React que vuelva a dibujar. Por eso la pantalla se actualiza.',
    pausa: 3500,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 1 · state</small>Variable normal vs. state</div>
  <div class="a abs xc fm" data-t="200" style="left:60px;top:160px;font-size:16px;font-weight:700">✗ variable normal</div>
  <div class="code a left" data-t="300" style="left:60px;top:190px;width:560px;font-size:16px"><span class="ln"><span class="k">let</span> cantidad = <span class="n">0</span>;</span><span class="ln"><span class="p">onClick</span>={() =&gt; cantidad = cantidad + <span class="n">1</span>}</span></div>
  <div class="pcard a up" data-t="600" style="left:60px;top:300px;width:300px;height:170px;padding:16px 20px;gap:10px"><h4 style="font-size:20px">Torta de chocolate</h4><span class="bt">Agregar al pedido</span><span class="qt">En tu pedido: <b>0</b></span></div>
  ${clics(160, 374, [1700, 2400, 3100])}
  <div class="console a up" data-t="600" style="left:380px;top:300px;width:240px;height:170px"><div class="h">console.log(cantidad)</div><div data-seq="${seq([[0, ''], [1800, '1'], [2500, '1<br>2'], [3200, '1<br>2<br>3']])}"></div></div>
  <div class="a up abs xc" data-t="3700" style="left:60px;top:490px;width:560px;font-size:19px;line-height:1.4">La variable llegó a 3… <b>la pantalla sigue en 0.</b></div>
  <div class="a abs sc fm" data-t="4000" style="left:660px;top:160px;font-size:16px;font-weight:700">✓ state con useState</div>
  <div class="code a right" data-t="4100" style="left:660px;top:190px;width:560px;font-size:16px"><span class="ln"><span class="k">const</span> [<span class="st">cantidad</span>, <span class="st">setCantidad</span>] = <span class="f">useState</span>(<span class="n">0</span>);</span><span class="ln"><span class="p">onClick</span>={() =&gt; <span class="st">setCantidad</span>(cantidad + <span class="n">1</span>)}</span></div>
  <div class="pcard a up" data-t="4400" style="left:660px;top:300px;width:300px;height:170px;padding:16px 20px;gap:10px"><h4 style="font-size:20px">Torta de chocolate</h4><span class="bt">Agregar al pedido</span><span class="qt fl" data-at="5600:go">En tu pedido: <b data-seq="${seq([[0, '0'], [5600, '1'], [6300, '2'], [7000, '3']])}"></b></span></div>
  ${clics(760, 374, [5500, 6200, 6900])}
  <div class="a up abs sc" data-t="7500" style="left:660px;top:490px;width:560px;font-size:19px;line-height:1.4"><b>setCantidad</b> avisa a React: la pantalla se actualiza.</div>
  <div class="a up abs" data-t="8000" style="left:60px;top:600px;width:1160px;font-size:24px;font-weight:800">State = un dato que, al cambiar, <span class="sc">vuelve a dibujar la pantalla</span>.</div>`,
  },
  {
    titulo: 'Cómo actualiza React la pantalla',
    texto:
      'Al hacer clic, <code>setCantidad(1)</code> guarda el nuevo valor y React <b>vuelve a ejecutar la función</b> <code>TarjetaProducto</code>. Eso produce una descripción nueva de la tarjeta. React la compara con la anterior, encuentra que solo cambió un texto y <b>actualiza únicamente ese texto</b> en la página real. El resto de la tarjeta no se toca.',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="rc">// escena 2 · render</small>Cómo actualiza React la pantalla</div>
  ${[
    ['1', 'Clic', 60, 180],
    ['2', 'setCantidad(1)', 255, 220],
    ['3', 'Ejecuta la función otra vez', 490, 290],
    ['4', 'Compara', 795, 190],
    ['5', 'Cambia solo eso', 1000, 220],
  ]
    .map(
      ([n, l, x, w], i) =>
        `<div class="paso a up" data-t="300" data-at="${1500 + i * 1200}:on" style="left:${x}px;top:160px;width:${w}px"><b>${n}</b>${l}</div>`,
    )
    .join('')}
  <div class="tree a left" data-t="600" style="left:60px;top:260px;width:350px;height:290px"><div class="h">antes · cantidad = 0</div><span class="ln" data-at="5100:same">&lt;article&gt;</span><span class="ln" data-at="5100:same">  &lt;h3&gt;Torta de chocolate&lt;/h3&gt;</span><span class="ln" data-at="5100:same">  &lt;p&gt;$45.000&lt;/p&gt;</span><span class="ln" data-at="5100:same">  &lt;button&gt;Agregar&lt;/button&gt;</span><span class="ln" data-at="5100:diff">  &lt;p&gt;En tu pedido: 0&lt;/p&gt;</span><span class="ln" data-at="5100:same">&lt;/article&gt;</span></div>
  <div class="tree a right" data-t="3900" style="left:440px;top:260px;width:350px;height:290px;border-color:color-mix(in srgb,var(--react) 55%,transparent)"><div class="h rc">después · cantidad = 1</div><span class="ln" data-at="5100:same">&lt;article&gt;</span><span class="ln" data-at="5100:same">  &lt;h3&gt;Torta de chocolate&lt;/h3&gt;</span><span class="ln" data-at="5100:same">  &lt;p&gt;$45.000&lt;/p&gt;</span><span class="ln" data-at="5100:same">  &lt;button&gt;Agregar&lt;/button&gt;</span><span class="ln" data-at="5100:diff">  &lt;p&gt;En tu pedido: 1&lt;/p&gt;</span><span class="ln" data-at="5100:same">&lt;/article&gt;</span></div>
  <div class="a pop abs yc fm" data-t="5300" style="left:408px;top:470px;font-size:24px;font-weight:800">≠</div>
  <div class="a abs mc fm" data-t="600" style="left:830px;top:258px;font-size:14px">la página real (DOM)</div>
  <div class="pcard a up" data-t="600" style="left:830px;top:285px;width:390px;height:230px;padding:20px 24px;gap:12px"><h4>Torta de chocolate</h4><span class="pr">$45.000</span><span class="bt">Agregar al pedido</span><span class="qt fl" data-at="6300:go">En tu pedido: <b data-seq="${seq([[0, '0'], [6400, '1']])}"></b></span></div>
  ${clics(905, 400, [1500])}
  <div class="a up abs" data-t="7000" style="left:60px;top:600px;width:1160px;font-size:24px;line-height:1.4">React <b>no redibuja toda la página</b>: <span class="rc">solo cambia el texto que cambió.</span></div>`,
  },
  {
    titulo: 'Cada render empieza de cero',
    texto:
      'Cada vez que React vuelve a dibujar, ejecuta la función <b>completa</b>, desde la primera línea. Por eso una variable normal como <code>let total = 0</code> vuelve a nacer en 0 en cada render. El state no vive dentro de la función: lo guarda React en su memoria y se lo entrega a cada render con el valor actualizado.',
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 3 · render</small>Cada render empieza de cero</div>
  ${[0, 1, 2]
    .map(
      (i) => `<div class="frame a up" data-t="${[500, 2400, 4300][i]}" style="left:${60 + i * 400}px;top:180px;width:360px">
    <div class="h">render ${i + 1} · ejecuta TarjetaProducto()</div>
    <div class="row"><span><span style="color:var(--kw)">let</span> total = <span style="color:var(--numero)">0</span></span><em class="xc">siempre 0</em></div>
    <div class="row"><span><span class="sc">cantidad</span> = <span style="color:var(--numero)">${i}</span></span><em class="sc">React lo recuerda</em></div>
  </div>`,
    )
    .join('')}
  ${clics(440, 320, [1700])}${clics(840, 320, [3600])}
  <div class="a abs mc" data-t="1600" style="left:430px;top:262px;font-size:28px">→</div>
  <div class="a abs mc" data-t="3500" style="left:830px;top:262px;font-size:28px">→</div>
  <div class="mem a up" data-t="800" style="left:60px;top:400px;width:1160px;height:90px"><span class="mc" style="font-size:16px">memoria de React</span><span class="sc" style="font-weight:800">cantidad:</span><b class="sc fl" data-at="1900:go" style="font-size:30px;padding:0 8px;border-radius:6px" data-seq="${seq([[0, '0'], [1900, '1'], [3800, '2']])}"></b><span class="mc" style="font-size:16px;margin-left:auto">vive fuera de la función</span></div>
  <div class="a up abs" data-t="5200" style="left:60px;top:540px;width:1160px;font-size:23px;line-height:1.45">Las variables normales <b class="xc">nacen de nuevo</b> en cada render.<br>El state <b class="sc">sobrevive</b> porque lo guarda React, no la función.</div>`,
  },
  {
    titulo: 'Cada tarjeta tiene su propio state',
    texto:
      'El state pertenece a cada copia del componente, no al molde. Por eso, aunque las tres tarjetas salen de la misma función, cada una lleva su propia cuenta: hacer clic en la torta no cambia los cupcakes. Y si recargas la página, todo vuelve a 0: lo que debe durar para siempre va a la base de datos.',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 4 · state</small>Cada tarjeta, su propia cuenta</div>
  ${(
    [
      ['Torta de chocolate', '$45.000', [1500, 2100]],
      ['Galletas de avena', '$18.000', [4100]],
      ['Cupcakes de vainilla', '$30.000', [2900, 3500, 4700]],
    ] as const
  )
    .map(([n, p, tiempos], i) => {
      const x = 60 + i * 400;
      const valores: [number, string][] = [[0, '0'], ...tiempos.map((ms, k): [number, string] => [ms + 100, String(k + 1)])];
      return `<div class="pcard a up" data-t="${300 + i * 250}" style="left:${x}px;top:180px;width:360px;height:200px;padding:20px 24px;gap:10px"><h4>${n}</h4><span class="pr">${p}</span><span class="bt">Agregar al pedido</span><span class="qt">En tu pedido: <b data-seq="${seq(valores)}"></b></span></div>
    ${clics(x + 90, 293, [...tiempos])}
    <div class="mem a up" data-t="${600 + i * 250}" style="left:${x}px;top:410px;width:360px;height:64px;font-size:18px"><span class="sc">cantidad:</span><b class="sc" data-seq="${seq(valores)}"></b></div>`;
    })
    .join('')}
  <div class="a up abs" data-t="5300" style="left:60px;top:520px;width:1160px;font-size:23px;line-height:1.45">Mismo molde, <b class="sc">tres states independientes</b>.<br><span class="mc">Al recargar la página, todo vuelve a 0.</span></div>`,
  },
  {
    titulo: 'En resumen',
    texto:
      'Un <b>componente</b> es una función que devuelve JSX. Las <b>props</b> son los datos que le entrega el padre y solo se leen. El <b>state</b> es un dato que cambia con <code>setCantidad</code>. Cada cambio de state hace que React vuelva a ejecutar el componente, compare y actualice solo lo que cambió en la pantalla.',
    pausa: 6000,
    html: `
  <div class="ttl a up" data-t="0"><small class="rc">// escena 5</small>En resumen</div>
  ${[
    ['Componente', 'rc', 'Una función con nombre en Mayúscula que devuelve lo que se ve.'],
    ['JSX', 'yc', 'Parece HTML, es JavaScript: className y llaves { }.'],
    ['Props', 'pc', 'Datos que entrega el padre. Solo se leen. Mismo nombre en los dos archivos.'],
    ['State', 'sc', 'Dato que cambia con su función set y vuelve a dibujar la pantalla.'],
    ['Render', 'rc', 'React ejecuta otra vez, compara y cambia solo lo necesario.'],
  ]
    .map(
      ([l, c, d], i) =>
        `<div class="a left abs" data-t="${400 + i * 500}" style="left:60px;top:${170 + i * 78}px;display:flex;gap:18px;align-items:center;font-size:23px"><span class="chip ${c}" style="font-size:17px;min-width:170px;justify-content:center">${l}</span>${d}</div>`,
    )
    .join('')}
  <div class="a pop abs" data-t="3200" style="left:860px;top:580px;width:360px;background:var(--react);color:var(--bg);border-radius:14px;padding:18px 22px">
    <div class="fm" style="font-size:15px">Siguiente sesión</div>
    <div style="font-size:24px;font-weight:800;line-height:1.2">Hooks: useState y useEffect</div>
  </div>`,
  },
];

/** Componentes y JSX: el problema, el molde, la Mayúscula y el árbol. */
export function ExplicaComponentes() {
  return (
    <ReproductorEscenas
      prompt="sesion16 --explica componentes"
      titulo="Componentes y JSX: el molde de la interfaz"
      leyenda={LEYENDA}
      escenas={COMPONENTES}
      claseEscenas={styles.escenas}
      acento="var(--color-react)"
    />
  );
}

/** Props: cómo viajan los datos del padre al hijo. */
export function ExplicaProps() {
  return (
    <ReproductorEscenas
      prompt="sesion16 --explica props"
      titulo="Props: los datos que recibe un componente"
      leyenda={LEYENDA}
      escenas={PROPS}
      claseEscenas={styles.escenas}
      acento="var(--color-morado)"
    />
  );
}

/** State y render: cómo React actualiza la pantalla, más el resumen. */
export function ExplicaEstado() {
  return (
    <ReproductorEscenas
      prompt="sesion16 --explica state"
      titulo="State: cómo se actualiza la pantalla"
      leyenda={LEYENDA}
      escenas={ESTADO}
      claseEscenas={styles.escenas}
      acento="var(--color-accent)"
    />
  );
}
