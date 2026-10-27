import { ReproductorEscenas, type Escena } from '../../components/visuals/ReproductorEscenas';
import piezasReact from '../react-componentes-props-state/EscenasReact.module.css';
import styles from './EscenasHooks.module.css';

/*
 * useEffect en tres videos cortos, cada uno junto a su lección:
 *
 *   - ExplicaEfecto (4): primero se pinta y después corre el efecto, el array
 *     de dependencias, el bucle infinito y la doble ejecución de StrictMode.
 *   - ExplicaLimpieza (3): el temporizador que nadie apaga, la limpieza que
 *     lo apaga y la respuesta vieja que pisa a la nueva.
 *   - ExplicaEstados (2): los cuatro estados de una pantalla con datos y el
 *     404 que fetch no trata como error.
 *
 * Las piezas (código, tarjeta de la tienda, paquetes, pasos…) son las de
 * "React por dentro" de la sesión 16: mismo aspecto para la misma familia de
 * videos. EscenasHooks.module.css suma solo lo nuevo.
 */

const CLASE = `${piezasReact.escenas} ${styles.escenas}`;

/** Una línea de código. `at` son sus cambios: "1000:act,2000:done". */
const ln = (contenido: string, at = '') =>
  `<span class="ln"${at ? ` data-at="${at}"` : ''}>${contenido || ' '}</span>`;
