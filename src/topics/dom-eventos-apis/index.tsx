import { Exercises, Lesson, TopicPage } from '../../components/TopicPage';
import {
  FillBlank,
  MatchPairs,
  MultiSelect,
  OrderSteps,
  PredictOutput,
  Quiz,
  TrueFalse,
} from '../../components/exercises';
import {
  Callout,
  Compare,
  Figure,
  RefTable,
  Snippets,
  Step,
  Steps,
  Terminal,
} from '../../components/visuals';
import { CazadorDeSelectores, MiradorDeEventos, TallerDom } from './Demos';
import { REFERENCIA } from './referencia';

const SLUG = 'dom-eventos-apis';

/** Sesión 10 del cronograma — DOM, eventos, fetch y asincronía. */
export default function DomEventosApis() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. El DOM: tu página convertida en objetos">
        <p>
          El HTML es el plano; el <strong>DOM</strong> es la casa construida. Cuando el navegador
          lee tu archivo, arma en memoria un árbol de objetos que representa cada etiqueta — y
          JavaScript puede recorrer ese árbol, leerlo y remodelarlo en vivo.
        </p>
        <p>
          Esa palabra —DOM, <em>Document Object Model</em>— asusta más de lo que debería. Significa
          exactamente esto: tu <strong>documento</strong> convertido en <strong>objetos</strong> que
          puedes tocar con código. Cada etiqueta del HTML se vuelve un objeto con propiedades que se
          leen y se cambian, igual que cambiabas una variable en Scratch.
        </p>
        <Callout mark="↓">
          Mientras programas, lo que vas a querer tener abierto es la{' '}
          <a href="#referencia">referencia del final</a>: los veinticuatro métodos de la sesión, con
          su explicación y un botón para copiar cada uno. Esta lección es para entenderlos; esa
          sección es para trabajar.
        </Callout>

        <Figure
          label="Diagrama: el HTML convertido en árbol del DOM"
          caption="Cada etiqueta es un nodo con padre e hijos. querySelector es la forma de agarrar uno de esos nodos desde JavaScript."
        >
          <svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg">
            {[
              { x: 270, y: 16, t: 'html' },
              { x: 150, y: 82, t: 'head' },
              { x: 390, y: 82, t: 'body' },
              { x: 300, y: 152, t: 'h1' },
              { x: 400, y: 152, t: 'ul' },
              { x: 500, y: 152, t: 'button' },
            ].map(({ x, y, t }) => (
              <g key={t}>
                <rect x={x} y={y} width={t === 'button' ? 76 : 62} height="30" rx="6" fill="var(--color-text)" opacity="0.08" />
                <rect x={x} y={y} width={t === 'button' ? 76 : 62} height="2" rx="1" fill="var(--color-accent)" opacity="0.7" />
                <text
                  x={x + (t === 'button' ? 38 : 31)}
                  y={y + 20}
                  fontSize="12"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                  fill="var(--color-text)"
                >
                  {t}
                </text>
              </g>
            ))}
            {[
              ['M301 46 L181 82', ''],
              ['M301 46 L421 82', ''],
              ['M421 112 L331 152', ''],
              ['M421 112 L431 152', ''],
              ['M421 112 L538 152', ''],
            ].map(([d], i) => (
              <path key={i} d={d} stroke="var(--color-text)" strokeWidth="1" opacity="0.25" fill="none" />
            ))}
            <text x="0" y="200" fontSize="12.5" fill="var(--color-text-2)" fontFamily="ui-monospace, monospace">
              document.querySelector('#lista') → el nodo ul
            </text>
          </svg>
        </Figure>

        <p>
          Antes de escribir una línea, míralo con tus propios ojos. El DOM no es una idea abstracta:
          está ahí, y el navegador te lo enseña.
        </p>

        <Steps>
          <Step title="Abre las herramientas de desarrollo">
            Clic derecho sobre cualquier parte de una página → <strong>Inspeccionar</strong>. O la
            tecla <code>F12</code>. Funciona en Chrome, Edge, Opera y Firefox.
          </Step>
          <Step title="Mira la pestaña Elements (o Elementos)">
            Eso que ves ahí <strong>no es tu archivo</strong>: es el DOM, el árbol vivo. Si pasas el
            mouse por una línea, el navegador resalta ese elemento en la página.
          </Step>
          <Step title="Cámbialo a mano">
            Doble clic sobre un texto en Elements y escribe otra cosa. La página cambia al
            instante. Acabas de hacer con el mouse lo que en un rato vas a hacer con código.
          </Step>
          <Step title="Ahora la pestaña Console">
            Escribe <code>document.title</code> y dale Enter: te devuelve el título de la página.
            La consola es JavaScript hablando con la página que tienes al frente.
          </Step>
          <Step title="Recarga">
            Todo lo que cambiaste se deshace. Los cambios del DOM viven en memoria; el archivo en
            el disco nunca se tocó. Guárdate esa idea, que vuelve al final de la sesión.
          </Step>
        </Steps>

        <Callout>
          <code>createElement</code> es el <em>«crear clon de mí mismo»</em> de Scratch: un molde
          que fabrica elementos mientras el programa corre. Lo usaste en la sesión 3 para los
          obstáculos; hoy lo usas para las tareas de una lista.
        </Callout>
      </Lesson>

      <Lesson title="2. Encontrar el elemento: querySelector">
        <p>
          Para cambiar algo primero hay que agarrarlo. La herramienta es{' '}
          <code>document.querySelector()</code>, y la buena noticia es que{' '}
          <strong>no tienes que aprender un lenguaje nuevo</strong>: recibe exactamente los mismos
          selectores de CSS que ya usaste en la sesión 6 para pintar.
        </p>

        <RefTable
          cabeceras={['Selector', 'Qué agarra', 'En CSS lo usabas para']}
          filas={[
            [<code key="a">'#lista'</code>, 'El elemento con id="lista"', 'Pintar ese elemento único'],
            [<code key="b">'.tarjeta'</code>, 'Los que tengan class="tarjeta"', 'Pintar todas las tarjetas'],
            [<code key="c">'button'</code>, 'Todos los <button>', 'Pintar todos los botones'],
            [<code key="d">'ul li'</code>, 'Los <li> que estén dentro de un <ul>', 'Anidar estilos'],
            [<code key="e">'li.hecha'</code>, 'Los <li> que además tengan esa clase', 'Estado de un elemento'],
            [<code key="f">'input[type=text]'</code>, 'Los input de tipo texto', 'Estilizar por atributo'],
          ]}
        />

        <p>
          Hay dos versiones, y confundirlas es el error número uno de esta sesión:
        </p>

        <Compare
          bien={{
            titulo: 'querySelector — devuelve UNO',
            items: [
              'Devuelve el primero que coincida',
              'Si no encuentra nada, devuelve null',
              'Es lo que quieres para un id',
              <code key="1">const boton = document.querySelector('#agregar')</code>,
            ],
          }}
          mal={{
            titulo: 'querySelectorAll — devuelve TODOS',
            items: [
              'Devuelve una lista (NodeList), aunque solo haya uno',
              'Si no encuentra nada, la lista viene vacía, no null',
              'Hay que recorrerla para usarla',
              <code key="2">document.querySelectorAll('.tarjeta').forEach(...)</code>,
            ],
          }}
        />

        <Terminal
          titulo="Recorrer todos los que encontró"
          lineas={[
            "const tareas = document.querySelectorAll('li');",
            '',
            '// Cuántas hay',
            'console.log(tareas.length);',
            '',
            '// Una por una',
            'tareas.forEach(function (tarea) {',
            "  tarea.classList.add('visible');",
            '});',
          ]}
        />

        <Callout tipo="ojo">
          <code>querySelectorAll</code> devuelve una <strong>lista</strong>, no un elemento. Si le
          escribes <code>.textContent</code> directamente no pasa nada y tampoco sale un error: es
          de los bugs que más tiempo hacen perder. A una lista se le recorre; a un elemento se le
          cambia.
        </Callout>

        <p>Pruébalo aquí antes de escribirlo en tu archivo:</p>
        <CazadorDeSelectores />

        <Callout tipo="ojo">
          Si <code>querySelector</code> devuelve <code>null</code>, casi siempre es porque el script
          corrió antes de que el HTML existiera. Solución: pon la etiqueta{' '}
          <code>&lt;script&gt;</code> al final del <code>body</code>, o usa{' '}
          <code>&lt;script defer&gt;</code>. La otra causa es que el id no coincida exactamente —
          revisa mayúsculas y tildes.
        </Callout>
      </Lesson>

      <Lesson title="3. Leer y cambiar lo que se ve">
        <p>
          Con el elemento en una variable, cambiarlo es asignarle propiedades. Tres son las que vas
          a usar todo el tiempo, y hacen cosas distintas.
        </p>

        <RefTable
          cabeceras={['Propiedad', 'Qué hace', 'Cuándo usarla']}
          filas={[
            [
              <code key="a">textContent</code>,
              'Lee o cambia el texto, sin interpretar etiquetas',
              'Casi siempre. Es la opción segura',
            ],
            [
              <code key="b">innerHTML</code>,
              'Lee o cambia el HTML de adentro, interpretando etiquetas',
              'Solo cuando necesitas meter etiquetas y el contenido es tuyo',
            ],
            [
              <code key="c">value</code>,
              'Lee o cambia lo escrito en un input',
              'Siempre que trabajes con formularios',
            ],
          ]}
        />

        <Compare
          bien={{
            titulo: 'textContent — texto y nada más',
            items: [
              <code key="1">{`caja.textContent = '<b>Hola</b>'`}</code>,
              'En pantalla se lee, literal: <b>Hola</b>',
              'Lo que escriba un usuario nunca se ejecuta',
              'Por eso es la opción por defecto',
            ],
          }}
          mal={{
            titulo: 'innerHTML — interpreta etiquetas',
            items: [
              <code key="2">{`caja.innerHTML = '<b>Hola</b>'`}</code>,
              'En pantalla se ve Hola en negrilla',
              'Si ahí metes texto de un usuario, le estás dejando escribir HTML en tu página',
              'Útil, pero nunca con texto que no controlas',
            ],
          }}
        />

        <Callout tipo="ojo">
          Esa última línea no es paranoia de profesor. Meter texto de un usuario con{' '}
          <code>innerHTML</code> es la forma más común de abrir un hueco de seguridad en una página
          web; tiene nombre propio y todo (<em>XSS</em>). La regla práctica es fácil de recordar:{' '}
          <strong>texto que no escribiste tú, va con <code>textContent</code></strong>.
        </Callout>

        <h3>Cambiar el aspecto: clases, no estilos sueltos</h3>
        <p>
          Puedes tocar el estilo directo con <code>elemento.style.color = 'red'</code>, y funciona.
          Pero se vuelve un desorden rápido. Lo que se hace de verdad es tener la pinta ya escrita
          en el CSS y desde JavaScript solo <strong>poner o quitar la clase</strong>.
        </p>

        <Terminal
          titulo="classList"
          lineas={[
            "tarea.classList.add('hecha');       // la pone",
            "tarea.classList.remove('hecha');    // la quita",
            "tarea.classList.toggle('hecha');    // si está la quita, si no está la pone",
            "tarea.classList.contains('hecha');  // true o false",
          ]}
        />

        <Compare
          bien={{
            titulo: 'Con clase',
            items: [
              "En CSS: .hecha { text-decoration: line-through }",
              "En JS: tarea.classList.toggle('hecha')",
              'El diseño vive en el CSS, donde se busca',
              'Cambiar cómo se ve «hecha» es tocar un solo sitio',
            ],
          }}
          mal={{
            titulo: 'Con estilos sueltos',
            items: [
              "tarea.style.textDecoration = 'line-through'",
              "tarea.style.color = '#888'",
              'El diseño queda repartido entre dos archivos',
              'Para quitarlo toca acordarse de cada propiedad',
            ],
          }}
        />

        <p>Aquí puedes apretar cada instrucción y ver el DOM cambiar al lado:</p>
        <TallerDom />
      </Lesson>

      <Lesson title="4. Crear, montar y borrar elementos">
        <p>
          Hasta aquí cambiaste cosas que ya existían. Ahora vas a fabricar elementos nuevos. Son
          siempre tres movimientos, en este orden:
        </p>

        <Figure
          label="Diagrama: crear, configurar y montar un elemento"
          caption="Entre el primer paso y el tercero el elemento existe pero nadie lo ve. Ese hueco es el bug más común de la sesión."
        >
          <svg viewBox="0 0 640 150" xmlns="http://www.w3.org/2000/svg">
            {[
              { x: 8, t: '1. crear', s: "createElement('li')" },
              { x: 224, t: '2. llenar', s: 'textContent = …' },
              { x: 440, t: '3. montar', s: 'appendChild(item)' },
            ].map(({ x, t, s }) => (
              <g key={t}>
                <rect x={x} y="24" width="192" height="60" rx="10" fill="var(--color-text)" opacity="0.06" />
                <rect x={x} y="24" width="192" height="2" rx="1" fill="var(--color-accent)" opacity="0.75" />
                <text x={x + 16} y="50" fontSize="13" fill="var(--color-text)">
                  {t}
                </text>
                <text x={x + 16} y="70" fontSize="11.5" fontFamily="ui-monospace, monospace" fill="var(--color-text-2)">
                  {s}
                </text>
              </g>
            ))}
            <path d="M204 54 L220 54" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.8" />
            <path d="M420 54 L436 54" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.8" />
            <text x="8" y="118" fontSize="12.5" fill="var(--color-text-2)">
              Solo en el paso 3 aparece en pantalla. Antes vive en memoria.
            </text>
          </svg>
        </Figure>

        <Terminal
          titulo="Un <li> con su botón de borrar"
          lineas={[
            "// 1. crear",
            "const item = document.createElement('li');",
            "const borrar = document.createElement('button');",
            '',
            '// 2. llenar',
            "item.textContent = 'Estudiar el DOM';",
            "borrar.textContent = '✕';",
            "borrar.setAttribute('aria-label', 'Borrar tarea');",
            '',
            '// 3. montar — primero el botón dentro del li, luego el li en la lista',
            'item.appendChild(borrar);',
            "document.querySelector('#lista').appendChild(item);",
          ]}
        />

        <RefTable
          cabeceras={['Instrucción', 'Qué hace']}
          filas={[
            [<code key="a">padre.appendChild(hijo)</code>, 'Lo mete al final del padre'],
            [<code key="b">padre.prepend(hijo)</code>, 'Lo mete al principio'],
            [<code key="c">elemento.remove()</code>, 'Se saca a sí mismo de la página'],
            [<code key="d">padre.innerHTML = ''</code>, 'Vacía el padre de golpe: borra todos sus hijos'],
            [<code key="e">elemento.setAttribute('src', …)</code>, 'Pone un atributo cualquiera'],
          ]}
        />

        <Callout tipo="ojo">
          <code>createElement</code> no muestra nada. Es como armar un mueble en el taller: existe,
          pero hasta que no lo metas a la sala nadie lo ve. Si tu elemento «no aparece», lo primero
          que hay que revisar es si le falta el <code>appendChild</code>.
        </Callout>
      </Lesson>

      <Lesson title="5. Eventos: que la página reaccione">
        <p>
          Un evento es algo que pasa: un clic, una tecla, el envío de un formulario. Con{' '}
          <code>addEventListener</code> le dices al navegador «cuando pase esto, ejecuta esta
          función».
        </p>

        <Figure
          label="Diagrama: las tres partes de addEventListener"
          caption="A quién se lo pongo, qué espero que pase, y qué hago cuando pase."
        >
          <svg viewBox="0 0 640 170" xmlns="http://www.w3.org/2000/svg">
            <text x="8" y="40" fontSize="15" fontFamily="ui-monospace, monospace" fill="var(--color-text)">
              boton.addEventListener('click', function () &#123; … &#125;)
            </text>
            <path d="M20 52 L20 76 L96 76" stroke="var(--color-accent)" strokeWidth="1.3" fill="none" opacity="0.8" />
            <text x="104" y="80" fontSize="12.5" fill="var(--color-text-2)">
              1. el elemento que escucha
            </text>
            <path d="M204 52 L204 106 L280 106" stroke="var(--color-accent)" strokeWidth="1.3" fill="none" opacity="0.8" />
            <text x="288" y="110" fontSize="12.5" fill="var(--color-text-2)">
              2. qué evento espera
            </text>
            <path d="M290 52 L290 136 L366 136" stroke="var(--color-accent)" strokeWidth="1.3" fill="none" opacity="0.8" />
            <text x="374" y="140" fontSize="12.5" fill="var(--color-text-2)">
              3. qué hacer cuando pase
            </text>
          </svg>
        </Figure>

        <Terminal
          lineas={[
            "const boton = document.querySelector('#saludar');",
            "const mensaje = document.querySelector('#mensaje');",
            '',
            "boton.addEventListener('click', function () {",
            "  mensaje.textContent = '¡Hola! Hiciste clic.';",
            '});',
          ]}
        />
        <p>Se lee así: al botón, cuando ocurra un clic, ejecútale esta función.</p>

        <RefTable
          cabeceras={['Evento', 'Cuándo se dispara', 'Dónde se usa']}
          filas={[
            [<code key="a">'click'</code>, 'Al hacer clic o tocar', 'Botones, elementos de una lista'],
            [<code key="b">'submit'</code>, 'Al enviar un formulario', 'Formularios — con preventDefault'],
            [<code key="c">'input'</code>, 'Cada vez que se escribe una letra', 'Buscadores que filtran mientras escribes'],
            [<code key="d">'change'</code>, 'Al terminar de cambiar un campo', 'Select, checkbox'],
            [<code key="e">'keydown'</code>, 'Al apretar una tecla', 'Atajos, Enter para confirmar'],
            [<code key="f">'DOMContentLoaded'</code>, 'Cuando el HTML terminó de cargar', 'Alternativa a poner el script al final'],
          ]}
        />

        <h3>El objeto event: la función recibe información</h3>
        <p>
          La función que le pasas a <code>addEventListener</code> recibe un parámetro con todo lo
          que pasó. Por costumbre se le dice <code>e</code> o <code>evento</code>.
        </p>

        <Terminal
          lineas={[
            "lista.addEventListener('click', function (e) {",
            "  console.log(e.type);           // 'click'",
            '  console.log(e.target);         // el elemento exacto que se tocó',
            '  console.log(e.currentTarget);  // el elemento que tiene el listener',
            '});',
          ]}
        />

        <p>
          La diferencia entre <code>target</code> y <code>currentTarget</code> parece un detalle y
          resuelve un problema grande. Si pones <strong>un solo listener en la lista</strong>, ese
          listener también atiende los clics de las tareas que crees después — porque el clic sube
          desde el elemento tocado hasta sus padres. Eso se llama{' '}
          <strong>delegación</strong>, y evita tener que ponerle un listener a cada elemento nuevo.
        </p>

        <Terminal
          titulo="Delegación: un listener para todos, incluso los que aún no existen"
          lineas={[
            "lista.addEventListener('click', function (e) {",
            "  if (e.target.tagName === 'BUTTON') {",
            '    e.target.parentElement.remove();',
            '  }',
            '});',
          ]}
        />

        <h3>preventDefault: pararle el reflejo al navegador</h3>
        <p>
          Algunos elementos ya traen un comportamiento de fábrica. Un formulario, al enviarse,{' '}
          <strong>recarga la página</strong>. Si tu JavaScript iba a agregar una tarea, el recargue
          borra todo antes de que se alcance a ver. La instrucción que lo detiene es{' '}
          <code>e.preventDefault()</code>, y va siempre de primera.
        </p>

        <Terminal
          lineas={[
            "formulario.addEventListener('submit', function (e) {",
            '  e.preventDefault();  // sin esto, la página se recarga y no ves nada',
            '  // … aquí tu código',
            '});',
          ]}
        />

        <Callout tipo="ojo">
          Si tu página «parpadea y se borra sola» al darle Enter en un campo, no es un bug raro: es
          un formulario haciendo lo que hace desde 1995. Te falta el <code>preventDefault</code>.
        </Callout>

        <p>Míralo funcionando — haz clic en una tarea, en una ✕, y escribe en el campo:</p>
        <MiradorDeEventos />

        <Callout>
          Vas a ver por internet <code>&lt;button onclick="hacerAlgo()"&gt;</code>. Funciona, pero
          mezcla el comportamiento dentro del HTML y solo deja un manejador por elemento. En este
          curso se usa <code>addEventListener</code>: el HTML dice qué hay, el JavaScript dice qué
          hace.
        </Callout>
      </Lesson>

      <Lesson title="6. La to-do list, paso a paso">
        <Steps>
          <Step title="El HTML mínimo">
            <Terminal
              lineas={[
                '<form id="form-tarea">',
                '  <input id="tarea-input" type="text" placeholder="Nueva tarea">',
                '  <button type="submit">Agregar</button>',
                '</form>',
                '<ul id="lista-tareas"></ul>',
                '',
                '<script src="app.js" defer></script>',
              ]}
            />
            Es un <code>form</code> y no un <code>div</code> a propósito: así funciona también con
            Enter, sin código extra, y los lectores de pantalla lo entienden.
          </Step>
          <Step title="Agarra los elementos">
            <Terminal
              lineas={[
                "const form = document.querySelector('#form-tarea');",
                "const input = document.querySelector('#tarea-input');",
                "const lista = document.querySelector('#lista-tareas');",
              ]}
            />
            Los tres arriba del todo y una sola vez. Buscar el mismo elemento dentro de cada
            función es trabajo repetido.
          </Step>
          <Step title="Escucha el envío y detén la recarga">
            <Terminal
              lineas={[
                "form.addEventListener('submit', function (e) {",
                '  e.preventDefault();',
                "  const texto = input.value.trim();",
                "  if (texto === '') return;",
                '  // ...',
                '});',
              ]}
            />
            El <code>trim()</code> quita los espacios de los lados: sin él, una tarea de puros
            espacios pasa la validación. Y ese <code>return</code> temprano evita agregar tareas
            vacías — validar la entrada es parte del trabajo, no un extra.
          </Step>
          <Step title="Crea el elemento y móntalo">
            <Terminal
              lineas={[
                "  const item = document.createElement('li');",
                '  item.textContent = texto;',
                '',
                "  const borrar = document.createElement('button');",
                "  borrar.textContent = '✕';",
                '  item.appendChild(borrar);',
                '',
                '  lista.appendChild(item);',
              ]}
            />
            Hasta el <code>appendChild</code>, el <code>li</code> existe solo en memoria: nadie lo
            ve.
          </Step>
          <Step title="Limpia el campo y devuélvele el foco">
            <Terminal lineas={["  input.value = '';", '  input.focus();']} />
            Dos detalles pequeños que cambian por completo la sensación de usar la app: el campo
            queda vacío y listo, y el cursor sigue ahí para escribir la siguiente.
          </Step>
          <Step title="Un solo listener para borrar, en la lista">
            <Terminal
              lineas={[
                "lista.addEventListener('click', function (e) {",
                "  if (e.target.tagName === 'BUTTON') {",
                '    e.target.parentElement.remove();',
                '  }',
                '});',
              ]}
            />
            Puesto en la lista y no en cada botón: así funciona también con las tareas que se creen
            después. Eso es la delegación de la lección anterior, resolviendo un problema real.
          </Step>
        </Steps>

        <Terminal
          titulo="app.js — todo junto"
          lineas={[
            "const form = document.querySelector('#form-tarea');",
            "const input = document.querySelector('#tarea-input');",
            "const lista = document.querySelector('#lista-tareas');",
            '',
            "form.addEventListener('submit', function (e) {",
            '  e.preventDefault();',
            '',
            '  const texto = input.value.trim();',
            "  if (texto === '') return;",
            '',
            "  const item = document.createElement('li');",
            '  item.textContent = texto;',
            '',
            "  const borrar = document.createElement('button');",
            "  borrar.textContent = '✕';",
            '  item.appendChild(borrar);',
            '',
            '  lista.appendChild(item);',
            '',
            "  input.value = '';",
            '  input.focus();',
            '});',
            '',
            "lista.addEventListener('click', function (e) {",
            "  if (e.target.tagName === 'BUTTON') {",
            '    e.target.parentElement.remove();',
            '  }',
            '});',
          ]}
        />

        <Callout>
          Son 24 líneas y ya es una aplicación: recibe datos, los valida, los muestra y los borra.
          Lo único que le falta para ser «de verdad» es que las tareas sigan ahí al recargar — y eso
          es exactamente lo que vas a construir de la sesión 11 en adelante.
        </Callout>
      </Lesson>

      <Lesson title="7. Cuando no funciona: aprender a leer el error">
        <p>
          Vas a pasar más tiempo arreglando que escribiendo, y eso es normal — le pasa a todo el
          mundo que hace esto. Lo que separa a alguien que avanza de alguien que se bloquea es
          saber leer lo que dice la consola en vez de asustarse con el rojo.
        </p>

        <RefTable
          cabeceras={['El error que sale', 'Qué te está diciendo', 'Qué revisar']}
          filas={[
            [
              <code key="a">Cannot read properties of null</code>,
              'querySelector no encontró nada y devolvió null',
              'Que el id coincida exactamente, y que el script vaya con defer o al final del body',
            ],
            [
              <code key="b">x is not a function</code>,
              'Escribiste mal el nombre, o eso no es una función',
              'Ortografía: addEventListener, no addEventlistener',
            ],
            [
              <code key="c">x is not defined</code>,
              'Usaste una variable que no existe todavía',
              'Que esté declarada arriba y bien escrita',
            ],
            [
              <code key="d">Unexpected token</code>,
              'Falta o sobra un símbolo',
              'Paréntesis, llaves y comillas sin cerrar — mira la línea que te dice',
            ],
          ]}
        />

        <Steps>
          <Step title="Abre la consola antes que nada">
            <code>F12</code> → pestaña Console. Si hay algo en rojo, empieza por ahí: el error trae
            el archivo y la línea. Haz clic en ese enlace y te lleva justo al sitio.
          </Step>
          <Step title="Imprime lo que agarraste">
            <Terminal lineas={["const boton = document.querySelector('#agregar');", 'console.log(boton);']} />
            Si sale <code>null</code>, el problema no es tu lógica: no encontraste el elemento. Si
            sale la etiqueta, sigue adelante.
          </Step>
          <Step title="Comprueba que el listener sí corre">
            <Terminal lineas={["boton.addEventListener('click', function () {", "  console.log('entré');", '});']} />
            Si «entré» no aparece al hacer clic, el problema está en el listener. Si aparece, el
            problema está en lo que va después. Partir el problema en dos así reduce la búsqueda a
            la mitad cada vez.
          </Step>
          <Step title="Si es un fetch, mira la pestaña Network">
            Ahí ves si la petición salió, a qué dirección fue y qué respondió. Un{' '}
            <code>404</code> es «esa dirección no existe» y un <code>500</code> es «el servidor se
            rompió»: son problemas distintos y se arreglan en sitios distintos.
          </Step>
        </Steps>

        <Callout>
          Copia el mensaje de error tal cual y búscalo entre comillas. Casi siempre le pasó a
          alguien antes. Y si le preguntas a una IA, pégale el error <em>y</em> el código: pedirle
          ayuda con «no me funciona» es como llevar el carro al taller y decir «suena raro».
        </Callout>
      </Lesson>

      <Lesson title="8. Asíncrono: pedir algo que se demora">
        <p>
          Sumar dos números es instantáneo. Pedir datos por internet no: puede tardar medio segundo
          o fallar. Si el navegador se quedara esperando, la página se congelaría.
        </p>
        <Compare
          bien={{
            titulo: 'Asíncrono — como pedir domicilio',
            items: [
              'Haces el pedido y sigues en lo tuyo',
              'Cuando llega, te avisan y actúas',
              'La página nunca se congela',
              <code key="1">await fetch(...)</code>,
            ],
          }}
          mal={{
            titulo: 'Si fuera sincrónico',
            items: [
              'Te quedas parado en la puerta esperando',
              'Nada más puede pasar mientras tanto',
              'La página se traba y no responde al clic',
              'Por eso las peticiones NO funcionan así',
            ],
          }}
        />
        <Terminal
          lineas={[
            'async function obtenerPokemon() {',
            "  const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu');",
            '  const datos = await respuesta.json();',
            '  console.log(datos.name);',
            "  document.querySelector('#resultado').textContent = datos.name;",
            '}',
            '',
            'obtenerPokemon();',
          ]}
        />
        <RefTable
          cabeceras={['Palabra', 'Qué significa']}
          filas={[
            [<code key="a">async</code>, 'Esta función contiene esperas: devuelve una promesa'],
            [<code key="b">await</code>, 'Espera aquí a que llegue el resultado, sin congelar la página'],
            [<code key="c">fetch(url)</code>, 'Pide datos a una dirección de internet'],
            [<code key="d">.json()</code>, 'Convierte la respuesta en un objeto de JavaScript'],
          ]}
        />
        <Callout tipo="ojo">
          <code>await</code> solo funciona dentro de una función marcada con <code>async</code>. Si
          se te olvida el <code>await</code>, en vez del dato vas a ver{' '}
          <code>Promise &#123; &lt;pending&gt; &#125;</code>: eso significa «todavía no llega».
        </Callout>

        <h3>Lo que falta para que sea código de verdad</h3>
        <p>
          El ejemplo de arriba sirve para entender, pero le faltan dos cosas que en una app de
          verdad no son opcionales: <strong>avisar que está cargando</strong> y{' '}
          <strong>manejar el fallo</strong>. Internet se cae, las direcciones se equivocan y los
          servidores devuelven errores.
        </p>

        <Terminal
          titulo="La misma petición, terminada"
          lineas={[
            'const salida = document.querySelector(\'#resultado\');',
            '',
            'async function obtenerPokemon(nombre) {',
            "  salida.textContent = 'Cargando…';",
            '',
            '  try {',
            '    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);',
            '',
            '    // fetch NO lanza error si el servidor responde 404: hay que preguntarle',
            '    if (!respuesta.ok) {',
            '      throw new Error(`El servidor respondió ${respuesta.status}`);',
            '    }',
            '',
            '    const datos = await respuesta.json();',
            '    salida.textContent = `${datos.name} mide ${datos.height}`;',
            '  } catch (error) {',
            "    salida.textContent = 'No se pudo cargar. Revisa tu internet.';",
            '    console.error(error);',
            '  }',
            '}',
          ]}
        />

        <RefTable
          cabeceras={['Pieza', 'Para qué está ahí']}
          filas={[
            [<code key="a">try / catch</code>, 'Si algo de adentro falla, se salta al catch en vez de romper la página'],
            [<code key="b">respuesta.ok</code>, 'true si el código está entre 200 y 299. fetch no falla solo por un 404'],
            [<code key="c">respuesta.status</code>, 'El número: 200 salió bien, 404 no existe, 500 el servidor se rompió'],
            [<code key="d">console.error(error)</code>, 'Deja el detalle técnico en la consola, no en la cara del usuario'],
          ]}
        />

        <Callout tipo="ojo">
          Esta es la trampa que más sorprende: <strong>un 404 no es un error para fetch</strong>.
          Para <code>fetch</code>, «el servidor me respondió» ya es éxito, aunque haya respondido
          «no existe». Solo falla si no logró ni conectarse. Por eso el <code>if (!respuesta.ok)</code>{' '}
          va siempre.
        </Callout>
      </Lesson>

      <Lesson title="9. Node.js: el mismo JavaScript, fuera del navegador">
        <p>
          Todo lo de hoy corrió dentro del navegador. <strong>Node.js</strong> es ese mismo lenguaje
          ejecutándose en un servidor: sin ventanas, sin DOM, pero con acceso a archivos y a la red.
          En la próxima sesión tú vas a ser el que responda las peticiones.
        </p>
        <p>
          Dicho de otro modo: hoy fuiste el que <em>pide</em> con <code>fetch</code>. Desde la
          sesión 11 vas a estar del otro lado, siendo el que <em>responde</em>. Es el mismo
          lenguaje, las mismas funciones, las mismas llaves — lo único que cambia es dónde corre y
          qué herramientas tiene a mano.
        </p>
        <RefTable
          cabeceras={['', 'En el navegador', 'En Node.js']}
          filas={[
            ['Lenguaje', 'JavaScript', 'JavaScript'],
            ['Tiene document y window', 'Sí', 'No — no hay página'],
            ['Puede leer archivos del disco', 'No', 'Sí'],
            ['Se abre con', 'Un archivo .html', <code key="a">node app.js</code>],
          ]}
        />
      </Lesson>

      <Lesson title="10. Referencia: los métodos, para copiar y pegar">
        <span id="referencia" />
        <p>
          Aquí está todo lo de la sesión, método por método, con la explicación dentro del propio
          código. Las pestañas de arriba filtran por grupo, y el botón <em>Copiar</em> se lo lleva
          al editor sin que tengas que seleccionarlo a mano. Los comentarios se copian con él: una
          vez pegado en tu archivo, el fragmento sigue explicándose solo.
        </p>
        <p>
          Todos los ejemplos corren sobre la misma tarjeta de producto que armamos en clase. Es a
          propósito: veinticuatro ejemplos con veinticuatro contextos distintos no se acumulan en
          la cabeza; con uno solo, cada método nuevo se entiende contra el anterior.
        </p>

        <Snippets
          grupos={REFERENCIA}
          nota={
            <>
              Los atributos (<code>class</code>, <code>src</code>, <code>data-id</code>…) son
              propiedades del nodo elemento, no nodos hijos aparte. Lo único que se vuelve un nodo
              independiente es el texto entre etiquetas, y ese nodo se llama <code>#text</code>.
            </>
          }
        />
      </Lesson>

      <Exercises>
        <Quiz
          id="que-es-dom"
          index={1}
          title="¿Qué es el DOM?"
          options={[
            { id: 'a', label: 'Otro lenguaje de programación' },
            { id: 'b', label: 'La representación en memoria de tu HTML, que JavaScript puede leer y modificar' },
            { id: 'c', label: 'Un archivo que se descarga aparte' },
            { id: 'd', label: 'La hoja de estilos de la página' },
          ]}
          answer="b"
          explanation="El HTML es el plano y el DOM es la casa construida: un árbol de objetos vivo que puedes modificar mientras la página está abierta."
        />

        <FillBlank
          id="query-selector"
          index={2}
          title="Agarra el elemento"
          prompt="Tienes <button id='agregar'> en el HTML."
          code={"const boton = document.___('#agregar');"}
          options={['querySelector', 'getElement', 'select', 'find']}
          answer="querySelector"
          explanation="querySelector recibe un selector de CSS: '#agregar' por id, '.tarjeta' por clase, 'button' por etiqueta. Es el mismo lenguaje que ya usaste en la sesión 6."
        />

        <Quiz
          id="selector-punto"
          index={3}
          title="Por clase o por id"
          prompt="Quieres agarrar TODOS los elementos con class='tarjeta'."
          options={[
            { id: 'a', label: "document.querySelector('.tarjeta')" },
            { id: 'b', label: "document.querySelectorAll('.tarjeta')" },
            { id: 'c', label: "document.querySelector('#tarjeta')" },
            { id: 'd', label: "document.createElement('.tarjeta')" },
          ]}
          answer="b"
          explanation="querySelector devuelve solo el primero; querySelectorAll devuelve todos, en una lista que puedes recorrer con un bucle."
        />

        <Quiz
          id="selector-todos"
          index={4}
          title="Una lista no es un elemento"
          prompt="¿Qué pasa con este código?"
          code={"const tareas = document.querySelectorAll('li');\ntareas.textContent = 'Hola';"}
          options={[
            { id: 'a', label: 'Cambia el texto de todos los <li>' },
            { id: 'b', label: 'Cambia el texto del primer <li>' },
            { id: 'c', label: 'No pasa nada y tampoco sale un error: le pusiste una propiedad a la lista, no a los elementos' },
            { id: 'd', label: 'Sale «Cannot read properties of null»' },
          ]}
          answer="c"
          explanation="Es de los bugs que más tiempo hacen perder, justamente porque no avisa. A la lista hay que recorrerla: tareas.forEach(t => t.textContent = 'Hola')."
        />

        <Quiz
          id="querySelector-null"
          index={5}
          title="querySelector devuelve null"
          prompt="Tu código falla con «Cannot read properties of null». ¿Cuál es la causa más común?"
          options={[
            { id: 'a', label: 'El script corre antes de que el HTML exista: ponlo al final del body o usa defer' },
            { id: 'b', label: 'Falta instalar Node.js' },
            { id: 'c', label: 'El navegador está desactualizado' },
            { id: 'd', label: 'Hay que reiniciar el computador' },
          ]}
          answer="a"
          explanation="Si el script corre primero, el elemento todavía no existe y querySelector devuelve null. La otra causa es que el id no coincida exactamente."
        />

        <PredictOutput
          id="texto-vs-html"
          index={6}
          title="textContent no interpreta"
          prompt="El elemento #caja está vacío. ¿Qué se lee en pantalla después de esta línea?"
          code={"caja.textContent = '<b>Hola</b>';"}
          answers={['<b>Hola</b>', '<b>hola</b>']}
          explanation="Se lee tal cual: <b>Hola</b>. textContent trata todo como texto plano. Con innerHTML sí se vería «Hola» en negrilla — y por eso innerHTML nunca se usa con texto que escribió un usuario."
        />

        <Quiz
          id="innerhtml-riesgo"
          index={7}
          title="¿Por qué no innerHTML con texto del usuario?"
          prompt="Un usuario escribe en tu formulario y tú haces lista.innerHTML += loQueEscribio."
          options={[
            { id: 'a', label: 'Porque el usuario puede escribir etiquetas HTML y hasta scripts, y tu página los ejecuta' },
            { id: 'b', label: 'Porque innerHTML es más lento' },
            { id: 'c', label: 'Porque innerHTML no existe en todos los navegadores' },
            { id: 'd', label: 'No hay ningún problema' },
          ]}
          answer="a"
          explanation="Tiene nombre propio: XSS. La regla práctica es corta — texto que no escribiste tú, va con textContent."
        />

        <FillBlank
          id="classlist-toggle"
          index={8}
          title="Poner y quitar con una sola línea"
          prompt="Quieres que al hacer clic la tarea se tache, y al volver a hacer clic se destache."
          code={"tarea.classList.___('hecha');"}
          options={['toggle', 'add', 'remove', 'contains']}
          answer="toggle"
          explanation="toggle pone la clase si no está y la quita si está. Con add tendrías que preguntar antes con contains y llamar a remove tú mismo."
        />

        <Quiz
          id="clase-vs-estilo"
          index={9}
          title="¿Clase o estilo suelto?"
          prompt="Quieres que una tarea terminada se vea tachada y en gris."
          options={[
            { id: 'a', label: 'Escribir .hecha en el CSS y en JS hacer classList.add(\'hecha\')' },
            { id: 'b', label: 'En JS poner style.textDecoration y style.color uno por uno' },
            { id: 'c', label: 'Cambiar el archivo CSS desde JavaScript' },
            { id: 'd', label: 'Volver a escribir todo el HTML' },
          ]}
          answer="a"
          explanation="El diseño vive en el CSS, donde uno lo busca; el JavaScript solo decide el estado. Además, para quitarlo basta con remove('hecha') en vez de acordarse de cada propiedad."
        />

        <FillBlank
          id="add-event"
          index={10}
          title="Escucha el clic"
          code={"boton.___('click', function () {\n  console.log('clic');\n});"}
          options={['addEventListener', 'onClick', 'listen', 'addEvent']}
          answer="addEventListener"
          explanation="addEventListener(evento, función): a este elemento, cuando pase este evento, ejecuta esta función."
        />

        <FillBlank
          id="prevent-default"
          index={11}
          title="Que el formulario no recargue"
          prompt="Sin esta línea, la página se recarga y pierdes todo."
          code={"form.addEventListener('submit', function (e) {\n  e.___();\n  // ...\n});"}
          options={['preventDefault', 'stopPropagation', 'preventSubmit', 'cancel']}
          answer="preventDefault"
          explanation="preventDefault le quita al navegador su comportamiento de fábrica. En un formulario ese comportamiento es enviar los datos y recargar."
        />

        <Quiz
          id="event-target"
          index={12}
          title="target y currentTarget"
          prompt="El listener está puesto en el <ul>. Haces clic en el <button> que está dentro de un <li>."
          options={[
            { id: 'a', label: 'e.target es el <button> y e.currentTarget es el <ul>' },
            { id: 'b', label: 'Los dos son el <ul>' },
            { id: 'c', label: 'Los dos son el <button>' },
            { id: 'd', label: 'e.target es el <li> y e.currentTarget es el <button>' },
          ]}
          answer="a"
          explanation="target es lo que tocaste; currentTarget es dónde está puesto el listener. El clic sube desde el botón hasta sus padres, y por eso el listener del ul se entera."
        />

        <Quiz
          id="delegacion"
          index={13}
          title="El botón que todavía no existe"
          prompt="Creas tareas nuevas con createElement, cada una con su botón de borrar. ¿Dónde pones el listener del clic?"
          options={[
            { id: 'a', label: 'Uno en la lista, y adentro preguntas si e.target es un botón' },
            { id: 'b', label: 'Uno en cada botón, justo después de crearlo, y otro más por si acaso' },
            { id: 'c', label: 'Uno en el document.body y listo' },
            { id: 'd', label: 'No se puede: hay que recargar la página' },
          ]}
          answer="a"
          explanation="Eso es delegación. Un solo listener en el padre atiende también a los hijos que se creen después, porque el evento sube. La opción b funciona, pero acumula un listener por tarea."
        />

        <MatchPairs
          id="empareja-dom"
          index={14}
          title="Empareja la instrucción con su efecto"
          pairs={[
            { id: 'text', izquierda: <code>elemento.textContent = 'Hola'</code>, derecha: 'Cambia el texto que se ve' },
            { id: 'value', izquierda: <code>input.value</code>, derecha: 'Lee lo que escribió el usuario' },
            { id: 'create', izquierda: <code>document.createElement('li')</code>, derecha: 'Crea un elemento en memoria' },
            { id: 'append', izquierda: <code>lista.appendChild(item)</code>, derecha: 'Lo mete en la página' },
            { id: 'remove', izquierda: <code>item.remove()</code>, derecha: 'Lo saca de la página' },
          ]}
          explanation="Fíjate en la diferencia entre createElement y appendChild: crear no es mostrar. Mientras no lo montes, el elemento existe pero nadie lo ve."
        />

        <TrueFalse
          id="create-no-muestra"
          index={15}
          title="Crear no es mostrar"
          statement="Después de document.createElement('li'), el elemento ya aparece en la página."
          answer={false}
          explanation="Falso. Vive en memoria hasta que lo montes con appendChild. Es el bug clásico del «creé el elemento y no se ve»."
        />

        <OrderSteps
          id="orden-todo"
          index={16}
          title="Ordena el manejador de «Agregar»"
          prompt="Lo que pasa dentro del listener del submit."
          steps={[
            { id: 'prevent', text: 'e.preventDefault();' },
            { id: 'lee', text: 'const texto = input.value.trim();' },
            { id: 'valida', text: "if (texto === '') return;" },
            { id: 'crea', text: "const item = document.createElement('li');" },
            { id: 'texto', text: 'item.textContent = texto;' },
            { id: 'monta', text: 'lista.appendChild(item);' },
            { id: 'limpia', text: "input.value = '';" },
          ]}
          explanation="Detener la recarga, leer, validar, crear, llenar, montar y limpiar. Si limpiaras el input antes de leerlo, agregarías tareas vacías; y sin el preventDefault de primera, nada de lo demás alcanza a verse."
        />

        <Quiz
          id="limpiar-input"
          index={17}
          title="¿Por qué input.value = '' al final?"
          options={[
            { id: 'a', label: 'Para borrar la tarea recién agregada' },
            { id: 'b', label: 'Para dejar el campo vacío y listo para la siguiente tarea' },
            { id: 'c', label: 'Porque JavaScript lo exige' },
            { id: 'd', label: 'Para que la lista no se duplique' },
          ]}
          answer="b"
          explanation="Es un detalle de experiencia de uso: sin eso, el usuario tiene que borrar a mano antes de escribir la siguiente. Cosas así son las que hacen que una app se sienta bien hecha."
        />

        <TrueFalse
          id="sincronico-suma"
          index={18}
          title="¿Sincrónico o asíncrono?"
          statement="Sumar dos números es una operación asíncrona."
          answer={false}
          explanation="Falso: es inmediata, no hay nada que esperar. Asíncrono es lo que se demora y no depende de ti: pedir datos por internet, leer un archivo grande."
        />

        <Quiz
          id="por-que-async"
          index={19}
          title="¿Por qué las peticiones son asíncronas?"
          options={[
            { id: 'a', label: 'Porque si el navegador esperara la respuesta, la página se congelaría' },
            { id: 'b', label: 'Porque internet es opcional' },
            { id: 'c', label: 'Porque JavaScript no sabe hacer cuentas' },
            { id: 'd', label: 'Para que el código se vea más moderno' },
          ]}
          answer="a"
          explanation="Como pedir domicilio: haces el pedido y sigues en lo tuyo. Si te quedaras parado en la puerta, no podrías hacer nada más."
        />

        <FillBlank
          id="await-fetch"
          index={20}
          title="Espera la respuesta"
          prompt="Dentro de una función async."
          code={"const respuesta = ___ fetch('https://pokeapi.co/api/v2/pokemon/pikachu');"}
          options={['await', 'async', 'return', 'wait']}
          answer="await"
          explanation="await pausa esa función hasta que llegue la respuesta, sin congelar el resto de la página. Y solo se puede usar dentro de una función async."
        />

        <Quiz
          id="promise-pending"
          index={21}
          title="Promise { <pending> }"
          prompt="Imprimes el resultado de un fetch y en consola sale «Promise { <pending> }». ¿Qué pasó?"
          options={[
            { id: 'a', label: 'Faltó el await: estás imprimiendo la promesa, no el dato' },
            { id: 'b', label: 'La API está caída' },
            { id: 'c', label: 'El navegador no soporta fetch' },
            { id: 'd', label: 'El dato llegó vacío' },
          ]}
          answer="a"
          explanation="«Pending» significa «todavía no llega». La promesa es el recibo del pedido; await es esperar a que traigan la comida."
        />

        <Quiz
          id="respuesta-json"
          index={22}
          title="¿Para qué .json()?"
          prompt="¿Qué hace await respuesta.json()?"
          options={[
            { id: 'a', label: 'Convierte la respuesta del servidor en un objeto de JavaScript que puedes usar' },
            { id: 'b', label: 'Guarda la respuesta en un archivo' },
            { id: 'c', label: 'Traduce la respuesta al español' },
            { id: 'd', label: 'Comprime los datos' },
          ]}
          answer="a"
          explanation="La respuesta llega como texto en formato JSON. .json() lo convierte en un objeto con propiedades que puedes leer: datos.name, datos.height."
        />

        <TrueFalse
          id="fetch-ok"
          index={23}
          title="El 404 y el fetch"
          statement="Si el servidor responde 404, el fetch lanza un error y se va al catch."
          answer={false}
          explanation="Falso, y sorprende a todo el mundo. Para fetch, «el servidor me respondió» ya es éxito, aunque haya respondido «no existe». Solo falla si no logra conectarse. Por eso siempre va el if (!respuesta.ok)."
        />

        <MultiSelect
          id="try-catch-fetch"
          index={24}
          title="Una petición terminada"
          prompt="Marca lo que le falta a un fetch para estar listo para usuarios de verdad."
          options={[
            { id: 'cargando', label: 'Mostrar «Cargando…» mientras llega' },
            { id: 'trycatch', label: 'Un try/catch por si no hay internet' },
            { id: 'ok', label: 'Revisar respuesta.ok antes de usar los datos' },
            { id: 'mensaje', label: 'Un mensaje entendible si falla, no el error técnico' },
            { id: 'recargar', label: 'Recargar la página automáticamente cada 5 segundos' },
          ]}
          answers={['cargando', 'trycatch', 'ok', 'mensaje']}
          explanation="Las cuatro primeras son la diferencia entre un ejemplo y una app. Recargar sola no arregla nada y le quita el control al usuario."
        />

        <PredictOutput
          id="acceder-propiedad"
          index={25}
          title="Lee la propiedad"
          prompt="La API devolvió { name: 'pikachu', height: 4 }. ¿Qué imprime esta línea?"
          code={"console.log(datos.name);"}
          answers={['pikachu']}
          explanation="pikachu. El punto accede a una propiedad del objeto. Es la misma idea que vas a usar con los datos de tu propia API en la sesión 11."
        />

        <MultiSelect
          id="donde-depurar"
          index={26}
          title="El fetch no muestra nada"
          prompt="Marca los sitios donde vas a buscar el problema."
          options={[
            { id: 'network', label: 'La pestaña Network de DevTools: ver si la petición salió y qué código devolvió' },
            { id: 'console', label: 'La consola: errores en rojo' },
            { id: 'url', label: 'La URL: probarla directamente en el navegador' },
            { id: 'await', label: 'Que no falte el await' },
            { id: 'css', label: 'El archivo styles.css' },
          ]}
          answers={['network', 'console', 'url', 'await']}
          explanation="Network te dice si la petición salió y qué respondió el servidor; la consola muestra los errores de tu código. El CSS no tiene nada que ver."
        />

        <TrueFalse
          id="dom-vs-html"
          index={27}
          title="Modificar el DOM"
          statement="Cuando JavaScript agrega un <li> a la lista, el archivo index.html cambia en tu disco."
          answer={false}
          explanation="Falso. Los cambios ocurren en el DOM, en memoria. Si recargas la página vuelve todo al estado original: por eso más adelante necesitas una base de datos."
        />

        <Quiz
          id="node-que-es"
          index={28}
          title="¿Qué es Node.js?"
          options={[
            { id: 'a', label: 'Un lenguaje nuevo que reemplaza a JavaScript' },
            { id: 'b', label: 'JavaScript ejecutándose fuera del navegador, en un servidor' },
            { id: 'c', label: 'Una librería de estilos' },
            { id: 'd', label: 'Un editor de código' },
          ]}
          answer="b"
          explanation="El mismo lenguaje, otro entorno. En Node no hay document ni window —no hay página— pero sí acceso a archivos y a la red."
        />

        <Quiz
          id="clon-createElement"
          index={29}
          title="De Scratch al DOM"
          prompt="¿Qué bloque de Scratch se parece a document.createElement()?"
          options={[
            { id: 'a', label: '«crear clon de mí mismo»' },
            { id: 'b', label: '«fijar variable a»' },
            { id: 'c', label: '«esperar 2 segundos»' },
            { id: 'd', label: '«decir Hola»' },
          ]}
          answer="a"
          explanation="Los dos fabrican copias mientras el programa corre. En Scratch eran obstáculos; aquí son elementos de una lista."
        />

        <Quiz
          id="navegar-arbol"
          index={30}
          title="Del botón a la tarjeta"
          prompt="Dentro del listener tienes el botón que se tocó, y necesitas la tarjeta .producto que lo contiene para borrarla entera."
          options={[
            { id: 'a', label: 'e.target.parentElement' },
            { id: 'b', label: 'e.target.children' },
            { id: 'c', label: 'e.target.firstElementChild' },
            { id: 'd', label: 'e.target.nextElementSibling' },
          ]}
          answer="a"
          explanation="parentElement sube al padre directo. children y firstElementChild bajan a los hijos, y nextElementSibling se mueve de lado, al hermano siguiente."
        />

        <FillBlank
          id="set-attribute"
          index={31}
          title="Cambiar la imagen"
          prompt="Quieres que la foto del producto cambie al pasar el mouse."
          code={"img.___('src', 'tenis1-hover.jpg');"}
          options={['setAttribute', 'getAttribute', 'setSrc', 'attribute']}
          answer="setAttribute"
          explanation="setAttribute recibe el nombre del atributo y el valor nuevo, y lo crea si no existía. getAttribute es el que lee."
        />

        <MultiSelect
          id="tarea-s10"
          index={32}
          title="Tarea para la próxima sesión"
          prompt="Marca lo que debes tener listo para la sesión 11."
          options={[
            { id: 'todo', label: 'La to-do list funcionando, con botón de eliminar' },
            { id: 'node', label: 'Node.js instalado desde nodejs.org' },
            { id: 'mongo', label: 'MongoDB configurado' },
            { id: 'react', label: 'React instalado' },
          ]}
          answers={['todo', 'node']}
          explanation="Solo esas dos. Mongo llega en la sesión 13 y React en la 16: cada cosa a su tiempo."
        />
      </Exercises>
    </TopicPage>
  );
}
