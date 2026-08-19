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
import { BoxModelDemo, FlexPlayground } from './Demos';

const SLUG = 'css-box-model-flexbox';

/** Sesión 6 del cronograma — CSS: box model, Flexbox, Grid y responsive. */
export default function CssBoxModelFlexbox() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Qué hace CSS y cómo se conecta">
        <p>
          HTML dice qué es cada cosa; CSS dice cómo se ve. Se escribe en un archivo aparte y se
          conecta desde el <code>&lt;head&gt;</code> con una línea:
        </p>
        <Terminal
          titulo="index.html — dentro del head"
          lineas={['<link rel="stylesheet" href="styles.css">']}
        />
        <p>Cada regla de CSS tiene tres partes:</p>
        <Figure
          label="Diagrama: selector, propiedad y valor"
          caption="El selector elige a quién le aplica. Dentro de las llaves van pares de propiedad y valor, cada uno terminado en punto y coma."
        >
          <svg viewBox="0 0 640 150" xmlns="http://www.w3.org/2000/svg">
            <text x="10" y="52" fontSize="22" fontFamily="ui-monospace, monospace" fill="var(--color-text)">
              .tarjeta &#123; color: white; &#125;
            </text>
            <line x1="40" y1="64" x2="40" y2="92" stroke="var(--color-accent)" strokeWidth="1" />
            <text x="14" y="110" fontSize="11" fill="var(--color-accent)">
              selector
            </text>
            <line x1="160" y1="64" x2="160" y2="112" stroke="var(--color-accent)" strokeWidth="1" />
            <text x="130" y="130" fontSize="11" fill="var(--color-accent)">
              propiedad
            </text>
            <line x1="250" y1="64" x2="250" y2="92" stroke="var(--color-accent)" strokeWidth="1" />
            <text x="232" y="110" fontSize="11" fill="var(--color-accent)">
              valor
            </text>
          </svg>
        </Figure>
      </Lesson>

      <Lesson title="2. Selectores: a quién le hablas">
        <RefTable
          cabeceras={['Selector', 'A quién aplica', 'Ejemplo']}
          filas={[
            ['Etiqueta', 'A todos los elementos de ese tipo', <code key="a">p &#123; … &#125;</code>],
            ['Clase (.)', 'A los que tengan esa clase — el que más vas a usar', <code key="b">.tarjeta &#123; … &#125;</code>],
            ['Id (#)', 'A un único elemento con ese id', <code key="c">#contacto &#123; … &#125;</code>],
            ['Descendiente', 'A los que estén dentro de otro', <code key="d">nav a &#123; … &#125;</code>],
            ['Estado', 'Cuando pasa algo: hover, focus', <code key="e">.btn:hover &#123; … &#125;</code>],
          ]}
        />
        <Callout>
          Si dos reglas chocan, gana la más específica: id vence a clase, y clase vence a etiqueta.
          Con igual especificidad, gana <strong>la última</strong> que aparezca en el archivo.
        </Callout>
      </Lesson>

      <Lesson title="3. El box model: todo es una caja">
        <p>
          Cada elemento de la página es una caja con cuatro capas: el{' '}
          <strong>contenido</strong>, el <strong>padding</strong> (relleno por dentro), el{' '}
          <strong>borde</strong>, y el <strong>margin</strong> (aire por fuera, entre esta caja y
          las demás). Es un producto dentro de su empaque.
        </p>
        <p>
          Mueve los controles y fíjate en la última línea: con <code>content-box</code> (el valor
          por defecto) el padding y el borde <em>se suman</em> al ancho que declaraste. Ese es el
          origen de la mitad de los enredos de layout.
        </p>

        <BoxModelDemo />

        <Callout tipo="ojo">
          Por eso la primera regla de casi todo archivo CSS es esta — hace que{' '}
          <code>width</code> signifique lo que uno espera:
          <Terminal lineas={['*, *::before, *::after { box-sizing: border-box; }']} />
        </Callout>
      </Lesson>

      <Lesson title="4. Variables CSS: tu marca en un solo lugar">
        <p>
          Define los colores y las tipografías de tu emprendimiento una sola vez en{' '}
          <code>:root</code> y úsalos con <code>var()</code>. Si mañana cambia el color de marca,
          editas una línea y cambia toda la página.
        </p>
        <Terminal
          titulo="styles.css"
          lineas={[
            ':root {',
            '  --color-principal: #2f6f4f;',
            '  --color-texto: #1c1c1c;',
            '  --fuente: "Inter", system-ui, sans-serif;',
            '  --radio: 10px;',
            '}',
            '',
            '.btn {',
            '  background: var(--color-principal);',
            '  border-radius: var(--radio);',
            '}',
          ]}
        />
        <Compare
          bien={{
            titulo: 'Con variables',
            items: [
              'El color de marca se cambia en un solo sitio',
              'Los nombres explican la intención',
              'Es lo mismo que usan los sistemas de diseño reales',
            ],
          }}
          mal={{
            titulo: 'Con el hex repetido',
            items: [
              'El mismo #2f6f4f pegado en 30 lugares',
              'Cambiar de color obliga a buscar y reemplazar',
              'Siempre se escapa uno y queda desparejo',
            ],
          }}
        />
      </Lesson>

      <Lesson title="5. Flexbox: acomodar en una fila (o una columna)">
        <p>
          Flexbox reparte elementos en <strong>una dirección</strong>. Es lo que usas para el
          header, el menú y una fila de tarjetas. Se activa con{' '}
          <code>display: flex</code> en el <em>contenedor</em>, no en los hijos.
        </p>
        <p>Dos propiedades hacen casi todo el trabajo, y confundirlas es lo normal al principio:</p>
        <RefTable
          cabeceras={['Propiedad', 'Qué eje controla']}
          filas={[
            [<code key="a">justify-content</code>, 'El eje principal (en fila: horizontal)'],
            [<code key="b">align-items</code>, 'El eje cruzado (en fila: vertical)'],
            [<code key="c">gap</code>, 'El espacio entre los elementos'],
            [<code key="d">flex-direction</code>, 'Cambia cuál es el eje principal: row o column'],
          ]}
        />
        <p>Pruébalo: cambia una propiedad y mira a dónde viajan las cajas.</p>

        <FlexPlayground />

        <Callout>
          Fíjate en algo importante: al poner <code>flex-direction: column</code>,{' '}
          <code>justify-content</code> pasa a controlar el eje vertical. Las propiedades no son
          «horizontal» y «vertical»: son «principal» y «cruzado».
        </Callout>
      </Lesson>

      <Lesson title="6. Grid: acomodar en dos dimensiones">
        <p>
          Cuando necesitas filas <em>y</em> columnas — un catálogo de productos — Grid es la
          herramienta. Una sola línea arma una cuadrícula que se adapta sola:
        </p>
        <Terminal
          lineas={[
            '.catalogo {',
            '  display: grid;',
            '  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));',
            '  gap: 20px;',
            '}',
          ]}
        />
        <p>
          Eso se lee así: «haz tantas columnas como quepan, cada una de mínimo 280px y que se
          repartan el sobrante por igual». En un celular quedan una debajo de otra; en un monitor,
          cuatro por fila. Sin una sola media query.
        </p>
      </Lesson>

      <Lesson title="7. Responsive: primero el celular">
        <p>
          La mayoría de tus visitantes entran desde el teléfono. La estrategia{' '}
          <em>mobile-first</em> es escribir el CSS base para pantalla pequeña y agregar reglas para
          pantallas grandes:
        </p>
        <Terminal
          lineas={[
            '/* base: celular */',
            '.hero { font-size: 28px; }',
            '',
            '/* de tablet hacia arriba */',
            '@media (min-width: 768px) {',
            '  .hero { font-size: 44px; }',
            '}',
          ]}
        />
        <Callout tipo="ojo">
          Si tus media queries «no hacen nada» en el celular, casi siempre falta esta línea en el{' '}
          <code>head</code>:
          <Terminal lineas={['<meta name="viewport" content="width=device-width, initial-scale=1.0">']} />
        </Callout>
      </Lesson>

      <Lesson title="8. El proceso completo, paso a paso">
        <Steps>
          <Step title="Crea styles.css y vincúlalo">
            Dentro de <code>frontend/</code>, y el <code>&lt;link&gt;</code> en el head del
            index.html.
          </Step>
          <Step title="Reset y variables">
            <code>box-sizing: border-box</code> universal, y tus colores y tipografías en{' '}
            <code>:root</code>.
          </Step>
          <Step title="Header con Flexbox">
            <code>display: flex</code>, <code>justify-content: space-between</code>,{' '}
            <code>align-items: center</code>: logo a la izquierda, menú a la derecha.
          </Step>
          <Step title="Hero">
            Texto centrado y tamaño fluido con <code>clamp(28px, 5vw, 56px)</code>: crece con la
            pantalla sin pasarse.
          </Step>
          <Step title="Catálogo con Grid">
            <code>repeat(auto-fill, minmax(280px, 1fr))</code> y <code>gap</code>.
          </Step>
          <Step title="Responsive y revisión">
            Media queries mobile-first, y revisa con el modo dispositivo de DevTools (F12).
          </Step>
          <Step title="Sube el trabajo">
            <Terminal
              lineas={['$ git add .', '$ git commit -m "feat: agrego los estilos de la marca"', '$ git push']}
            />
          </Step>
        </Steps>
      </Lesson>

      <Exercises>
        <Quiz
          id="css-no-aplica"
          index={1}
          title="El CSS no se aplica"
          prompt="Escribiste todo el styles.css pero la página sigue en blanco y negro. ¿Qué revisas primero?"
          options={[
            { id: 'link', label: 'Que el <link rel="stylesheet" href="styles.css"> esté en el head y la ruta sea correcta' },
            { id: 'reinicio', label: 'Reiniciar el computador' },
            { id: 'nombre', label: 'Cambiarle el nombre al archivo a estilos.css' },
            { id: 'nada', label: 'Volver a escribir todo el CSS' },
          ]}
          answer="link"
          explanation="Casi siempre es el link: mal escrito o con la ruta equivocada. La pestaña Network de DevTools te dice si el archivo cargó o dio 404."
        />

        <MatchPairs
          id="empareja-selectores"
          index={2}
          title="Empareja el selector con lo que selecciona"
          pairs={[
            { id: 'clase', izquierda: <code>.tarjeta</code>, derecha: 'Todos los elementos con class="tarjeta"' },
            { id: 'id', izquierda: <code>#contacto</code>, derecha: 'El único elemento con id="contacto"' },
            { id: 'etiqueta', izquierda: <code>p</code>, derecha: 'Todos los párrafos de la página' },
            { id: 'desc', izquierda: <code>nav a</code>, derecha: 'Los enlaces que están dentro del nav' },
            { id: 'hover', izquierda: <code>.btn:hover</code>, derecha: 'El botón mientras el mouse está encima' },
          ]}
          explanation="El punto es clase, la almohadilla es id, y el espacio significa «dentro de». Con esos cinco cubres casi todo el curso."
        />

        <Quiz
          id="cual-gana"
          index={3}
          title="¿Cuál regla gana?"
          prompt="El párrafo tiene class='destacado' e id='intro'. ¿De qué color queda?"
          code={'p { color: gris; }\n.destacado { color: azul; }\n#intro { color: verde; }'}
          numbered
          options={[
            { id: 'gris', label: 'Gris, porque es una etiqueta' },
            { id: 'azul', label: 'Azul, porque la clase es más común' },
            { id: 'verde', label: 'Verde, porque el id es el más específico' },
            { id: 'ultima', label: 'Verde, pero solo porque está de última' },
          ]}
          answer="verde"
          explanation="Gana el id: es el selector más específico. El orden solo decide cuando la especificidad es igual."
        />

        <TrueFalse
          id="padding-vs-margin"
          index={4}
          title="Padding y margin"
          statement="El padding es el espacio por dentro de la caja y el margin el espacio por fuera."
          answer={true}
          explanation="Verdadero. Padding empuja el contenido lejos del borde; margin separa esta caja de las vecinas. Si el fondo se ve en ese espacio, es padding."
        />

        <Quiz
          id="ancho-total"
          index={5}
          title="¿Cuánto mide en realidad?"
          prompt="Una caja con width: 200px, padding: 20px y border: 5px, sin box-sizing. ¿Cuál es su ancho real?"
          options={[
            { id: '200', label: '200px' },
            { id: '250', label: '250px' },
            { id: '245', label: '245px' },
            { id: '225', label: '225px' },
          ]}
          answer="250"
          explanation="250px: 200 de contenido + 20 de padding a cada lado + 5 de borde a cada lado. Con box-sizing: border-box serían 200px exactos y el contenido se encogería."
          hint="El padding y el borde cuentan dos veces: izquierda y derecha."
        />

        <FillBlank
          id="border-box"
          index={6}
          title="El reset que evita dolores de cabeza"
          prompt="Para que width signifique el ancho total de la caja."
          code={'*, *::before, *::after {\n  ___: border-box;\n}'}
          options={['box-sizing', 'display', 'position', 'overflow']}
          answer="box-sizing"
          explanation="box-sizing: border-box hace que el padding y el borde queden DENTRO del ancho declarado. Es la primera línea de casi cualquier hoja de estilos profesional."
        />

        <FillBlank
          id="variable-css"
          index={7}
          title="Usa tu variable de marca"
          prompt="Ya definiste --color-principal en :root."
          code={'.btn {\n  background: ___(--color-principal);\n}'}
          options={['var', 'root', 'calc', 'use']}
          answer="var"
          explanation="var(--nombre) lee el valor de la variable. Si mañana cambias el color en :root, cambian todos los botones a la vez."
        />

        <TrueFalse
          id="display-flex-donde"
          index={8}
          title="¿Dónde va display: flex?"
          statement="display: flex se le pone a las tarjetas que quieres alinear."
          answer={false}
          explanation="Falso. Va en el contenedor que las envuelve: flex organiza a los hijos. Ponérselo a los hijos es el error número uno con Flexbox."
        />

        <Quiz
          id="justify-vs-align"
          index={9}
          title="justify-content contra align-items"
          prompt="Tienes display: flex con dirección de fila. Quieres centrar las tarjetas verticalmente. ¿Cuál usas?"
          options={[
            { id: 'justify', label: 'justify-content: center' },
            { id: 'align', label: 'align-items: center' },
            { id: 'text', label: 'text-align: center' },
            { id: 'margin', label: 'margin: auto en cada tarjeta' },
          ]}
          answer="align"
          explanation="En una fila, el eje principal es el horizontal (justify-content) y el cruzado es el vertical (align-items). Vertical en fila = align-items."
          hint="Vuelve al playground y prueba las dos con flex-direction: row."
        />

        <Quiz
          id="column-cambia-ejes"
          index={10}
          title="Cambiar la dirección cambia los ejes"
          prompt="Con flex-direction: column, ¿qué controla justify-content?"
          options={[
            { id: 'h', label: 'Sigue controlando el horizontal' },
            { id: 'v', label: 'Pasa a controlar el vertical' },
            { id: 'nada', label: 'Deja de funcionar' },
            { id: 'ambos', label: 'Controla los dos ejes a la vez' },
          ]}
          answer="v"
          explanation="justify-content siempre manda en el eje principal, y en column el eje principal es el vertical. Por eso los nombres no son «horizontal» y «vertical»."
        />

        <Quiz
          id="space-between"
          index={11}
          title="Logo a la izquierda, menú a la derecha"
          prompt="En el header quieres el logo pegado a un extremo y el menú al otro."
          options={[
            { id: 'sb', label: 'justify-content: space-between' },
            { id: 'center', label: 'justify-content: center' },
            { id: 'around', label: 'justify-content: space-around' },
            { id: 'end', label: 'justify-content: flex-end' },
          ]}
          answer="sb"
          explanation="space-between pega el primero al inicio, el último al final, y reparte el sobrante en medio. Es la receta del header de casi cualquier sitio."
        />

        <TrueFalse
          id="grid-en-hijos"
          index={12}
          title="Grid no arma columnas"
          statement="Si pusiste display: grid en las tarjetas y no en el contenedor, la cuadrícula no se forma."
          answer={true}
          explanation="Verdadero, y es el mismo error que con Flexbox: display: grid va en el padre. Los hijos se acomodan solos en las celdas."
        />

        <FillBlank
          id="grid-catalogo"
          index={13}
          title="El catálogo que se adapta solo"
          prompt="Columnas de mínimo 280px, tantas como quepan, repartiendo el sobrante."
          code={'.catalogo {\n  display: grid;\n  grid-template-columns: repeat(___, minmax(280px, 1fr));\n  gap: 20px;\n}'}
          options={['auto-fill', '3', 'auto', '1fr']}
          answer="auto-fill"
          explanation="auto-fill calcula cuántas columnas caben según el ancho disponible. Con un número fijo, en el celular quedarían tres columnas aplastadas."
        />

        <Quiz
          id="flex-o-grid"
          index={14}
          title="¿Flexbox o Grid?"
          prompt="Vas a armar el catálogo de productos: filas y columnas que se reacomodan."
          options={[
            { id: 'flex', label: 'Flexbox, porque es más nuevo' },
            { id: 'grid', label: 'Grid, porque es un layout de dos dimensiones' },
            { id: 'float', label: 'float, como se hacía antes' },
            { id: 'table', label: 'Una tabla HTML' },
          ]}
          answer="grid"
          explanation="Grid para dos dimensiones (catálogos, galerías); Flexbox para una (headers, menús, filas de botones). Las tablas son para datos tabulares, no para maquetar."
        />

        <Quiz
          id="mobile-first"
          index={15}
          title="Mobile-first"
          prompt="¿Qué significa escribir CSS mobile-first?"
          options={[
            { id: 'a', label: 'Hacer una página distinta para celular' },
            { id: 'b', label: 'Escribir el estilo base para pantalla pequeña y agregar reglas con min-width para pantallas grandes' },
            { id: 'c', label: 'Usar solo Tailwind' },
            { id: 'd', label: 'Probar únicamente en el celular' },
          ]}
          answer="b"
          explanation="Una sola página. El CSS base sirve para el celular —el caso más restringido— y las media queries van sumando espacio cuando hay pantalla de sobra."
        />

        <Quiz
          id="viewport-falta"
          index={16}
          title="Se ve bien en el navegador pero mal en el celular"
          prompt="En DevTools tu diseño responsive funciona, pero en el teléfono real se ve diminuto. ¿Qué falta?"
          options={[
            { id: 'meta', label: 'El <meta name="viewport"> en el head' },
            { id: 'media', label: 'Más media queries' },
            { id: 'flex', label: 'Cambiar Grid por Flexbox' },
            { id: 'zoom', label: 'Una propiedad zoom en el CSS' },
          ]}
          answer="meta"
          explanation="Sin el meta viewport el teléfono finge tener 980px de ancho y encoge todo. Es una línea en el head y arregla el 90% de los «no me funciona el responsive»."
        />

        <MultiSelect
          id="errores-css"
          index={17}
          title="Errores típicos de la sesión"
          prompt="Marca los que son problemas reales de CSS."
          options={[
            { id: 'sizing', label: 'El padding agranda la caja porque falta box-sizing: border-box' },
            { id: 'ejes', label: 'Se confundió justify-content con align-items' },
            { id: 'padre', label: 'display: grid quedó en el hijo y no en el contenedor' },
            { id: 'viewport', label: 'Falta el meta viewport y las media queries no responden' },
            { id: 'mayus', label: 'Las propiedades CSS deben ir en mayúsculas' },
          ]}
          answers={['sizing', 'ejes', 'padre', 'viewport']}
          explanation="Los cuatro primeros son los clásicos. CSS se escribe en minúsculas y no distingue mayúsculas en las propiedades: eso no rompe nada."
        />

        <TrueFalse
          id="tailwind-que-es"
          index={18}
          title="Tailwind"
          statement="Tailwind reemplaza a CSS: es un lenguaje distinto."
          answer={false}
          explanation="Falso. Tailwind es CSS empaquetado en clases ya hechas: p-4 es padding, flex es display:flex. Si entiendes CSS entiendes Tailwind; al revés no funciona."
        />

        <OrderSteps
          id="orden-css"
          index={19}
          title="Ordena el trabajo de la sesión"
          steps={[
            { id: 'crear', text: 'Crear styles.css y vincularlo desde el head' },
            { id: 'reset', text: 'Reset con box-sizing y variables de marca en :root' },
            { id: 'header', text: 'Maquetar el header con Flexbox' },
            { id: 'catalogo', text: 'Armar el catálogo con Grid' },
            { id: 'responsive', text: 'Ajustar con media queries mobile-first' },
            { id: 'push', text: 'Revisar en DevTools y hacer push' },
          ]}
          explanation="Primero la base (reset y variables), después los bloques grandes, y el responsive al final. Al revés se hace el doble de trabajo."
        />

        <Quiz
          id="clamp"
          index={20}
          title="Tamaño de letra fluido"
          prompt="¿Qué hace font-size: clamp(28px, 5vw, 56px)?"
          options={[
            { id: 'a', label: 'Siempre 28px' },
            { id: 'b', label: 'Crece con el ancho de la pantalla, pero nunca baja de 28px ni pasa de 56px' },
            { id: 'c', label: 'Alterna entre los tres valores' },
            { id: 'd', label: 'Solo funciona en celular' },
          ]}
          answer="b"
          explanation="Mínimo, valor preferido y máximo. Es la forma moderna de tener un título que se adapta sin escribir tres media queries."
        />
      </Exercises>
    </TopicPage>
  );
}