const kw = (txt: string, ms: number, clase = 'hl') => `<span class="kw" data-at="${ms}:${clase}">${txt}</span>`;
const PUNTERO = `<svg class="ptr" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.4-6.8L4 20z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
/** Cursor quieto junto al botón y una onda por cada clic. */
const clics = (x: number, y: number, tiempos: number[]) =>
  `<div class="a abs" data-t="${Math.max(0, tiempos[0] - 500)}" style="left:${x + 4}px;top:${y - 12}px">${PUNTERO}</div>` +
  tiempos.map((ms) => `<div class="rip" data-at="${ms}:go" style="left:${x}px;top:${y - 6}px"></div>`).join('');
const seq = (pares: [number, string][]) => pares.map(([ms, t]) => `${ms}:${t}`).join('|');
/** Fila de producto dentro de una pantalla clara. */
const fila = (nombre: string, precio: string, t: number, top: number, extra = '') =>
  `<div class="a up abs" data-t="${t}"${extra} style="left:24px;top:${top}px;width:calc(100% - 48px);display:flex;justify-content:space-between;font-size:19px;color:var(--web-fg);border-bottom:1px solid var(--web-bg-2);padding-bottom:6px"><span>${nombre}</span><b style="color:var(--web-precio)">${precio}</b></div>`;

const LEYENDA = [
  { color: 'var(--color-react)', texto: 'Render' },
  { color: 'var(--color-morado)', texto: 'Efecto' },
  { color: 'var(--color-accent)', texto: 'State' },
  { color: 'var(--color-accent-2)', texto: 'API' },
];

/* ── 1 · el efecto ──────────────────────────────────────────────────────── */

const EFECTO: Escena[] = [
  {
    titulo: 'Primero se pinta, después corre el efecto',
    texto:
      'React ejecuta la función y pinta lo que devuelve: como <code>cargando</code> arranca en <code>true</code>, lo primero que ve el usuario es «Cargando…». <b>Después</b> de pintar corre el efecto, que le pide los datos a la API. Cuando llegan, <code>setProductos</code> y <code>setCargando</code> cambian el state y React dibuja otra vez, ahora con la lista.',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="pc">// escena 1 · el orden</small>Primero se pinta, después el efecto</div>
  <div class="code a left" data-t="300" style="left:60px;top:165px;width:560px;font-size:16px"><div class="code-h">src/componentes/ListaProductos.jsx</div>${[
    ln(`<span class="k">function</span> <span class="cp">ListaProductos</span>() {`),
    ln(`  <span class="k">const</span> [<span class="st">productos</span>, <span class="st">setProductos</span>] = <span class="f">useState</span>([]);`, '900:act,2000:done'),
    ln(`  <span class="k">const</span> [<span class="st">cargando</span>, <span class="st">setCargando</span>] = <span class="f">useState</span>(<span class="n">true</span>);`, '900:act,2000:done'),
    ln(''),
    ln(`  <span class="f">useEffect</span>(() =&gt; {`, '3600:act,5600:done'),
    ln(`    <span class="f">traerProductos</span>();  <span class="c">// fetch + set…</span>`, '3600:act,5600:done'),
    ln(`  }, []);`, '3600:act,5600:done'),
    ln(''),
    ln(`  <span class="k">if</span> (cargando) <span class="k">return</span> <span class="t">&lt;p&gt;</span>Cargando…<span class="t">&lt;/p&gt;</span>;`, '2300:act,3400:done'),
    ln(`  <span class="k">return</span> <span class="t">&lt;ul&gt;</span>{…}<span class="t">&lt;/ul&gt;</span>;`, '6800:act'),
    ln('}'),
  ].join('')}</div>
  <div class="a pop abs pc fm" data-t="1700" style="left:370px;top:273px;font-size:14px;font-weight:700">⏸ para después de pintar</div>
  <div class="mem a up" data-t="600" style="left:60px;top:495px;width:560px;height:64px;font-size:17px"><span class="sc">cargando:</span><b class="sc fl" data-at="6200:go" data-seq="${seq([[0, 'true'], [6200, 'false']])}"></b><span class="sc" style="margin-left:14px">productos:</span><b class="sc fl" data-at="6200:go" data-seq="${seq([[0, '[ ]'], [6200, '[ 3 ]']])}"></b></div>
  <div class="browser a right" data-t="300" style="left:680px;top:165px;width:540px;height:300px"><div class="bb"><i></i><i></i><i></i><span>localhost:5173</span></div>
    <div class="a up abs" data-t="2800" data-at="7000:fuera" style="left:24px;top:60px;font-size:22px;color:var(--web-muted)">Cargando…</div>
    ${fila('Torta de chocolate', '$45.000', 7100, 60)}${fila('Galletas de avena', '$18.000', 7250, 104)}${fila('Cupcakes', '$30.000', 7400, 148)}
  </div>
  <div class="node a pop" data-t="1200" style="left:940px;top:490px;width:280px;height:64px;border-color:var(--blue);color:var(--blue)">API · /api/productos</div>
  <div class="pkt fly" data-at="4000:go,5000:gone" style="left:950px;top:420px;--sx:-150px;--sy:-120px;border-color:var(--blue);color:var(--blue)">GET /api/productos</div>
  <div class="pkt fly" data-at="5200:go,6200:gone" style="left:760px;top:300px;--sx:200px;--sy:190px;border-color:var(--blue);color:var(--blue)">[ 3 productos ]</div>
  ${[
    ['1', 'Render: «Cargando…»', 2300],
    ['2', 'Efecto: pide los datos', 3600],
    ['3', 'set… guarda el state', 6000],
    ['4', 'Render otra vez', 6800],
  ]
    .map(
      ([n, l, t], i) =>
        `<div class="paso a up" data-t="300" data-at="${t}:on" style="left:${60 + i * 295}px;top:580px;width:280px"><b>${n}</b>${l}</div>`,
    )
    .join('')}
  <div class="a up abs" data-t="7600" style="left:60px;top:664px;width:1160px;font-size:21px">useEffect corre <b class="pc">después</b> de pintar: por eso el usuario siempre ve primero el estado inicial.</div>`,
  },
  {
    titulo: 'El array de dependencias decide cuándo',
    texto:
      'Después de cada render, React mira el array del efecto y lo compara con el del render anterior. <code>[]</code> no tiene nada que pueda cambiar: corre una sola vez, al montar. <code>[busqueda]</code> corre cada vez que cambia <code>busqueda</code>, y no cuando cambia otra cosa, como un «me gusta». Sin array corre después de <b>todos</b> los renders, y eso casi siempre es un error.',
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="pc">// escena 2 · dependencias</small>El array decide cuándo</div>
  <div class="a abs fm mc" data-t="300" style="left:60px;top:176px;font-size:16px">en cada render, busqueda vale →</div>
  ${[
    ['montaje', '""'],
    ['escribe «t»', '"t"'],
    ['escribe «to»', '"to"'],
    ['clic en ♥', '"to"'],
  ]
    .map(
      ([evento, valor], i) =>
        `<div class="a up abs" data-t="${1000 + i * 1300}" style="left:${500 + i * 180}px;top:160px;width:160px;text-align:center"><div style="font-size:16px;font-weight:700">${evento}</div><div class="fm yc" style="font-size:18px">${valor}</div></div>`,
    )
    .join('')}
  ${(
    [
      ['useEffect(fn, [])', 'una sola vez, al montar', 'var(--props)', [true, false, false, false]],
      ['useEffect(fn, [busqueda])', 'cuando cambia busqueda', 'var(--props)', [true, true, true, false]],
      ['useEffect(fn)', 'en cada render · casi siempre un error', 'var(--red)', [true, true, true, true]],
    ] as const
  )
    .map(([codigo, desc, color, corre], fila) => {
      const y = 290 + fila * 110;
      return `<div class="a left abs" data-t="${400 + fila * 200}" style="left:60px;top:${y - 38}px;width:400px;height:76px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:10px 16px"><div class="fm" style="font-size:17px;color:${color};font-weight:700">${codigo}</div><div class="mc" style="font-size:15px;margin-top:4px">${desc}</div></div>
      <div class="carril a" data-t="${400 + fila * 200}" style="left:480px;top:${y}px;width:720px"></div>
      ${corre
        .map(
          (si, i) =>
            `<div class="marca a pop" data-t="${400 + fila * 200}" data-at="${1100 + i * 1300}:${si ? 'corre' : 'quieto'}" style="left:${580 + i * 180}px;top:${y}px;--c:${color}">${si ? '▶' : '·'}</div>`,
        )
        .join('')}`;
    })
    .join('')}
  <div class="a up abs" data-t="6400" style="left:60px;top:600px;width:1160px;font-size:21px;line-height:1.45">Después de cada render React compara el array con el anterior. <b class="pc">Si algo cambió, corre el efecto</b>; si no, lo salta.</div>`,
  },
  {
    titulo: 'El bucle infinito',
    texto:
      'Un efecto <b>sin array</b> corre después de cada render. Si adentro cambia el state con <code>setProductos</code>, ese cambio provoca otro render, que vuelve a correr el efecto, que vuelve a cambiar el state… La página se llena de peticiones a la API y termina colgada. Con <code>[]</code> el efecto corre una vez y el ciclo se corta.',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="xc">// escena 3 · el error clásico</small>El bucle infinito</div>
  <div class="code a left" data-t="300" style="left:60px;top:175px;width:600px;font-size:18px">${[
    ln(`<span class="f">useEffect</span>(() =&gt; {`),
    ln(`  <span class="f">fetch</span>(<span class="s">'/api/productos'</span>)`),
    ln(`    .<span class="f">then</span>((res) =&gt; res.<span class="f">json</span>())`),
    ln(`    .<span class="f">then</span>((datos) =&gt; <span class="st">setProductos</span>(datos));`),
    ln(`${kw('});', 1200, 'hlx')}   <span class="c">// ← sin array</span>`),
  ].join('')}</div>
  <div class="frame a up" data-t="1500" style="left:60px;top:410px;width:600px">
    <div class="row"><span>renders</span><b class="pc" data-seq="${seq([[0, '1'], [2000, '2'], [2600, '3'], [3100, '8'], [3600, '47'], [4100, '312'], [4600, '1.284'], [5100, '9.731']])}"></b></div>
    <div class="row"><span>peticiones a la API</span><b class="bc" data-seq="${seq([[0, '1'], [2000, '2'], [2600, '3'], [3100, '8'], [3600, '47'], [4100, '312'], [4600, '1.284'], [5100, '9.731']])}"></b></div>
  </div>
  <svg class="a abs" data-t="900" style="left:820px;top:200px" width="260" height="260" viewBox="0 0 260 260" aria-hidden="true"><g class="gira" data-at="1600:go,4000:rapido" style="transform-box:fill-box;transform-origin:center"><circle cx="130" cy="130" r="110" fill="none" stroke="var(--props)" stroke-width="3" stroke-dasharray="16 12"/><path d="M236 118 l8 16 l-18 -2 z" fill="var(--props)"/><path d="M30 196 l-12 -12 l18 -4 z" fill="var(--props)"/><path d="M90 26 l18 -6 l-6 16 z" fill="var(--props)"/></g></svg>
  <div class="node a pop" data-t="600" style="left:870px;top:196px;width:160px;height:46px;font-size:16px">render</div>
  <div class="node a pop" data-t="800" style="left:985px;top:372px;width:180px;height:46px;font-size:16px;border-color:var(--props);color:var(--props)">efecto: fetch</div>
  <div class="node a pop" data-t="1000" style="left:735px;top:372px;width:180px;height:46px;font-size:16px;border-color:var(--state);color:var(--state)">setProductos</div>
  <div class="colgado a pop" data-t="5600" style="left:740px;top:470px;width:440px"><b>Esta página no responde</b>Puedes esperar a que vuelva a responder o salir de la página.<br><span>Esperar</span><span>Salir de la página</span></div>
  <div class="a up abs" data-t="6600" style="left:60px;top:620px;width:1160px;display:flex;gap:16px;align-items:center;font-size:22px"><span class="chip sc">}, []);</span>Con el array, el efecto corre una vez y el ciclo se corta.</div>`,
  },
  {
    titulo: 'En desarrollo, el efecto corre dos veces',
    texto:
      'La plantilla de Vite envuelve la app en <code>&lt;StrictMode&gt;</code>. En desarrollo, StrictMode monta cada componente, lo desmonta (corriendo la limpieza) y lo monta otra vez, a propósito: así te enteras si a tu efecto le falta limpieza. Por eso ves el <code>console.log</code> dos veces. Con <code>npm run build</code>, en producción, corre una sola vez. No quites StrictMode: es una alarma, no un error.',
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="pc">// escena 4 · StrictMode</small>¿Por qué corre dos veces?</div>
  <div class="code a left" data-t="300" style="left:60px;top:175px;width:580px;font-size:17px"><div class="code-h">src/main.jsx</div>${[
    ln(`<span class="f">createRoot</span>(document.<span class="f">getElementById</span>(<span class="s">'root'</span>)).<span class="f">render</span>(`),
    ln(`  <span class="t">&lt;</span>${kw('<span class="cp">StrictMode</span>', 1000)}<span class="t">&gt;</span>`),
    ln(`    <span class="t">&lt;</span><span class="cp">App</span> <span class="t">/&gt;</span>`),
    ln(`  <span class="t">&lt;/</span><span class="cp">StrictMode</span><span class="t">&gt;</span>`),
    ln(');'),
  ].join('')}</div>
  <div class="a left abs" data-t="1600" style="left:60px;top:390px;width:580px;display:flex;flex-direction:column;gap:14px;font-size:20px">
    <div class="a" data-t="1800"><b class="pc">1.</b> Monta y corre el efecto.</div>
    <div class="a" data-t="2400"><b class="pc">2.</b> Lo desmonta: corre la limpieza.</div>
    <div class="a" data-t="3000"><b class="pc">3.</b> Lo monta otra vez: corre el efecto.</div>
  </div>
  <div class="console a right" data-t="600" style="left:700px;top:175px;width:520px;height:170px"><div class="h">npm run dev · desarrollo</div><div data-seq="${seq([[0, ''], [1800, '▶ efecto corrió'], [2400, '▶ efecto corrió<br><span class=&quot;mc&quot;>↺ limpieza</span>'], [3000, '▶ efecto corrió<br><span class=&quot;mc&quot;>↺ limpieza</span><br>▶ efecto corrió']])}"></div></div>
  <div class="console a right" data-t="3800" style="left:700px;top:375px;width:520px;height:110px"><div class="h">npm run build · producción</div><div data-seq="${seq([[0, ''], [4300, '▶ efecto corrió']])}"></div></div>
  <div class="a up abs" data-t="5000" style="left:60px;top:580px;width:1160px;font-size:22px;line-height:1.45">Es a propósito: si tu efecto funciona bien dos veces seguidas, está bien hecho.<br><b class="pc">No quites StrictMode</b> para "arreglarlo".</div>`,
  },
];

