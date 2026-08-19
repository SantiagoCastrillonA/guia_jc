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
import { EstadoDemo, PropsDemo } from './Demos';

const SLUG = 'react-componentes-props-state';

/** Sesión 16 del cronograma — React: componentes, JSX, props y estado. */
export default function ReactComponentesPropsState() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. El problema que resuelve React">
        <p>
          Con JavaScript puro, para mostrar diez productos escribías un bucle que creaba elementos a
          mano, y para actualizar uno tenías que encontrarlo en el DOM y modificarlo. Con veinte
          piezas de interfaz eso se vuelve inmanejable.
        </p>
        <Compare
          bien={{
            titulo: 'Con React',
            items: [
              'Describes cómo se ve la interfaz según los datos',
              'Cambias el dato y React actualiza la pantalla',
              'Componentes reutilizables: escribes la tarjeta una vez',
              'La interfaz es una función del estado',
            ],
          }}
          mal={{
            titulo: 'Con DOM a mano',
            items: [
              'Dices paso a paso qué crear, mover y borrar',
              'Tú te encargas de sincronizar datos y pantalla',
              'Copiar y pegar el mismo bloque de código',
              'Al tercer cambio, algo queda desincronizado',
            ],
          }}
        />
        <Callout>
          La idea de fondo: <strong>la pantalla es el reflejo de los datos</strong>. Tú no tocas el
          DOM; cambias el dato y React calcula qué hay que redibujar.
        </Callout>
      </Lesson>

      <Lesson title="2. Un componente es una función que devuelve interfaz">
        <Terminal
          lineas={[
            'function Saludo() {',
            '  return <h1>Hola, bienvenido a mi negocio</h1>;',
            '}',
            '',
            '// se usa como si fuera una etiqueta más',
            '<Saludo />',
          ]}
        />
        <RefTable
          cabeceras={['Regla', 'Por qué']}
          filas={[
            ['El nombre empieza en mayúscula', 'Así React lo distingue de una etiqueta HTML'],
            ['Devuelve un solo elemento raíz', 'Si necesitas varios, envuélvelos en <> … </>'],
            [<code key="a">className</code>, <span key="b">En JSX se escribe así, no <code>class</code></span>],
            ['Las llaves insertan JavaScript', <code key="c">{'<p>{producto.nombre}</p>'}</code>],
          ]}
        />
        <Callout tipo="ojo">
          JSX no es HTML: es JavaScript disfrazado. Por eso <code>class</code> se vuelve{' '}
          <code>className</code> y <code>for</code> se vuelve <code>htmlFor</code> — esas palabras
          ya están tomadas por el lenguaje.
        </Callout>
      </Lesson>

      <Lesson title="3. Props: los datos que entran">
        <p>
          Las props son los parámetros del componente. El padre las pasa, el hijo las lee — y{' '}
          <strong>nunca las modifica</strong>. Cambia las props aquí y mira qué pasa con la tarjeta:
        </p>

        <PropsDemo />

        <Terminal
          lineas={[
            'function TarjetaProducto({ nombre, precio, destacado }) {',
            '  return (',
            '    <article className={destacado ? "tarjeta destacada" : "tarjeta"}>',
            '      <h3>{nombre}</h3>',
            '      <p>${precio.toLocaleString("es-CO")}</p>',
            '    </article>',
            '  );',
            '}',
          ]}
        />
        <Callout>
          Fíjate en el contador de renders de la demo: cada vez que cambia una prop, el componente
          se vuelve a ejecutar. Eso es normal y es barato — React compara el resultado y solo toca
          del DOM lo que de verdad cambió.
        </Callout>
      </Lesson>

      <Lesson title="4. Estado: lo que el componente recuerda">
        <p>
          Una variable normal se pierde en cada render. El <strong>estado</strong> sobrevive, y
          además avisa a React de que hay que redibujar cuando cambia.
        </p>

        <EstadoDemo />

        <Terminal
          lineas={[
            "import { useState } from 'react';",
            '',
            'function Contador() {',
            '  const [cantidad, setCantidad] = useState(0);',
            '',
            '  return (',
            '    <button onClick={() => setCantidad(cantidad + 1)}>',
            '      Llevas {cantidad}',
            '    </button>',
            '  );',
            '}',
          ]}
        />
        <RefTable
          cabeceras={['Parte', 'Qué es']}
          filas={[
            [<code key="a">cantidad</code>, 'El valor actual'],
            [<code key="b">setCantidad</code>, 'La única forma válida de cambiarlo'],
            [<code key="c">useState(0)</code>, 'El valor inicial'],
          ]}
        />
        <Callout tipo="ojo">
          Nunca hagas <code>cantidad = 5</code> ni <code>tareas.push(...)</code>. React no se entera
          y la pantalla no se actualiza. Siempre a través de la función <code>set…</code>, y con
          listas creando una nueva: <code>setTareas([...tareas, nueva])</code>.
        </Callout>
      </Lesson>

      <Lesson title="5. Listas: map y key">
        <Terminal
          lineas={[
            '{productos.map((producto) => (',
            '  <TarjetaProducto',
            '    key={producto._id}',
            '    nombre={producto.nombre}',
            '    precio={producto.precio}',
            '  />',
            '))}',
          ]}
        />

        <Figure
          label="Diagrama: un array de datos se convierte en una lista de componentes"
          caption="map transforma cada dato en un componente. La key le dice a React qué elemento es cuál cuando la lista cambia."
        >
          <svg viewBox="0 0 640 160" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="16" fontSize="11" letterSpacing="1.2" fill="var(--color-accent)">
              DATOS
            </text>
            {[0, 1, 2].map((i) => (
              <rect key={i} x="0" y={32 + i * 34} width="180" height="26" rx="5" fill="var(--color-text)" opacity="0.07" />
            ))}
            {['{ _id: 1, … }', '{ _id: 2, … }', '{ _id: 3, … }'].map((t, i) => (
              <text
                key={t}
                x="14"
                y={49 + i * 34}
                fontSize="12"
                fontFamily="ui-monospace, monospace"
                fill="var(--color-text)"
                opacity="0.8"
              >
                {t}
              </text>
            ))}
            <line x1="196" y1="80" x2="270" y2="80" stroke="var(--color-accent)" strokeWidth="1.2" />
            <path d="M277 80 l-8 -4.5 l0 9 z" fill="var(--color-accent)" />
            <text x="204" y="70" fontSize="12" fill="var(--color-accent)" fontFamily="ui-monospace, monospace">
              .map()
            </text>
            <text x="300" y="16" fontSize="11" letterSpacing="1.2" fill="var(--color-accent)">
              INTERFAZ
            </text>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x="300" y={32 + i * 34} width="320" height="26" rx="5" fill="var(--color-accent)" opacity="0.14" />
                <text
                  x="314"
                  y={49 + i * 34}
                  fontSize="12"
                  fontFamily="ui-monospace, monospace"
                  fill="var(--color-text)"
                  opacity="0.85"
                >
                  {`<TarjetaProducto key={${i + 1}} … />`}
                </text>
              </g>
            ))}
          </svg>
        </Figure>

        <Callout tipo="ojo">
          La <code>key</code> tiene que ser un id estable, no la posición del array. Con el índice
          como key, borrar el primer elemento hace que React confunda los demás: los estados y los
          campos de texto se quedan en el elemento equivocado.
        </Callout>
      </Lesson>

      <Lesson title="6. Arma tu primer componente, paso a paso">
        <Steps>
          <Step title="Crea el proyecto">
            <Terminal lineas={['$ npm create vite@latest mi-tienda -- --template react', '$ cd mi-tienda', '$ npm install', '$ npm run dev']} />
          </Step>
          <Step title="Un archivo por componente">
            <code>src/componentes/TarjetaProducto.jsx</code>. Nombre en mayúscula, export al final.
          </Step>
          <Step title="Recibe props y devuelve JSX">
            Desestructura en los parámetros: <code>{'function Tarjeta({ nombre, precio })'}</code>.
          </Step>
          <Step title="Úsalo desde App con datos de prueba">
            Un array de tres productos y un <code>map</code> con su <code>key</code>.
          </Step>
          <Step title="Agrega estado cuando algo tenga que cambiar">
            Un contador de carrito, un filtro, un campo de búsqueda. Si el valor nunca cambia, no
            necesita estado: es una prop o una constante.
          </Step>
        </Steps>
      </Lesson>

      <Exercises>
        <Quiz
          id="que-es-componente"
          index={1}
          title="¿Qué es un componente?"
          options={[
            { id: 'a', label: 'Una función que devuelve la interfaz que se va a ver' },
            { id: 'b', label: 'Un archivo HTML' },
            { id: 'c', label: 'Una clase de CSS' },
            { id: 'd', label: 'Una tabla de la base de datos' },
          ]}
          answer="a"
          explanation="Una función que recibe datos y devuelve JSX. Se usa como una etiqueta más, y se puede reutilizar todas las veces que quieras."
        />

        <Quiz
          id="mayuscula"
          index={2}
          title="El nombre en mayúscula"
          prompt="¿Por qué los componentes se llaman TarjetaProducto y no tarjetaProducto?"
          options={[
            { id: 'a', label: 'Porque así React distingue tu componente de una etiqueta HTML normal' },
            { id: 'b', label: 'Por costumbre nada más' },
            { id: 'c', label: 'Porque JavaScript lo exige' },
            { id: 'd', label: 'Para que aparezca primero en el archivo' },
          ]}
          answer="a"
          explanation="Con minúscula, React asume que es una etiqueta HTML y busca <tarjetaproducto>, que no existe. La mayúscula no es estilo: es sintaxis."
        />

        <FillBlank
          id="className"
          index={3}
          title="La clase en JSX"
          code={'<article ___="tarjeta">'}
          options={['className', 'class', 'clase', 'styleClass']}
          answer="className"
          explanation="class es una palabra reservada de JavaScript, y JSX es JavaScript. Por eso className — y por lo mismo, htmlFor en vez de for."
        />

        <TrueFalse
          id="jsx-es-html"
          index={4}
          title="JSX y HTML"
          statement="JSX es exactamente HTML metido dentro de JavaScript."
          answer={false}
          explanation="Falso. Se parece, pero es JavaScript: se compila a llamadas de función. De ahí las diferencias (className, htmlFor) y la posibilidad de meter expresiones entre llaves."
        />

        <FillBlank
          id="interpolar"
          index={5}
          title="Mostrar un dato"
          prompt="Quieres mostrar el valor de la variable nombre."
          code={'<h3>___</h3>'}
          options={['{nombre}', '${nombre}', 'nombre', '{{nombre}}']}
          answer="{nombre}"
          explanation="Una sola llave. Dentro de las llaves puedes poner cualquier expresión de JavaScript: una variable, una cuenta, una llamada a función."
        />

        <Quiz
          id="props-que-son"
          index={6}
          title="¿Qué son las props?"
          options={[
            { id: 'a', label: 'Los datos que el componente padre le pasa al hijo' },
            { id: 'b', label: 'Las variables internas del componente' },
            { id: 'c', label: 'Los estilos del componente' },
            { id: 'd', label: 'Las funciones del componente' },
          ]}
          answer="a"
          explanation="Los parámetros del componente. Entran desde afuera y el hijo las lee, nunca las cambia."
        />

        <TrueFalse
          id="props-inmutables"
          index={7}
          title="Modificar una prop"
          statement="Un componente puede modificar las props que recibe."
          answer={false}
          explanation="Falso. Las props son de solo lectura: si el hijo pudiera cambiarlas, el padre dejaría de saber cuál es la verdad. Si algo debe cambiar, es estado del padre."
        />

        <Quiz
          id="cuando-estado"
          index={8}
          title="¿Estado o variable normal?"
          prompt="La cantidad de productos en el carrito, que cambia cuando el usuario agrega uno."
          options={[
            { id: 'a', label: 'Estado con useState, porque cambia y la pantalla debe reflejarlo' },
            { id: 'b', label: 'Una variable normal con let' },
            { id: 'c', label: 'Una constante' },
            { id: 'd', label: 'Una prop' },
          ]}
          answer="a"
          explanation="Una variable normal se pierde en cada render y no avisa a React. El estado sobrevive y dispara el redibujado."
        />

        <FillBlank
          id="usestate"
          index={9}
          title="Declara el estado"
          code={'const [cantidad, setCantidad] = ___(0);'}
          options={['useState', 'useEffect', 'setState', 'state']}
          answer="useState"
          explanation="useState devuelve un par: el valor actual y la función para cambiarlo. El argumento es el valor inicial."
        />

        <Quiz
          id="asignar-directo"
          index={10}
          title="Cambiar el estado a la brava"
          prompt="Escribes cantidad = 5 en vez de setCantidad(5). ¿Qué pasa?"
          options={[
            { id: 'a', label: 'React no se entera y la pantalla no se actualiza' },
            { id: 'b', label: 'Funciona igual' },
            { id: 'c', label: 'Se borra el estado' },
            { id: 'd', label: 'Lanza un error de sintaxis siempre' },
          ]}
          answer="a"
          explanation="La función set es la que avisa a React de que hay que redibujar. Asignar directo cambia una variable que se va a perder en el siguiente render."
        />

        <Quiz
          id="mutar-array"
          index={11}
          title="Agregar a una lista en estado"
          prompt="Tienes const [tareas, setTareas] = useState([]). ¿Cómo agregas una?"
          options={[
            { id: 'a', label: 'setTareas([...tareas, nueva])' },
            { id: 'b', label: 'tareas.push(nueva)' },
            { id: 'c', label: 'tareas = [...tareas, nueva]' },
            { id: 'd', label: 'setTareas(tareas.push(nueva))' },
          ]}
          answer="a"
          explanation="Se crea un array nuevo con los anteriores más el nuevo. push modifica el mismo array: React lo ve igual y no redibuja. Y push devuelve un número, no la lista."
        />

        <FillBlank
          id="map-lista"
          index={12}
          title="Pinta la lista"
          code={'{productos.___((p) => (\n  <Tarjeta key={p._id} nombre={p.nombre} />\n))}'}
          options={['map', 'forEach', 'filter', 'find']}
          answer="map"
          explanation="map transforma cada dato en un componente y devuelve el array resultante. forEach no devuelve nada, así que no pinta nada."
        />

        <Quiz
          id="key-indice"
          index={13}
          title="La key de la lista"
          prompt="¿Por qué no usar el índice del array como key?"
          options={[
            { id: 'a', label: 'Porque al borrar o reordenar, React confunde los elementos y el estado se queda en el equivocado' },
            { id: 'b', label: 'Porque el índice es lento' },
            { id: 'c', label: 'Porque los índices empiezan en 0' },
            { id: 'd', label: 'No hay problema, es lo recomendado' },
          ]}
          answer="a"
          explanation="La key identifica al elemento entre renders. Si borras el primero, todos los índices se corren y React cree que los datos cambiaron de lugar."
        />

        <PredictOutput
          id="render-count"
          index={14}
          title="¿Cuántas veces se dibuja?"
          prompt="El componente se monta y después haces clic tres veces en un botón que llama a setCantidad. ¿Cuántas veces se ejecutó la función del componente en total? (número)"
          code={'const [cantidad, setCantidad] = useState(0);'}
          answers={['4']}
          explanation="4: el render inicial más uno por cada cambio de estado. Cada llamada a set dispara un render nuevo — por eso la demo de arriba muestra el contador subiendo."
        />

        <MatchPairs
          id="empareja-react"
          index={15}
          title="Empareja el concepto"
          pairs={[
            { id: 'comp', izquierda: 'Componente', derecha: 'Función que devuelve interfaz' },
            { id: 'props', izquierda: 'Props', derecha: 'Datos que entran desde el padre' },
            { id: 'estado', izquierda: 'Estado', derecha: 'Datos que el componente recuerda y puede cambiar' },
            { id: 'jsx', izquierda: 'JSX', derecha: 'La sintaxis parecida a HTML dentro de JavaScript' },
            { id: 'key', izquierda: 'key', derecha: 'Identifica cada elemento de una lista' },
          ]}
          explanation="Con estos cinco conceptos ya puedes construir una interfaz completa. Los hooks de la próxima sesión se montan encima."
        />

        <MultiSelect
          id="reglas-jsx"
          index={16}
          title="Reglas de JSX"
          prompt="Marca las que son ciertas."
          options={[
            { id: 'raiz', label: 'Debe devolver un solo elemento raíz (o un fragmento <>…</>)' },
            { id: 'cierra', label: 'Las etiquetas sin contenido se cierran solas: <img />' },
            { id: 'llaves', label: 'Las expresiones de JavaScript van entre llaves' },
            { id: 'class', label: 'Se escribe className en vez de class' },
            { id: 'mayus', label: 'Las etiquetas HTML normales van en mayúscula' },
          ]}
          answers={['raiz', 'cierra', 'llaves', 'class']}
          explanation="Las etiquetas HTML van en minúscula; la mayúscula queda reservada para tus componentes. Esa distinción es la que usa React para saber cuál es cuál."
        />

        <Quiz
          id="evento-onclick"
          index={17}
          title="Manejar un clic"
          prompt="¿Cuál está bien escrito?"
          options={[
            { id: 'a', label: '<button onClick={() => setCantidad(cantidad + 1)}>' },
            { id: 'b', label: '<button onclick="setCantidad(cantidad + 1)">' },
            { id: 'c', label: '<button onClick={setCantidad(cantidad + 1)}>' },
            { id: 'd', label: '<button addEventListener="click">' },
          ]}
          answer="a"
          explanation="onClick en camelCase y una función. La opción C la ejecuta durante el render — bucle infinito. Se pasa la función, no su resultado."
        />

        <OrderSteps
          id="orden-componente"
          index={18}
          title="Ordena la creación de un componente"
          steps={[
            { id: 'archivo', text: 'Crear src/componentes/TarjetaProducto.jsx' },
            { id: 'funcion', text: 'Escribir la función con nombre en mayúscula' },
            { id: 'props', text: 'Desestructurar las props en los parámetros' },
            { id: 'jsx', text: 'Devolver el JSX con los datos entre llaves' },
            { id: 'export', text: 'Exportarlo' },
            { id: 'usar', text: 'Importarlo en App y usarlo dentro de un map' },
          ]}
          explanation="Un archivo por componente. Cuando la app crezca, encontrar la tarjeta va a ser cuestión de un vistazo a la carpeta."
        />

        <TrueFalse
          id="react-dom"
          index={19}
          title="React y el DOM"
          statement="Con React sigues usando document.querySelector para cambiar la pantalla."
          answer={false}
          explanation="Falso, y es el cambio mental más grande de esta sesión. Tú cambias el estado; React se encarga del DOM. Mezclar los dos enfoques produce bugs muy raros."
        />

        <MultiSelect
          id="checklist-react"
          index={20}
          title="Antes de dar por hecho el componente"
          options={[
            { id: 'nombre', label: 'El nombre empieza en mayúscula' },
            { id: 'key', label: 'Si va en una lista, tiene una key estable' },
            { id: 'props', label: 'No modifica las props que recibe' },
            { id: 'set', label: 'Todo cambio de estado pasa por la función set' },
            { id: 'query', label: 'Usa querySelector para actualizar el texto' },
          ]}
          answers={['nombre', 'key', 'props', 'set']}
          explanation="Los cuatro primeros. El querySelector es justo lo que React viene a reemplazar."
        />
      </Exercises>
    </TopicPage>
  );
}
