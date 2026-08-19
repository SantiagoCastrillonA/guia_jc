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

const SLUG = 'html-semantico';

/** Sesión 5 del cronograma — HTML semántico: estructura profesional. */
export default function HtmlSemantico() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Qué es HTML">
        <p>
          HTML es el esqueleto de una página: dice <em>qué</em> es cada cosa. No dice de qué color
          va ni dónde se coloca — de eso se encarga CSS en la próxima sesión. Aquí solo declaras:
          esto es un título, esto es un párrafo, esto es una imagen.
        </p>
        <p>
          Se escribe con <strong>etiquetas</strong>. Casi todas van en pareja: una abre y otra
          cierra, y lo que va en medio es el contenido.
        </p>

        <Figure
          label="Diagrama: anatomía de una etiqueta HTML"
          caption="La etiqueta de apertura puede llevar atributos (datos extra). La de cierre lleva una barra y nada más."
        >
          <svg viewBox="0 0 640 170" xmlns="http://www.w3.org/2000/svg">
            <text
              x="20"
              y="70"
              fontSize="26"
              fontFamily="ui-monospace, monospace"
              fill="var(--color-text)"
            >
              &lt;a href="/tienda"&gt;Ver productos&lt;/a&gt;
            </text>
            <line x1="30" y1="82" x2="30" y2="110" stroke="var(--color-accent)" strokeWidth="1" />
            <text x="20" y="128" fontSize="11" fill="var(--color-accent)">
              abre
            </text>
            <line x1="120" y1="82" x2="120" y2="130" stroke="var(--color-accent)" strokeWidth="1" />
            <text x="96" y="148" fontSize="11" fill="var(--color-accent)">
              atributo
            </text>
            <line x1="290" y1="82" x2="290" y2="110" stroke="var(--color-accent)" strokeWidth="1" />
            <text x="248" y="128" fontSize="11" fill="var(--color-accent)">
              contenido
            </text>
            <line x1="450" y1="82" x2="450" y2="130" stroke="var(--color-accent)" strokeWidth="1" />
            <text x="432" y="148" fontSize="11" fill="var(--color-accent)">
              cierra
            </text>
          </svg>
        </Figure>
      </Lesson>

      <Lesson title="2. El esqueleto mínimo de una página">
        <p>
          Todo documento HTML tiene la misma estructura base. En VS Code se genera sola: escribe{' '}
          <code>!</code> y presiona <kbd>Tab</kbd>.
        </p>
        <Terminal
          titulo="index.html"
          lineas={[
            '<!DOCTYPE html>',
            '<html lang="es">',
            '  <head>',
            '    <meta charset="UTF-8">',
            '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
            '    <title>Nombre de tu negocio</title>',
            '  </head>',
            '  <body>',
            '    <!-- todo lo que se ve va aquí -->',
            '  </body>',
            '</html>',
          ]}
        />
        <RefTable
          cabeceras={['Parte', 'Para qué sirve']}
          filas={[
            [<code key="a">&lt;!DOCTYPE html&gt;</code>, 'Le dice al navegador que esto es HTML moderno'],
            [<code key="b">lang="es"</code>, 'El idioma: lo usan el traductor y los lectores de pantalla'],
            [<code key="c">charset="UTF-8"</code>, 'Sin esto las tildes y las ñ salen como símbolos raros'],
            [<code key="d">viewport</code>, 'Hace que la página se adapte a la pantalla del celular'],
            [<code key="e">&lt;title&gt;</code>, 'El texto de la pestaña del navegador y del resultado en Google'],
            [<code key="f">&lt;body&gt;</code>, 'Todo lo que la persona ve'],
          ]}
        />
      </Lesson>

      <Lesson title="3. Semántico: la diferencia que no se ve">
        <p>
          <code>&lt;div class="cabecera"&gt;</code> y <code>&lt;header&gt;</code> se ven{' '}
          <em>idénticos</em> en la pantalla. La diferencia está en quién más lee tu página: el
          buscador que decide si apareces en Google, el lector de pantalla de alguien que no ve, y
          el desarrollador que abre tu código en seis meses.
        </p>
        <p>
          Un <code>&lt;div&gt;</code> es una caja sin rótulo: puedes guardar cualquier cosa, pero
          nadie sabe qué hay adentro. <code>&lt;header&gt;</code> lo dice desde afuera.
        </p>

        <Figure
          label="Diagrama: la misma página con divs y con etiquetas semánticas"
          caption="Misma apariencia, información distinta. A la izquierda el navegador solo ve cajas; a la derecha entiende la estructura."
        >
          <svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg">
            {[
              { x: 0, titulo: 'Con divs', color: 'var(--color-neutral-500)', etiquetas: ['div', 'div', 'div', 'div'] },
              { x: 340, titulo: 'Semántico', color: 'var(--color-accent)', etiquetas: ['header', 'main', 'section', 'footer'] },
            ].map(({ x, titulo, color, etiquetas }) => (
              <g key={titulo}>
                <text x={x} y="14" fontSize="11" letterSpacing="1.4" fill={color}>
                  {titulo.toUpperCase()}
                </text>
                <rect x={x} y="28" width="280" height="40" rx="6" fill="var(--color-text)" opacity="0.07" />
                <text x={x + 12} y="53" fontSize="13" fontFamily="ui-monospace, monospace" fill={color}>
                  {etiquetas[0]}
                </text>
                <rect x={x} y="76" width="280" height="112" rx="6" fill="var(--color-text)" opacity="0.05" />
                <text x={x + 12} y="98" fontSize="13" fontFamily="ui-monospace, monospace" fill={color}>
                  {etiquetas[1]}
                </text>
                <rect x={x + 12} y="108" width="256" height="34" rx="5" fill="var(--color-text)" opacity="0.07" />
                <text x={x + 24} y="130" fontSize="12" fontFamily="ui-monospace, monospace" fill={color} opacity="0.9">
                  {etiquetas[2]}
                </text>
                <rect x={x + 12} y="146" width="256" height="34" rx="5" fill="var(--color-text)" opacity="0.07" />
                <text x={x + 24} y="168" fontSize="12" fontFamily="ui-monospace, monospace" fill={color} opacity="0.9">
                  {etiquetas[2]}
                </text>
                <rect x={x} y="196" width="280" height="36" rx="6" fill="var(--color-text)" opacity="0.07" />
                <text x={x + 12} y="219" fontSize="13" fontFamily="ui-monospace, monospace" fill={color}>
                  {etiquetas[3]}
                </text>
              </g>
            ))}
          </svg>
        </Figure>

        <RefTable
          cabeceras={['Etiqueta', 'Para qué']}
          filas={[
            [<code key="a">&lt;header&gt;</code>, 'Cabecera del sitio: nombre del negocio, logo, navegación'],
            [<code key="b">&lt;nav&gt;</code>, 'El menú con los enlaces a las secciones'],
            [<code key="c">&lt;main&gt;</code>, 'El contenido principal. Solo uno por página'],
            [<code key="d">&lt;section&gt;</code>, 'Un bloque temático: hero, productos, contacto'],
            [<code key="e">&lt;article&gt;</code>, 'Contenido que se entiende solo: una tarjeta de producto'],
            [<code key="f">&lt;footer&gt;</code>, 'Pie: copyright, redes, créditos'],
          ]}
        />
      </Lesson>

      <Lesson title="4. Anidación: lo que abre de último cierra de primero">
        <p>
          Las etiquetas se meten unas dentro de otras como cajas dentro de cajas. La regla es una
          sola: <strong>si A abre antes que B, A cierra después que B</strong>. Cruzarlas rompe el
          documento.
        </p>
        <Compare
          bien={{
            titulo: 'Bien anidado',
            items: [
              <code key="1">{'<section><article>…</article></section>'}</code>,
              'La sangría muestra la jerarquía de un vistazo',
              'El validador de la W3C no se queja',
            ],
          }}
          mal={{
            titulo: 'Mal anidado',
            items: [
              <code key="2">{'<section><article>…</section></article>'}</code>,
              'Se cruzaron: el navegador adivina y a veces adivina mal',
              'Los estilos y el JavaScript empiezan a comportarse raro',
            ],
          }}
        />
      </Lesson>

      <Lesson title="5. Accesibilidad en tres reglas">
        <Steps>
          <Step title="alt en todas las imágenes">
            Describe lo que muestra la foto. <code>alt="img1"</code> no sirve;{' '}
            <code>alt="Bolsa de café artesanal tostado suave, 250g"</code> sí. Es lo que escucha
            quien usa lector de pantalla y lo que se ve si la imagen no carga.
          </Step>
          <Step title="Una sola h1 y sin saltar niveles">
            <code>h1</code> para el nombre del negocio, <code>h2</code> por sección,{' '}
            <code>h3</code> dentro de cada una. Los títulos son la tabla de contenido de tu página:
            nunca se elige el nivel por el tamaño de la letra.
          </Step>
          <Step title="lang en el html">
            <code>&lt;html lang="es"&gt;</code> le dice al navegador y al lector de pantalla en qué
            idioma leer. Sin eso, una voz en inglés intenta leer tu español.
          </Step>
        </Steps>
        <Callout>
          Accesibilidad y SEO son la misma inversión: lo que hace que un lector de pantalla entienda
          tu página es exactamente lo que hace que Google la entienda.
        </Callout>
      </Lesson>

      <Lesson title="6. Arma tu index.html, paso a paso">
        <Steps>
          <Step title="Prepara el repositorio">
            <Terminal lineas={['$ cd nombre-de-tu-proyecto', '$ git pull origin main', '$ cd frontend']} />
          </Step>
          <Step title="Crea el archivo">
            <Terminal
              lineas={['# Windows', '$ type nul > index.html', '# Mac o Linux', '$ touch index.html']}
            />
          </Step>
          <Step title="Genera el esqueleto">
            En VS Code, <code>!</code> y <kbd>Tab</kbd>. Cambia el <code>title</code> por el nombre
            real de tu negocio.
          </Step>
          <Step title="Escribe la estructura semántica">
            <code>header</code> con <code>h1</code> y <code>nav</code>; <code>main</code> con tres{' '}
            <code>section</code> (hero, productos, contacto); <code>footer</code> con el copyright.
            Al menos un <code>article</code> de producto con su imagen y su <code>alt</code>.
          </Step>
          <Step title="Comenta tus decisiones">
            Mínimo tres comentarios <code>&lt;!-- --&gt;</code> explicando por qué elegiste cada
            etiqueta. Se escriben para el que lea después — incluido tú.
          </Step>
          <Step title="Valida y sube">
            Pega tu HTML en <code>validator.w3.org</code> y corrige lo que salga.
            <Terminal
              lineas={[
                '$ git add frontend/index.html',
                '$ git commit -m "feat: agrego estructura HTML semantica inicial"',
                '$ git push origin main',
              ]}
            />
          </Step>
        </Steps>
      </Lesson>

      <Exercises>
        <Quiz
          id="mapea-la-zona"
          index={1}
          title="Mapea la página"
          prompt="Arriba va el nombre del negocio con el menú de navegación. ¿Qué etiqueta envuelve esa zona?"
          options={[
            { id: 'div', label: <code>&lt;div class="cabecera"&gt;</code> },
            { id: 'header', label: <code>&lt;header&gt;</code> },
            { id: 'section', label: <code>&lt;section id="arriba"&gt;</code> },
            { id: 'nav', label: <code>&lt;nav&gt;</code> },
          ]}
          answer="header"
          explanation="header es la cabecera del sitio, y el nav con los enlaces va dentro de ella. El nav solo no alcanza: la cabecera también lleva el nombre del negocio."
          hint="La zona incluye el nombre Y el menú. ¿Cuál envuelve a cuál?"
        />

        <MatchPairs
          id="empareja-etiquetas"
          index={2}
          title="Empareja la etiqueta con su zona"
          pairs={[
            { id: 'header', izquierda: <code>&lt;header&gt;</code>, derecha: 'Nombre del negocio y navegación' },
            { id: 'main', izquierda: <code>&lt;main&gt;</code>, derecha: 'Todo el contenido principal' },
            { id: 'section', izquierda: <code>&lt;section&gt;</code>, derecha: 'El bloque de productos' },
            { id: 'article', izquierda: <code>&lt;article&gt;</code>, derecha: 'Una tarjeta de producto suelta' },
            { id: 'footer', izquierda: <code>&lt;footer&gt;</code>, derecha: 'Copyright y redes, al final' },
          ]}
          explanation="Cada etiqueta nombra una zona. Cuando las usas bien, el HTML se lee como el plano de la página."
        />

        <Quiz
          id="semantico-o-no"
          index={3}
          title="¿Semántico o no?"
          prompt="Esta línea abre la sección de productos. ¿Qué tiene de malo?"
          code={'<p><strong>Nuestros Productos</strong></p>'}
          options={[
            { id: 'nada', label: 'Nada: se ve en negrilla, que es lo que se busca' },
            { id: 'titulo', label: 'Se ve como título pero no lo es: debería ser una <h2>' },
            { id: 'clase', label: 'Le falta una clase CSS para darle estilo' },
            { id: 'div', label: 'Debería ser un <div> en vez de un <p>' },
          ]}
          answer="titulo"
          explanation="strong pone negrilla, pero para el buscador y el lector de pantalla sigue siendo un párrafo. Un título de sección va en h2: así entra en el índice de la página."
          hint="¿Esta etiqueta describe lo que el contenido realmente es?"
        />

        <TrueFalse
          id="un-solo-main"
          index={4}
          title="Cuántos main"
          statement="Una página puede tener varios <main> si tiene mucho contenido."
          answer={false}
          explanation="Falso. main es uno por página: marca el contenido principal, y si hay dos deja de significar nada. Para dividir el contenido están las section."
        />

        <Quiz
          id="alt-descriptivo"
          index={5}
          title="Elige el alt correcto"
          prompt="La imagen muestra una bolsa de café artesanal de 250 gramos, tostado suave."
          options={[
            { id: 'vacio', label: <code>alt="img1"</code> },
            { id: 'foto', label: <code>alt="foto del producto"</code> },
            { id: 'bueno', label: <code>alt="Bolsa de café artesanal tostado suave, 250g"</code> },
            { id: 'sin', label: 'Ninguno: si la imagen se ve, el alt sobra' },
          ]}
          answer="bueno"
          explanation="El alt es lo que escucha quien usa lector de pantalla y lo que aparece si la imagen no carga. Tiene que decir qué se ve, con el detalle que importa."
        />

        <Quiz
          id="jerarquia-titulos"
          index={6}
          title="La jerarquía de títulos"
          prompt="Tu página tiene el nombre del negocio arriba y tres secciones. ¿Cuál jerarquía es correcta?"
          options={[
            { id: 'muchos', label: 'Una h1 para el negocio y una h1 por cada sección' },
            { id: 'correcta', label: 'Una sola h1, una h2 por sección y h3 dentro de cada una' },
            { id: 'salto', label: 'h1 para el negocio y h4 para las secciones, que se ven mejor' },
            { id: 'sinh1', label: 'Sin h1: se arranca en h2 para que el título no quede tan grande' },
          ]}
          answer="correcta"
          explanation="Una h1 por página y sin saltarse niveles. El tamaño se ajusta con CSS: la etiqueta se elige por lo que significa, nunca por cómo se ve."
        />

        <OrderSteps
          id="anidacion-correcta"
          index={7}
          title="Ordena la sección de productos"
          prompt="Lo que se abre primero se cierra de último. Fíjate en la sangría."
          steps={[
            { id: 'sec', text: '<section id="productos">' },
            { id: 'h2', text: '  <h2>Nuestros Productos</h2>' },
            { id: 'art', text: '  <article>' },
            { id: 'h3', text: '    <h3>Café artesanal 250g</h3>' },
            { id: 'cierraArt', text: '  </article>' },
            { id: 'cierraSec', text: '</section>' },
          ]}
          explanation="El article se abre dentro de la section, así que cierra antes que ella: abre A, abre B, cierra B, cierra A."
        />

        <FillBlank
          id="lang-html"
          index={8}
          title="El idioma de la página"
          prompt="Para que el lector de pantalla lea en español y el navegador ofrezca traducir bien."
          code={'<html ___>'}
          options={['lang="es"', 'idioma="es"', 'charset="UTF-8"', 'lenguaje="español"']}
          answer='lang="es"'
          explanation="lang va en la etiqueta html y es de las cosas más baratas que puedes hacer por la accesibilidad de tu sitio."
        />

        <FillBlank
          id="charset"
          index={9}
          title="Las tildes salen raras"
          prompt="Tu página muestra «Caf� artesanal». Falta una línea en el head."
          code={'<head>\n  <meta ___>\n  <title>Mi negocio</title>\n</head>'}
          options={['charset="UTF-8"', 'name="viewport"', 'lang="es"', 'rel="stylesheet"']}
          answer='charset="UTF-8"'
          explanation="UTF-8 es la codificación que incluye tildes, ñ y signos de apertura. Sin declararla, el navegador adivina y suele adivinar mal."
        />

        <MultiSelect
          id="que-va-en-head"
          index={10}
          title="¿Qué va en el head?"
          prompt="Marca todo lo que pertenece al head y no al body."
          options={[
            { id: 'title', label: 'El <title> de la pestaña' },
            { id: 'charset', label: 'El <meta charset>' },
            { id: 'viewport', label: 'El <meta name="viewport">' },
            { id: 'h1', label: 'El <h1> con el nombre del negocio' },
            { id: 'productos', label: 'Las tarjetas de producto' },
          ]}
          answers={['title', 'charset', 'viewport']}
          explanation="En el head va la información sobre la página; en el body, la página. El h1 y los productos se ven, así que van en el body."
        />

        <TrueFalse
          id="section-vs-article"
          index={11}
          title="section y article"
          statement="Un <article> tiene que poder entenderse solo, fuera de la página."
          answer={true}
          explanation="Verdadero: esa es la prueba. Una tarjeta de producto o una entrada de blog se entienden aparte, así que son article. «Nuestros productos» solo tiene sentido dentro de la página: eso es una section."
        />

        <Quiz
          id="nav-enlaces"
          index={12}
          title="Los enlaces del menú"
          prompt="Tu nav tiene <a href='#productos'>. ¿Qué debe existir para que funcione?"
          options={[
            { id: 'id', label: 'Un elemento en la página con id="productos"' },
            { id: 'archivo', label: 'Un archivo llamado productos.html' },
            { id: 'clase', label: 'Un elemento con class="productos"' },
            { id: 'nada', label: 'Nada: el navegador lo busca por el texto' },
          ]}
          answer="id"
          explanation="La almohadilla apunta a un id dentro de la misma página. Si ese id no existe, el enlace no lleva a ningún lado — un clásico de la revisión."
        />

        <TrueFalse
          id="comentarios-se-ven"
          index={13}
          title="Comentarios en HTML"
          statement="Lo que va dentro de <!-- --> no se muestra en la página, pero cualquiera puede leerlo viendo el código fuente."
          answer={true}
          explanation="Verdadero. Sirven para explicar decisiones, no para esconder información: cualquiera abre el código fuente y los ve."
        />

        <Quiz
          id="etiqueta-imagen"
          index={14}
          title="La etiqueta de imagen"
          prompt="¿Cuál está bien escrita?"
          options={[
            { id: 'a', label: <code>{'<img src="cafe.jpg" alt="Bolsa de café 250g">'}</code> },
            { id: 'b', label: <code>{'<img>cafe.jpg</img>'}</code> },
            { id: 'c', label: <code>{'<imagen src="cafe.jpg">'}</code> },
            { id: 'd', label: <code>{'<img alt="cafe.jpg">'}</code> },
          ]}
          answer="a"
          explanation="img no lleva etiqueta de cierre y necesita dos atributos: src (dónde está el archivo) y alt (qué muestra)."
        />

        <MultiSelect
          id="checklist-entrega"
          index={15}
          title="Checklist de la entrega"
          prompt="Marca todo lo que tu index.html debe cumplir."
          options={[
            { id: 'doctype', label: 'DOCTYPE, lang="es" y charset UTF-8' },
            { id: 'header', label: 'header con el nombre real del negocio en h1' },
            { id: 'nav', label: 'nav con al menos 3 enlaces a ids que existen' },
            { id: 'main', label: 'main con las secciones hero, productos y contacto' },
            { id: 'article', label: 'Al menos un article con imagen y alt descriptivo' },
            { id: 'colores', label: 'Los colores de la marca aplicados' },
          ]}
          answers={['doctype', 'header', 'nav', 'main', 'article']}
          explanation="Todo menos los colores: eso es CSS y llega en la sesión 6. Hoy la página se ve fea a propósito — lo que importa es que la estructura esté bien."
        />

        <Quiz
          id="validador"
          index={16}
          title="El validador de la W3C"
          prompt="¿Para qué sirve pegar tu HTML en validator.w3.org?"
          options={[
            { id: 'a', label: 'Para que te diga si la página se ve bonita' },
            { id: 'b', label: 'Para encontrar etiquetas sin cerrar, mal anidadas o atributos que no existen' },
            { id: 'c', label: 'Para publicar la página en internet' },
            { id: 'd', label: 'Para convertir el HTML en CSS' },
          ]}
          answer="b"
          explanation="Es un corrector de estructura. El navegador perdona errores y muestra la página igual, así que el validador es la única forma de enterarte."
        />

        <TrueFalse
          id="html-estilos"
          index={17}
          title="HTML y apariencia"
          statement="Se elige <h1> o <h3> según el tamaño de letra que quieras."
          answer={false}
          explanation="Falso, y es el error conceptual más importante de la sesión. El nivel del título dice qué tan importante es dentro de la jerarquía. El tamaño lo pone CSS."
        />

        <OrderSteps
          id="orden-entrega"
          index={18}
          title="Ordena la entrega de la sesión"
          steps={[
            { id: 'pull', text: 'git pull origin main para tener el repo al día' },
            { id: 'crear', text: 'Crear frontend/index.html' },
            { id: 'estructura', text: 'Escribir la estructura semántica con el contenido real' },
            { id: 'validar', text: 'Validar en validator.w3.org y corregir' },
            { id: 'commit', text: 'git add, git commit y git push' },
          ]}
          explanation="Validar antes de subir: así el commit que queda en tu historial es uno que pasa la revisión."
        />

        <Quiz
          id="por-que-semantica"
          index={19}
          title="¿Por qué tanto énfasis?"
          prompt="Si la página se ve igual con divs, ¿por qué usar etiquetas semánticas?"
          options={[
            { id: 'a', label: 'Porque es un requisito del profesor' },
            {
              id: 'b',
              label: 'Porque el buscador, los lectores de pantalla y tus compañeros entienden la página sin adivinar',
            },
            { id: 'c', label: 'Porque la página carga más rápido' },
            { id: 'd', label: 'Porque los divs están prohibidos en HTML5' },
          ]}
          answer="b"
          explanation="Es la respuesta completa: SEO, accesibilidad y mantenimiento. Los divs no están prohibidos — son útiles cuando el contenido no tiene un significado propio."
        />
      </Exercises>
    </TopicPage>
  );
}
