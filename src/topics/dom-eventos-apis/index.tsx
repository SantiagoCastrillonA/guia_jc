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
import { Callout, Compare, Figure, RefTable, Step, Steps, Terminal } from '../../components/visuals';

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
            <text x="0" y="200" fontSize="12.5" fill="var(--color-text)" opacity="0.55" fontFamily="ui-monospace, monospace">
              document.querySelector('#lista') → el nodo ul
            </text>
          </svg>
        </Figure>

        <RefTable
          cabeceras={['Qué quieres hacer', 'Cómo se escribe']}
          filas={[
            ['Agarrar un elemento', <code key="a">document.querySelector('#id')</code>],
            ['Cambiar su texto', <code key="b">elemento.textContent = 'Hola'</code>],
            ['Cambiar un estilo por clase', <code key="c">elemento.classList.add('activo')</code>],
            ['Leer lo que escribió el usuario', <code key="d">input.value</code>],
            ['Crear un elemento nuevo', <code key="e">document.createElement('li')</code>],
            ['Meterlo en la página', <code key="f">lista.appendChild(item)</code>],
          ]}
        />

        <Callout>
          <code>createElement</code> es el <em>«crear clon de mí mismo»</em> de Scratch: un molde
          que fabrica elementos mientras el programa corre. Lo usaste en la sesión 3 para los
          obstáculos; hoy lo usas para las tareas de una lista.
        </Callout>
      </Lesson>

      <Lesson title="2. Eventos: que la página reaccione">
        <p>
          Un evento es algo que pasa: un clic, una tecla, el envío de un formulario. Con{' '}
          <code>addEventListener</code> le dices al navegador «cuando pase esto, ejecuta esta
          función».
        </p>
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
        <Callout tipo="ojo">
          Si <code>querySelector</code> devuelve <code>null</code>, casi siempre es porque el script
          corrió antes de que el HTML existiera. Solución: pon la etiqueta{' '}
          <code>&lt;script&gt;</code> al final del <code>body</code>, o usa{' '}
          <code>&lt;script defer&gt;</code>.
        </Callout>
      </Lesson>

      <Lesson title="3. La to-do list, paso a paso">
        <Steps>
          <Step title="El HTML mínimo">
            <Terminal
              lineas={[
                '<input id="tarea-input" type="text" placeholder="Nueva tarea">',
                '<button id="agregar">Agregar</button>',
                '<ul id="lista-tareas"></ul>',
              ]}
            />
          </Step>
          <Step title="Agarra los tres elementos">
            <Terminal
              lineas={[
                "const input = document.querySelector('#tarea-input');",
                "const boton = document.querySelector('#agregar');",
                "const lista = document.querySelector('#lista-tareas');",
              ]}
            />
          </Step>
          <Step title="Escucha el clic y valida">
            <Terminal
              lineas={[
                "boton.addEventListener('click', function () {",
                "  if (input.value === '') return;",
                '  // ...',
                '});',
              ]}
            />
            Ese <code>return</code> temprano evita agregar tareas vacías. Validar la entrada es
            parte del trabajo, no un extra.
          </Step>
          <Step title="Crea el elemento y móntalo">
            <Terminal
              lineas={[
                "  const item = document.createElement('li');",
                '  item.textContent = input.value;',
                '  lista.appendChild(item);',
              ]}
            />
            Hasta el <code>appendChild</code>, el <code>li</code> existe solo en memoria: nadie lo
            ve.
          </Step>
          <Step title="Limpia el campo">
            <Terminal lineas={["  input.value = '';"]} />
            Un detalle pequeño que cambia por completo la sensación de usar la app.
          </Step>
          <Step title="Bonus: eliminar al hacer clic">
            <Terminal lineas={["  item.addEventListener('click', () => item.remove());"]} />
          </Step>
        </Steps>
      </Lesson>

      <Lesson title="4. Asíncrono: pedir algo que se demora">
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
      </Lesson>

      <Lesson title="5. Node.js: el mismo JavaScript, fuera del navegador">
        <p>
          Todo lo de hoy corrió dentro del navegador. <strong>Node.js</strong> es ese mismo lenguaje
          ejecutándose en un servidor: sin ventanas, sin DOM, pero con acceso a archivos y a la red.
          En la próxima sesión tú vas a ser el que responda las peticiones.
        </p>
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
          id="querySelector-null"
          index={4}
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

        <FillBlank
          id="add-event"
          index={5}
          title="Escucha el clic"
          code={"boton.___('click', function () {\n  console.log('clic');\n});"}
          options={['addEventListener', 'onClick', 'listen', 'addEvent']}
          answer="addEventListener"
          explanation="addEventListener(evento, función): a este elemento, cuando pase este evento, ejecuta esta función."
        />

        <MatchPairs
          id="empareja-dom"
          index={6}
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
          index={7}
          title="Crear no es mostrar"
          statement="Después de document.createElement('li'), el elemento ya aparece en la página."
          answer={false}
          explanation="Falso. Vive en memoria hasta que lo montes con appendChild. Es el bug clásico del «creé el elemento y no se ve»."
        />

        <OrderSteps
          id="orden-todo"
          index={8}
          title="Ordena el manejador de «Agregar»"
          prompt="Lo que pasa dentro del addEventListener del botón."
          steps={[
            { id: 'valida', text: "if (input.value === '') return;" },
            { id: 'crea', text: "const item = document.createElement('li');" },
            { id: 'texto', text: 'item.textContent = input.value;' },
            { id: 'monta', text: 'lista.appendChild(item);' },
            { id: 'limpia', text: "input.value = '';" },
          ]}
          explanation="Validar, crear, llenar, montar y limpiar. Si limpiaras el input antes de leerlo, agregarías tareas vacías."
        />

        <Quiz
          id="limpiar-input"
          index={9}
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
          index={10}
          title="¿Sincrónico o asíncrono?"
          statement="Sumar dos números es una operación asíncrona."
          answer={false}
          explanation="Falso: es inmediata, no hay nada que esperar. Asíncrono es lo que se demora y no depende de ti: pedir datos por internet, leer un archivo grande."
        />

        <Quiz
          id="por-que-async"
          index={11}
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
          index={12}
          title="Espera la respuesta"
          prompt="Dentro de una función async."
          code={"const respuesta = ___ fetch('https://pokeapi.co/api/v2/pokemon/pikachu');"}
          options={['await', 'async', 'return', 'wait']}
          answer="await"
          explanation="await pausa esa función hasta que llegue la respuesta, sin congelar el resto de la página. Y solo se puede usar dentro de una función async."
        />

        <Quiz
          id="promise-pending"
          index={13}
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
          index={14}
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

        <PredictOutput
          id="acceder-propiedad"
          index={15}
          title="Lee la propiedad"
          prompt="La API devolvió { name: 'pikachu', height: 4 }. ¿Qué imprime esta línea?"
          code={"console.log(datos.name);"}
          answers={['pikachu']}
          explanation="pikachu. El punto accede a una propiedad del objeto. Es la misma idea que vas a usar con los datos de tu propia API en la sesión 11."
        />

        <MultiSelect
          id="donde-depurar"
          index={16}
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
          index={17}
          title="Modificar el DOM"
          statement="Cuando JavaScript agrega un <li> a la lista, el archivo index.html cambia en tu disco."
          answer={false}
          explanation="Falso. Los cambios ocurren en el DOM, en memoria. Si recargas la página vuelve todo al estado original: por eso más adelante necesitas una base de datos."
        />

        <Quiz
          id="node-que-es"
          index={18}
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
          index={19}
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

        <MultiSelect
          id="tarea-s10"
          index={20}
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