/* ── 2 · la limpieza ────────────────────────────────────────────────────── */

/** La tarjeta de oferta con un reloj que se muestra y se oculta. */
const tarjetaReloj = (x: number, relojes: string, botones: string) =>
  `<div class="pcard a right" data-t="300" style="left:${x}px;top:175px;width:320px;height:200px"><h4>Oferta del día</h4>${relojes}<span class="bt abs" style="left:18px;top:130px" data-seq="${botones}"></span></div>`;
const reloj = (t: number, fuera: number | null, cuenta: [number, string][]) =>
  `<div class="a abs" data-t="${t}"${fuera ? ` data-at="${fuera}:fuera"` : ''} style="left:18px;top:62px;font-size:22px;color:var(--web-fg)">Termina en <b data-seq="${seq(cuenta)}"></b> s</div>`;

const LIMPIEZA: Escena[] = [
  {
    titulo: 'Un temporizador que nadie apaga',
    texto:
      'El efecto enciende un <code>setInterval</code>, pero nunca lo apaga. Al ocultar el reloj, el componente desaparece… y el temporizador sigue corriendo, actualizando un componente que ya no existe. Al mostrarlo otra vez, se enciende uno nuevo. Cada montaje deja uno más trabajando para nada. En desarrollo lo notas antes: con StrictMode, el contador sube de 2 en 2.',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="pc">// escena 1 · sin limpieza</small>Un temporizador que nadie apaga</div>
  <div class="code a left" data-t="300" style="left:60px;top:175px;width:580px;font-size:15px"><div class="code-h">src/componentes/Reloj.jsx</div>${[
    ln(`<span class="k">function</span> <span class="cp">Reloj</span>() {`),
    ln(`  <span class="k">const</span> [<span class="st">segundos</span>, <span class="st">setSegundos</span>] = <span class="f">useState</span>(<span class="n">0</span>);`),
    ln(''),
    ln(`  <span class="f">useEffect</span>(() =&gt; {`),
    ln(`    <span class="f">setInterval</span>(() =&gt; <span class="st">setSegundos</span>((s) =&gt; s + <span class="n">1</span>), <span class="n">1000</span>);`, '600:act,1600:done'),
    ln(`  }, []);   ${kw('<span class="c">// ← sin limpieza</span>', 3800, 'hlx')}`),
    ln(''),
    ln(`  <span class="k">return</span> <span class="t">&lt;p&gt;</span>Termina en {segundos} s<span class="t">&lt;/p&gt;</span>;`),
    ln('}'),
  ].join('')}</div>
  ${tarjetaReloj(
    700,
    reloj(400, 3500, [[0, '0'], [1400, '1'], [2400, '2'], [3400, '3']]) + reloj(5500, null, [[0, '0'], [6500, '1'], [7500, '2']]),
    seq([[0, 'Ocultar reloj'], [3400, 'Mostrar reloj'], [5400, 'Ocultar reloj']]),
  )}
  ${clics(783, 327, [3300, 5300])}
  <div class="frame a up" data-t="600" style="left:700px;top:405px;width:520px;height:190px">
    <div class="h">temporizadores encendidos: <b class="pc" data-seq="${seq([[0, '0'], [700, '1'], [5500, '2']])}"></b></div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
      <div class="a up" data-t="700"><span class="vivo"><i></i>#1 setInterval</span> <span class="a xc" data-t="3700" style="font-family:var(--font-body);font-size:15px">← su reloj ya no existe</span></div>
      <div class="a up" data-t="5500"><span class="vivo"><i></i>#2 setInterval</span></div>
    </div>
  </div>
  <div class="a up abs" data-t="7000" style="left:60px;top:630px;width:1160px;font-size:22px">Cada vez que el reloj aparece, <b class="xc">queda un temporizador más encendido</b>.</div>`,
  },
  {
    titulo: 'La limpieza lo apaga',
    texto:
      'El efecto puede <b>devolver una función</b>: la limpieza. React la llama cuando el componente desaparece, y ahí <code>clearInterval(id)</code> apaga el temporizador. Para eso hay que guardar el <code>id</code> que devuelve <code>setInterval</code>. Ahora, al mostrar el reloj otra vez, solo queda uno encendido: el nuevo.',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 2 · con limpieza</small>La limpieza lo apaga</div>
  <div class="code a left" data-t="300" style="left:60px;top:175px;width:610px;font-size:14px"><div class="code-h">src/componentes/Reloj.jsx</div>${[
    ln(`<span class="f">useEffect</span>(() =&gt; {`),
    ln(`  <span class="k">const</span> id = <span class="f">setInterval</span>(() =&gt; <span class="st">setSegundos</span>((s) =&gt; s + <span class="n">1</span>), <span class="n">1000</span>);`, '600:act,1600:done'),
    ln(''),
    ln(`  <span class="k">return</span> () =&gt; <span class="f">clearInterval</span>(id);   <span class="c">// limpieza</span>`, '3500:act,4500:ok'),
    ln('}, []);'),
  ].join('')}</div>
  <div class="a up abs" data-t="1200" style="left:60px;top:345px;width:610px;font-size:19px;line-height:1.5"><b class="sc">return () =&gt; …</b> es la función de limpieza.<br>React la guarda y la llama cuando el reloj desaparece.</div>
  ${tarjetaReloj(
    700,
    reloj(400, 3500, [[0, '0'], [1400, '1'], [2400, '2'], [3400, '3']]) + reloj(5500, null, [[0, '0'], [6500, '1'], [7500, '2']]),
    seq([[0, 'Ocultar reloj'], [3400, 'Mostrar reloj'], [5400, 'Ocultar reloj']]),
  )}
  ${clics(783, 327, [3300, 5300])}
  <div class="frame a up" data-t="600" style="left:700px;top:405px;width:520px;height:190px">
    <div class="h">temporizadores encendidos: <b class="sc" data-seq="${seq([[0, '0'], [700, '1'], [3800, '0'], [5500, '1']])}"></b></div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
      <div class="a up" data-t="700"><span class="vivo" data-at="3800:apagado"><i></i>#1 setInterval</span> <span class="a sc" data-t="3900" style="font-family:var(--font-body);font-size:15px">← clearInterval lo apagó</span></div>
      <div class="a up" data-t="5500"><span class="vivo"><i></i>#2 setInterval</span></div>
    </div>
  </div>
  <div class="a up abs" data-t="6600" style="left:60px;top:500px;width:610px;font-size:19px;line-height:1.5">La limpieza corre:<br><span class="chip sc" style="font-size:15px;margin-top:8px">al desmontar</span> <span class="chip pc" style="font-size:15px">antes de volver a correr el efecto</span></div>
  <div class="a up abs" data-t="7200" style="left:60px;top:630px;width:1160px;font-size:22px">Lo que el efecto enciende, <b class="sc">la limpieza lo apaga</b>.</div>`,
  },
  {
    titulo: 'La respuesta vieja que pisa a la nueva',
    texto:
      'Con <code>[busqueda]</code>, cada letra lanza una búsqueda nueva. Si la de «to» tarda más que la de «tor», llega <b>después</b> y deja en pantalla los resultados de «to» aunque el campo diga «tor». La limpieza también corre <b>antes de volver a correr el efecto</b>: ahí se marca <code>ignorar = true</code> para la búsqueda anterior, y cuando su respuesta llega tarde, se descarta.',
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="pc">// escena 3 · antes de volver a correr</small>La respuesta vieja pisa a la nueva</div>
  <div class="a left abs" data-t="200" style="left:60px;top:165px;width:560px;height:52px;background:var(--web-bg);border-radius:10px;display:flex;align-items:center;padding:0 18px;font-size:22px;color:var(--web-fg)">🔍&nbsp;<span data-seq="${seq([[0, ''], [600, 't'], [900, 'to'], [1900, 'tor']])}"></span><span style="color:var(--web-boton)">|</span></div>
  <div class="code a left" data-t="300" style="left:60px;top:240px;width:560px;font-size:15px">${[
    ln(`<span class="f">useEffect</span>(() =&gt; {`),
    ln(`  <span class="k">let</span> ignorar = <span class="n">false</span>;`, '4300:ok'),
    ln(`  <span class="f">buscar</span>(busqueda).<span class="f">then</span>((datos) =&gt; {`),
    ln(`    <span class="k">if</span> (!ignorar) <span class="st">setResultados</span>(datos);`, '4300:ok'),
    ln('  });'),
    ln(`  <span class="k">return</span> () =&gt; { ignorar = <span class="n">true</span>; };`, '2000:act,4300:ok'),
    ln(`}, [<span class="p">busqueda</span>]);`),
  ].join('')}</div>
  <div class="a up abs" data-t="1000" style="left:60px;top:470px;display:flex;flex-direction:column;gap:12px">
    <div><span class="vivo" style="border-color:var(--blue);color:var(--blue)" data-at="4100:apagado"><i></i>① buscar('to') · lenta</span></div>
    <div class="a up" data-t="2000"><span class="vivo" style="border-color:var(--blue);color:var(--blue)"><i></i>② buscar('tor') · rápida</span></div>
  </div>
  <div class="a pop abs pc fm" data-t="2100" style="left:330px;top:478px;font-size:14px;font-weight:700">← limpieza: ignorar = true</div>
  <div class="rotulo a xc" data-t="300" style="left:680px;top:140px">sin limpieza</div>
  <div class="browser a right" data-t="300" style="left:680px;top:165px;width:540px;height:200px"><div class="bb"><i></i><i></i><i></i><span>resultados</span></div>
    ${fila('Torta de chocolate', '$45.000', 2900, 50, ' data-at="4100:fuera"')}${fila('Tortilla de papa', '$12.000', 3000, 94, ' data-at="4100:fuera"')}
    ${fila('Tomate de árbol', '$4.000', 4200, 50)}${fila('Tostadas', '$6.000', 4300, 94)}
    <div class="a pop abs xc fm" data-t="4600" style="left:24px;top:150px;font-size:15px;font-weight:700">✗ el campo dice «tor», la lista es de «to»</div>
  </div>
  <div class="rotulo a sc" data-t="300" style="left:680px;top:385px">con limpieza</div>
  <div class="browser a right" data-t="300" style="left:680px;top:410px;width:540px;height:200px"><div class="bb"><i></i><i></i><i></i><span>resultados</span></div>
    ${fila('Torta de chocolate', '$45.000', 2900, 50)}${fila('Tortilla de papa', '$12.000', 3000, 94)}
    <div class="a pop abs sc fm" data-t="4600" style="left:24px;top:150px;font-size:15px;font-weight:700">✓ la respuesta de «to» llegó tarde y se ignoró</div>
  </div>
  <div class="pkt fly" data-at="3700:go,4200:gone" style="left:900px;top:300px;--sx:-560px;--sy:170px;border-color:var(--blue);color:var(--blue)">respuesta de 'to'</div>
  <div class="pkt fly" data-at="3700:go,4400:apagado" style="left:1020px;top:416px;--sx:-680px;--sy:54px;border-color:var(--blue);color:var(--blue)">respuesta de 'to'</div>
  <div class="a up abs" data-t="5400" style="left:60px;top:650px;width:1160px;font-size:20px">La limpieza también corre <b class="pc">antes de volver a correr el efecto</b>: la búsqueda vieja ya no puede pisar a la nueva.</div>`,
  },
];

/* ── 3 · los estados de la pantalla ─────────────────────────────────────── */

const ESTADOS: Escena[] = [
  {
    titulo: 'Un componente, cuatro pantallas',
    texto:
      'El mismo componente tiene que contemplar cuatro situaciones, y cada <code>if</code> devuelve una pantalla distinta: <b>cargando</b> mientras la petición viaja, <b>error</b> si falló (con un botón para reintentar), <b>vacío</b> si salió bien pero no hay nada, y <b>con datos</b>, el caso feliz. Vacío no es error: «todavía no tienes productos» es una buena noticia, no una falla.',
    pausa: 4500,
    html: `
  <div class="ttl a up" data-t="0"><small class="sc">// escena 1 · los estados</small>Un componente, cuatro pantallas</div>
  <div class="code a left" data-t="300" style="left:60px;top:175px;width:620px;font-size:14px">${[
    ln(`<span class="k">if</span> (<span class="st">cargando</span>) <span class="k">return</span> <span class="t">&lt;</span><span class="cp">Esqueleto</span> <span class="t">/&gt;</span>;`, '600:act,2600:done'),
    ln(`<span class="k">if</span> (<span class="st">error</span>) <span class="k">return</span> <span class="t">&lt;</span><span class="cp">Error</span> <span class="p">mensaje</span>={error} <span class="p">alReintentar</span>={traer} <span class="t">/&gt;</span>;`, '2700:act,4600:done'),
    ln(`<span class="k">if</span> (<span class="st">productos</span>.length === <span class="n">0</span>) <span class="k">return</span> <span class="t">&lt;</span><span class="cp">SinProductos</span> <span class="t">/&gt;</span>;`, '4700:act,6600:done'),
    ln(`<span class="k">return</span> <span class="t">&lt;</span><span class="cp">Lista</span> <span class="p">productos</span>={productos} <span class="t">/&gt;</span>;`, '6700:act'),
  ].join('')}</div>
  <div class="a up abs" data-t="900" style="left:60px;top:330px;width:620px;font-size:19px;line-height:1.5">El orden importa: primero lo que <b>no</b> es el caso feliz.<br>Cada <span class="fm yc">return</span> corta la función ahí.</div>
  <div class="browser a right" data-t="300" style="left:720px;top:165px;width:500px;height:330px"><div class="bb"><i></i><i></i><i></i><span>localhost:5173/productos</span></div>
    <div class="a abs" data-t="600" data-at="2600:fuera" style="left:24px;top:60px;width:450px;display:flex;flex-direction:column;gap:14px"><div class="sk" style="width:60%;height:22px"></div><div class="sk"></div><div class="sk" style="width:85%"></div><div class="sk"></div><div class="sk" style="width:70%"></div></div>
    <div class="a pop abs" data-t="2700" data-at="4600:fuera" style="left:24px;top:70px;width:450px;color:var(--web-fg)"><div style="font-size:40px;color:var(--red)">⚠</div><div style="font-size:21px;font-weight:700">No pudimos traer los productos.</div><div style="font-size:16px;color:var(--web-muted);margin:6px 0 14px">Revisa tu conexión e intenta de nuevo.</div><span class="bt" style="background:var(--web-boton);color:var(--web-bg);border-radius:8px;padding:7px 12px;font-weight:700">Reintentar</span></div>
    <div class="a pop abs" data-t="4700" data-at="6600:fuera" style="left:24px;top:70px;width:450px;color:var(--web-fg)"><div style="font-size:40px">🧁</div><div style="font-size:21px;font-weight:700">Todavía no tienes productos.</div><div style="font-size:16px;color:var(--web-muted);margin:6px 0 14px">Cuando agregues uno, aparece aquí.</div><span style="background:var(--web-boton);color:var(--web-bg);border-radius:8px;padding:7px 12px;font-weight:700">Agregar el primero</span></div>
    ${fila('Torta de chocolate', '$45.000', 6800, 56)}${fila('Galletas de avena', '$18.000', 6950, 100)}${fila('Cupcakes', '$30.000', 7100, 144)}
  </div>
  ${[
    ['1', 'Cargando', 600],
    ['2', 'Error', 2700],
    ['3', 'Vacío', 4700],
    ['4', 'Con datos', 6700],
  ]
    .map(
      ([n, l, t], i) =>
        `<div class="paso a up" data-t="300" data-at="${t}:on" style="left:${60 + i * 295}px;top:540px;width:280px"><b>${n}</b>${l}</div>`,
    )
    .join('')}
  <div class="a up abs" data-t="7500" style="left:60px;top:636px;width:1160px;font-size:22px">El caso feliz es <b class="sc">solo uno de cuatro</b>. Los otros tres son los que se notan.</div>`,
  },
  {
    titulo: 'fetch no avisa de un 404',
    texto:
      '<code>fetch</code> solo falla si no hay red. Si el servidor responde 404 o 500, la promesa sale bien y <code>res.json()</code> trae el mensaje de error. Sin revisar <code>res.ok</code>, ese objeto termina en <code>setProductos</code> y <code>productos.map</code> rompe la pantalla. Con <code>if (!res.ok) throw …</code> el error salta al <code>catch</code> y se muestra la pantalla de error.',
    pausa: 5000,
    html: `
  <div class="ttl a up" data-t="0"><small class="xc">// escena 2 · res.ok</small>fetch no avisa de un 404</div>
  <div class="code a left" data-t="300" style="left:60px;top:170px;width:600px;font-size:16px;border-color:color-mix(in srgb,var(--blue) 55%,transparent)"><div class="code-h">lo que responde la API</div>${ln(`HTTP <span class="xc">404</span> · { mensaje: <span class="s">'Ruta no encontrada'</span> }`)}</div>
  <div class="rotulo a xc" data-t="800" style="left:60px;top:262px">sin revisar res.ok</div>
  <div class="code a left" data-t="800" style="left:60px;top:290px;width:600px;font-size:15px">${[
    ln(`<span class="k">const</span> res = <span class="k">await</span> <span class="f">fetch</span>(<span class="s">'/api/productos'</span>);`),
    ln(`<span class="st">setProductos</span>(<span class="k">await</span> res.<span class="f">json</span>());   <span class="c">// ← el error como lista</span>`, '1500:act'),
  ].join('')}</div>
  <div class="rotulo a sc" data-t="3000" style="left:60px;top:418px">revisando res.ok</div>
  <div class="code a left" data-t="3000" style="left:60px;top:446px;width:600px;font-size:15px">${[
    ln(`<span class="k">const</span> res = <span class="k">await</span> <span class="f">fetch</span>(<span class="s">'/api/productos'</span>);`),
    ln(`<span class="k">if</span> (!res.ok) <span class="k">throw new</span> <span class="f">Error</span>(<span class="s">&#96;Error \${res.status}&#96;</span>);`, '3600:act,4300:ok'),
    ln(`<span class="st">setProductos</span>(<span class="k">await</span> res.<span class="f">json</span>());`, '4300:tenue'),
  ].join('')}</div>
  <div class="browser a right" data-t="800" style="left:700px;top:262px;width:520px;height:140px"><div class="bb"><i></i><i></i><i></i><span>localhost:5173</span></div>
    <div class="err a pop" data-t="2100" style="left:16px;top:46px;width:488px;font-size:15px"><span class="xc" style="font-weight:800">TypeError:</span> productos.map is not a function</div>
  </div>
  <div class="browser a right" data-t="3000" style="left:700px;top:418px;width:520px;height:140px"><div class="bb"><i></i><i></i><i></i><span>localhost:5173</span></div>
    <div class="a pop abs" data-t="4400" style="left:24px;top:50px;color:var(--web-fg)"><div style="font-size:19px;font-weight:700"><span style="color:var(--red)">⚠</span> No pudimos traer los productos (Error 404).</div><span style="display:inline-block;margin-top:10px;background:var(--web-boton);color:var(--web-bg);border-radius:8px;padding:6px 12px;font-weight:700;font-size:14px">Reintentar</span></div>
  </div>
  <div class="a up abs" data-t="5200" style="left:60px;top:620px;width:1160px;font-size:21px;line-height:1.45">fetch solo falla si no hay red. Un 404 o un 500 llegan como respuesta normal: <b class="sc">revisa res.ok</b>.</div>`,
  },
];

/** Lección 3: cuándo corre un efecto y qué lo vuelve a correr. */
export function ExplicaEfecto() {
  return (
    <ReproductorEscenas
      prompt="sesion17 --explica useEffect"
      titulo="useEffect: qué corre y cuándo"
      leyenda={LEYENDA}
      escenas={EFECTO}
      claseEscenas={CLASE}
      acento="var(--color-morado)"
    />
  );
}

/** Lección 4: la función de limpieza. */
export function ExplicaLimpieza() {
  return (
    <ReproductorEscenas
      prompt="sesion17 --explica limpieza"
      titulo="La limpieza: apagar lo que el efecto encendió"
      leyenda={LEYENDA}
      escenas={LIMPIEZA}
      claseEscenas={CLASE}
      acento="var(--color-react)"
    />
  );
}

/** Lección 5: los cuatro estados de una pantalla con datos. */
export function ExplicaEstados() {
  return (
    <ReproductorEscenas
      prompt="sesion17 --explica estados"
      titulo="Cargando, error, vacío y con datos"
      leyenda={LEYENDA}
      escenas={ESTADOS}
      claseEscenas={CLASE}
      acento="var(--color-accent)"
    />
  );
}
