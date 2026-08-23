import { Exercises, Lesson, TopicPage } from '../../components/TopicPage';
import {
  FillBlank,
  MatchPairs,
  MultiSelect,
  OrderSteps,
  Quiz,
  TrueFalse,
} from '../../components/exercises';
import { Callout, Compare, Figure, RefTable, Step, Steps, Terminal } from '../../components/visuals';

const SLUG = 'react-hooks';

/** Sesión 17 del cronograma — useState y useEffect. */
export default function ReactHooks() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Qué es un hook">
        <p>
          Un hook es una función que le engancha capacidades a tu componente: recordar valores,
          hablar con el mundo exterior, guardar referencias. Todos empiezan por <code>use</code>, y
          hoy vas a dominar los dos que resuelven el 90% de los casos.
        </p>
        <RefTable
          cabeceras={['Hook', 'Para qué']}
          filas={[
            [<code key="a">useState</code>, 'Recordar un valor que cambia y redibujar cuando cambie'],
            [<code key="b">useEffect</code>, 'Hacer algo fuera de React: pedir datos, suscribirse, poner un temporizador'],
          ]}
        />
        <Callout tipo="ojo">
          Las dos reglas de los hooks: se llaman <strong>siempre en el mismo orden</strong>, en el
          nivel superior del componente. Nunca dentro de un <code>if</code>, de un bucle ni de otra
          función. React los identifica por su posición, no por su nombre.
        </Callout>
      </Lesson>

      <Lesson title="2. useState a fondo">
        <Terminal
          lineas={[
            'const [tareas, setTareas] = useState([]);',
            'const [cargando, setCargando] = useState(true);',
            'const [error, setError] = useState(null);',
          ]}
        />
        <p>
          Fíjate en el patrón: casi cualquier pantalla que traiga datos necesita esos tres estados —
          los datos, si está cargando, y si algo falló. Es la base de una interfaz que no deja al
          usuario mirando una pantalla en blanco.
        </p>
        <Compare
          bien={{
            titulo: 'Actualizar con función',
            items: [
              <code key="1">setCantidad((c) =&gt; c + 1)</code>,
              'Usa siempre el valor más reciente',
              'Necesario si actualizas varias veces seguidas',
              'La opción segura por defecto',
            ],
          }}
          mal={{
            titulo: 'Actualizar con el valor',
            items: [
              <code key="2">setCantidad(cantidad + 1)</code>,
              'Usa el valor que había en ese render',
              'Tres llamadas seguidas suman 1, no 3',
              'Funciona, pero se rompe en los casos raros',
            ],
          }}
        />
      </Lesson>

      <Lesson title="3. useEffect: hablar con el exterior">
        <p>
          Todo lo que no sea «calcular la interfaz a partir de los datos» es un efecto: pedirle algo
          a una API, poner un temporizador, escuchar el teclado. Eso va en{' '}
          <code>useEffect</code>.
        </p>
        <Terminal
          lineas={[
            "import { useState, useEffect } from 'react';",
            '',
            'function ListaProductos() {',
            '  const [productos, setProductos] = useState([]);',
            '  const [cargando, setCargando] = useState(true);',
            '',
            '  useEffect(() => {',
            '    async function traer() {',
            '      try {',
            "        const res = await fetch('/api/productos');",
            '        setProductos(await res.json());',
            '      } finally {',
            '        setCargando(false);',
            '      }',
            '    }',
            '    traer();',
            '  }, []);   // ← el array de dependencias',
            '',
            '  if (cargando) return <p>Cargando…</p>;',
            '  return <ul>{productos.map(p => <li key={p._id}>{p.nombre}</li>)}</ul>;',
            '}',
          ]}
        />

        <Figure
          label="Diagrama: el array de dependencias de useEffect"
          caption="El array decide cuándo se vuelve a ejecutar el efecto. Es la parte que más confusión causa y la que hay que mirar primero cuando algo va mal."
        >
          <svg viewBox="0 0 640 170" xmlns="http://www.w3.org/2000/svg">
            {[
              { c: '[]', d: 'Una sola vez, cuando el componente aparece', y: 0 },
              { c: '[busqueda]', d: 'Cada vez que cambia esa variable', y: 52 },
              { c: 'sin array', d: 'En CADA render — casi siempre un error', y: 104 },
            ].map(({ c, d, y }) => (
              <g key={c}>
                <rect x="0" y={y} width="180" height="40" rx="6" fill="var(--color-accent)" opacity="0.16" />
                <text
                  x="16"
                  y={y + 25}
                  fontSize="14"
                  fontFamily="ui-monospace, monospace"
                  fill="var(--color-accent-text)"
                >
                  {c}
                </text>
                <text x="204" y={y + 25} fontSize="13.5" fill="var(--color-text)" opacity="0.75">
                  {d}
                </text>
              </g>
            ))}
          </svg>
        </Figure>

        <Callout tipo="ojo">
          El bucle infinito clásico: un <code>useEffect</code> sin array que llama a un{' '}
          <code>setState</code>. El estado cambia, se redibuja, el efecto vuelve a correr, el estado
          cambia… hasta que el navegador se congela. Si tu página se traba, mira ahí primero.
        </Callout>
      </Lesson>

      <Lesson title="4. La limpieza del efecto">
        <p>
          Si el efecto deja algo encendido —un temporizador, un listener— hay que apagarlo cuando el
          componente desaparece. Para eso el efecto puede devolver una función.
        </p>
        <Terminal
          lineas={[
            'useEffect(() => {',
            '  const id = setInterval(() => setSegundos((s) => s + 1), 1000);',
            '',
            '  return () => clearInterval(id);   // limpieza',
            '}, []);',
          ]}
        />
        <Callout>
          Sin esa limpieza, cada vez que el componente se monta queda un temporizador más corriendo.
          Se acumulan, consumen recursos y provocan actualizaciones sobre componentes que ya no
          existen.
        </Callout>
      </Lesson>

      <Lesson title="5. Los tres estados de una pantalla con datos">
        <Steps>
          <Step title="Cargando">
            Mientras la petición viaja. Un texto o un esqueleto: cualquier cosa menos una pantalla
            en blanco.
          </Step>
          <Step title="Error">
            Si la petición falló. Un mensaje que diga qué pasó y, si se puede, un botón de
            reintentar.
          </Step>
          <Step title="Vacío">
            La petición salió bien pero no hay datos. «Todavía no tienes productos» es muy distinto
            de un error, y el usuario necesita saber cuál de los dos es.
          </Step>
          <Step title="Con datos">
            El caso feliz, que es el único que solemos programar de entrada.
          </Step>
        </Steps>
        <Callout>
          Programar solo el caso feliz es la diferencia más visible entre un ejercicio de clase y
          una aplicación de verdad. En la defensa del proyecto, los tres primeros estados se notan.
        </Callout>
      </Lesson>

      <Exercises>
        <Quiz
          id="que-es-hook"
          index={1}
          title="¿Qué es un hook?"
          options={[
            { id: 'a', label: 'Una función que le da capacidades extra a un componente, y su nombre empieza por use' },
            { id: 'b', label: 'Un componente especial' },
            { id: 'c', label: 'Una etiqueta de JSX' },
            { id: 'd', label: 'Un archivo de configuración' },
          ]}
          answer="a"
          explanation="useState, useEffect, useRef… todos empiezan por use, y esa convención permite que las herramientas verifiquen que los usas bien."
        />

        <TrueFalse
          id="hooks-en-if"
          index={2}
          title="Hooks dentro de un if"
          statement="Puedes llamar a useState dentro de un if si solo necesitas el estado en ciertos casos."
          answer={false}
          explanation="Falso. React identifica los hooks por el orden en que se llaman: si uno aparece a veces sí y a veces no, el orden cambia y los estados se cruzan. Siempre en el nivel superior."
        />

        <FillBlank
          id="import-hooks"
          index={3}
          title="Importa los hooks"
          code={"import { useState, ___ } from 'react';"}
          options={['useEffect', 'useFetch', 'useData', 'useAsync']}
          answer="useEffect"
          explanation="useState y useEffect vienen de react. useFetch y useAsync no existen en React: son hooks que a veces escribe uno mismo."
        />

        <Quiz
          id="para-que-effect"
          index={4}
          title="¿Para qué useEffect?"
          options={[
            { id: 'a', label: 'Para lo que pasa fuera de React: pedir datos, temporizadores, listeners' },
            { id: 'b', label: 'Para declarar estado' },
            { id: 'c', label: 'Para aplicar estilos' },
            { id: 'd', label: 'Para crear componentes' },
          ]}
          answer="a"
          explanation="Todo lo que no sea calcular la interfaz a partir de los datos. Si puedes calcularlo durante el render, no necesitas un efecto."
        />

        <MatchPairs
          id="empareja-deps"
          index={5}
          title="Empareja el array de dependencias"
          pairs={[
            { id: 'vacio', izquierda: <code>[]</code>, derecha: 'Una sola vez, al montar el componente' },
            { id: 'var', izquierda: <code>[busqueda]</code>, derecha: 'Cada vez que cambia esa variable' },
            { id: 'sin', izquierda: 'sin array', derecha: 'En cada render' },
            { id: 'return', izquierda: 'return () => {…}', derecha: 'La limpieza, al desmontar' },
          ]}
          explanation="El array es lo primero que hay que mirar cuando un efecto corre de más o de menos."
        />

        <Quiz
          id="bucle-infinito"
          index={6}
          title="La página se congela"
          prompt="Tienes un useEffect sin array de dependencias que llama a setProductos. ¿Qué pasa?"
          options={[
            { id: 'a', label: 'Bucle infinito: el estado cambia, se redibuja, el efecto corre otra vez' },
            { id: 'b', label: 'Se ejecuta una sola vez' },
            { id: 'c', label: 'React lo detecta y lo detiene' },
            { id: 'd', label: 'No se ejecuta nunca' },
          ]}
          answer="a"
          explanation="Sin array, el efecto corre en cada render; si el efecto cambia el estado, provoca otro render. El navegador se traba hasta que lo cierras."
        />

        <FillBlank
          id="deps-vacio"
          index={7}
          title="Pedir los datos una sola vez"
          code={'useEffect(() => {\n  traerProductos();\n}, ___);'}
          options={['[]', '[productos]', 'nada', '[traerProductos()]']}
          answer="[]"
          explanation="Array vacío: el efecto corre una vez, cuando el componente aparece. Es el caso más común para cargar datos iniciales."
        />

        <Quiz
          id="dependencia-busqueda"
          index={8}
          title="Buscar cuando cambia el texto"
          prompt="Quieres volver a consultar la API cada vez que cambie la variable busqueda."
          options={[
            { id: 'a', label: 'useEffect(() => { buscar(); }, [busqueda])' },
            { id: 'b', label: 'useEffect(() => { buscar(); }, [])' },
            { id: 'c', label: 'useEffect(() => { buscar(); })' },
            { id: 'd', label: 'useState(() => buscar())' },
          ]}
          answer="a"
          explanation="La variable va en el array: React compara su valor entre renders y vuelve a ejecutar el efecto solo si cambió."
        />

        <TrueFalse
          id="limpieza"
          index={9}
          title="La función de limpieza"
          statement="Lo que devuelve un useEffect se ejecuta cuando el componente se desmonta o antes de volver a correr el efecto."
          answer={true}
          explanation="Verdadero. Ahí se apagan temporizadores, se quitan listeners y se cancelan suscripciones. Sin eso, las cosas se acumulan."
        />

        <FillBlank
          id="clear-interval"
          index={10}
          title="Apaga el temporizador"
          code={'useEffect(() => {\n  const id = setInterval(tic, 1000);\n  return () => ___(id);\n}, []);'}
          options={['clearInterval', 'stopInterval', 'clearTimeout', 'removeInterval']}
          answer="clearInterval"
          explanation="clearInterval para setInterval, clearTimeout para setTimeout. Sin eso, cada montaje deja un temporizador vivo."
        />

        <MultiSelect
          id="estados-pantalla"
          index={11}
          title="Los estados de una pantalla con datos"
          prompt="Marca los estados que deberías contemplar."
          options={[
            { id: 'cargando', label: 'Cargando' },
            { id: 'error', label: 'Error' },
            { id: 'vacio', label: 'Sin resultados' },
            { id: 'datos', label: 'Con datos' },
            { id: 'imprimiendo', label: 'Imprimiendo' },
          ]}
          answers={['cargando', 'error', 'vacio', 'datos']}
          explanation="Los cuatro. El estado vacío es el que más se olvida, y confundirlo con un error deja al usuario pensando que la app está rota."
        />

        <Quiz
          id="vacio-vs-error"
          index={12}
          title="Vacío no es error"
          prompt="La API respondió bien pero devolvió una lista de cero elementos. ¿Qué muestras?"
          options={[
            { id: 'a', label: '«Todavía no tienes productos. Agrega el primero.»' },
            { id: 'b', label: '«Error al cargar los productos»' },
            { id: 'c', label: 'Una pantalla en blanco' },
            { id: 'd', label: 'El spinner de carga para siempre' },
          ]}
          answer="a"
          explanation="Vacío significa «todo funcionó, no hay nada todavía». Mostrar un error ahí confunde al usuario y hace que reporte fallas que no existen."
        />

        <Quiz
          id="async-en-effect"
          index={13}
          title="async dentro de useEffect"
          prompt="¿Por qué se declara una función async adentro en vez de poner async en el useEffect?"
          options={[
            { id: 'a', label: 'Porque el efecto debe devolver la función de limpieza, y una función async devuelve una promesa' },
            { id: 'b', label: 'Porque async no existe en React' },
            { id: 'c', label: 'Por costumbre' },
            { id: 'd', label: 'Para que corra más rápido' },
          ]}
          answer="a"
          explanation="React espera que el retorno sea una función de limpieza. Si le devuelves una promesa, no sabe qué hacer con ella."
        />

        <OrderSteps
          id="orden-fetch-effect"
          index={14}
          title="Ordena la carga de datos"
          steps={[
            { id: 'estados', text: 'Declarar los estados: datos, cargando, error' },
            { id: 'effect', text: 'Abrir el useEffect con array vacío' },
            { id: 'fetch', text: 'Pedir los datos con fetch dentro de una función async' },
            { id: 'set', text: 'Guardar el resultado con setDatos' },
            { id: 'cargando', text: 'Poner cargando en false, pase lo que pase' },
            { id: 'render', text: 'Devolver la interfaz según el estado' },
          ]}
          explanation="El «pase lo que pase» va en un finally: si falla la petición y no apagas el cargando, el usuario se queda con el spinner para siempre."
        />

        <Quiz
          id="set-funcional"
          index={15}
          title="Tres clics, ¿cuánto suma?"
          prompt="Un botón hace setCantidad(cantidad + 1) tres veces seguidas en el mismo manejador. ¿Cuánto sube?"
          options={[
            { id: 'a', label: '1, porque las tres leen el mismo valor de ese render' },
            { id: 'b', label: '3' },
            { id: 'c', label: '0' },
            { id: 'd', label: '6' },
          ]}
          answer="a"
          explanation="Las tres llamadas ven el mismo cantidad. Con la forma funcional —setCantidad(c => c + 1)— cada una recibe el valor más reciente y sí suma 3."
        />

        <FillBlank
          id="set-funcional-fill"
          index={16}
          title="La forma segura"
          code={'setCantidad((c) => ___);'}
          options={['c + 1', 'cantidad + 1', 'c', '1']}
          answer="c + 1"
          explanation="La función recibe el valor más reciente. Es la forma recomendada siempre que el nuevo valor dependa del anterior."
        />

        <TrueFalse
          id="effect-orden"
          index={17}
          title="Cuándo corre el efecto"
          statement="El código de un useEffect se ejecuta antes de que la interfaz aparezca en pantalla."
          answer={false}
          explanation="Falso: corre después del render. Por eso lo primero que ve el usuario es el estado inicial —normalmente «cargando»— y luego llegan los datos."
        />

        <MultiSelect
          id="cuando-no-effect"
          index={18}
          title="Cuándo NO necesitas useEffect"
          prompt="Marca lo que se resuelve sin efecto."
          options={[
            { id: 'calculo', label: 'Calcular el total del carrito a partir de los productos' },
            { id: 'filtro', label: 'Filtrar una lista según lo que escribió el usuario' },
            { id: 'formato', label: 'Formatear un precio para mostrarlo' },
            { id: 'fetch', label: 'Traer los productos de la API al abrir la página' },
          ]}
          answers={['calculo', 'filtro', 'formato']}
          explanation="Todo lo que se puede calcular durante el render se calcula durante el render. Meterlo en un efecto con un estado extra duplica la información y la desincroniza."
        />

        <Quiz
          id="hook-personalizado"
          index={19}
          title="Un hook propio"
          prompt="Repites la misma lógica de carga en cinco componentes. ¿Qué haces?"
          options={[
            { id: 'a', label: 'Extraerla a un hook propio, por ejemplo useProductos()' },
            { id: 'b', label: 'Copiar y pegar en los cinco' },
            { id: 'c', label: 'Meterlo todo en un solo componente gigante' },
            { id: 'd', label: 'Usar variables globales' },
          ]}
          answer="a"
          explanation="Un hook propio es una función que empieza por use y llama a otros hooks. Es la forma de reutilizar lógica, igual que un componente reutiliza interfaz."
        />

        <MultiSelect
          id="checklist-hooks"
          index={20}
          title="Checklist de hooks"
          options={[
            { id: 'top', label: 'Los hooks se llaman en el nivel superior, nunca dentro de un if' },
            { id: 'deps', label: 'Cada useEffect tiene su array de dependencias pensado' },
            { id: 'limpieza', label: 'Los efectos que dejan algo encendido devuelven su limpieza' },
            { id: 'estados', label: 'La pantalla contempla cargando, error y vacío' },
            { id: 'calculo', label: 'Los valores calculables se guardan en estado por si acaso' },
          ]}
          answers={['top', 'deps', 'limpieza', 'estados']}
          explanation="Guardar en estado algo que se puede calcular es duplicar la verdad: tarde o temprano las dos copias dejan de coincidir."
        />
      </Exercises>
    </TopicPage>
  );
}
