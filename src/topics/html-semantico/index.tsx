import { Exercises, Lesson, TopicPage } from '../../components/TopicPage';
import { OrderSteps, Quiz } from '../../components/exercises';

const SLUG = 'html-semantico';

/** Sesión 5 del cronograma — HTML semántico: estructura profesional. */
export default function HtmlSemantico() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="Un div es una caja sin etiqueta">
        <p>
          <code>&lt;div class="cabecera"&gt;</code> y <code>&lt;header&gt;</code> se ven igual en
          la pantalla. La diferencia está en quién más lee tu página: el buscador que decide si
          apareces en Google, el lector de pantalla de alguien que no ve la pantalla, y el
          desarrollador que abre tu código en seis meses.
        </p>
        <p>
          Un <code>&lt;div&gt;</code> es una caja sin rótulo: puedes guardar lo que quieras, pero
          nadie sabe qué hay adentro. <code>&lt;header&gt;</code> lo dice desde afuera.
        </p>
      </Lesson>

      <Lesson title="Las etiquetas de hoy">
        <ul>
          <li>
            <code>&lt;header&gt;</code> — cabecera del sitio: nombre del negocio y navegación.
          </li>
          <li>
            <code>&lt;nav&gt;</code> — el menú con los enlaces a las secciones.
          </li>
          <li>
            <code>&lt;main&gt;</code> — el contenido principal. <strong>Solo uno por página.</strong>
          </li>
          <li>
            <code>&lt;section&gt;</code> — agrupa contenido de un mismo tema: hero, productos,
            contacto.
          </li>
          <li>
            <code>&lt;article&gt;</code> — contenido que se entiende solo: una tarjeta de producto,
            una entrada de blog.
          </li>
          <li>
            <code>&lt;footer&gt;</code> — pie: copyright, redes, créditos.
          </li>
        </ul>
      </Lesson>

      <Lesson title="Accesibilidad en tres reglas">
        <ul>
          <li>
            <code>alt</code> en cada imagen, describiendo lo que muestra. <code>alt="img1"</code> no
            sirve para nada.
          </li>
          <li>
            Una sola <code>&lt;h1&gt;</code> por página, luego <code>&lt;h2&gt;</code> por sección y{' '}
            <code>&lt;h3&gt;</code> dentro de cada una. Nunca te saltes un nivel.
          </li>
          <li>
            <code>lang="es"</code> en el <code>&lt;html&gt;</code>: le dice al navegador y al lector
            de pantalla en qué idioma está escrita la página.
          </li>
        </ul>
      </Lesson>

      <Exercises>
        <Quiz
          id="mapea-la-zona"
          index={1}
          title="Mapea la página"
          prompt="Arriba de la página va el nombre del negocio con el menú de navegación. ¿Qué etiqueta envuelve esa zona?"
          options={[
            { id: 'div', label: <code>&lt;div class="cabecera"&gt;</code> },
            { id: 'header', label: <code>&lt;header&gt;</code> },
            { id: 'section', label: <code>&lt;section id="arriba"&gt;</code> },
            { id: 'nav', label: <code>&lt;nav&gt;</code> },
          ]}
          answer="header"
          explanation={
            <>
              Correcto. <code>&lt;header&gt;</code> es la cabecera del sitio, y el{' '}
              <code>&lt;nav&gt;</code> con los enlaces va <em>dentro</em> de ella. El{' '}
              <code>&lt;nav&gt;</code> solo no alcanza: la cabecera también lleva el nombre del
              negocio.
            </>
          }
          hint="La zona incluye el nombre del negocio Y el menú. ¿Cuál de las dos etiquetas envuelve a la otra?"
        />

        <Quiz
          id="semantico-o-no"
          index={2}
          title="¿Semántico o no?"
          prompt="Esta línea abre la sección de productos del catálogo. ¿Qué tiene de malo?"
          code={'<p><strong>Nuestros Productos</strong></p>'}
          options={[
            { id: 'nada', label: 'Nada: se ve en negrilla, que es lo que se busca' },
            {
              id: 'titulo',
              label: 'Se ve como título pero no lo es: debería ser una <h2>',
            },
            { id: 'clase', label: 'Le falta una clase CSS para poder darle estilo' },
            { id: 'div', label: 'Debería ser un <div> en vez de un <p>' },
          ]}
          answer="titulo"
          explanation={
            <>
              Eso es. <code>&lt;strong&gt;</code> pone el texto en negrilla, pero para el buscador y
              el lector de pantalla sigue siendo un párrafo cualquiera. Un título de sección va en{' '}
              <code>&lt;h2&gt;</code>: así entra en el índice de la página. El estilo se arregla con
              CSS; la estructura, no.
            </>
          }
          hint="Pregúntate: ¿esta etiqueta describe lo que el contenido realmente es?"
        />

        <Quiz
          id="alt-descriptivo"
          index={3}
          title="Elige el alt correcto"
          prompt="La imagen muestra una bolsa de café artesanal de 250 gramos, tostado suave. ¿Cuál alt sirve?"
          options={[
            { id: 'vacio', label: <code>alt="img1"</code> },
            { id: 'foto', label: <code>alt="foto del producto"</code> },
            {
              id: 'bueno',
              label: <code>alt="Bolsa de café artesanal tostado suave, 250g"</code>,
            },
            { id: 'sin', label: 'Ninguno: si la imagen se ve, el alt sobra' },
          ]}
          answer="bueno"
          explanation={
            <>
              Exacto. El <code>alt</code> es lo que escucha quien usa un lector de pantalla y lo que
              se muestra si la imagen no carga. Tiene que decir <em>qué</em> se ve, con el detalle
              que importa para entender el producto.
            </>
          }
          hint="Imagina que no puedes ver la imagen y alguien te la lee en voz alta. ¿Cuál te deja entender qué es?"
        />

        <Quiz
          id="jerarquia-titulos"
          index={4}
          title="La jerarquía de títulos"
          prompt="Tu página tiene el nombre del negocio arriba y tres secciones: hero, productos y contacto. ¿Cuál jerarquía es la correcta?"
          options={[
            {
              id: 'muchos-h1',
              label: 'Una <h1> para el negocio y una <h1> por cada sección',
            },
            {
              id: 'correcta',
              label: 'Una sola <h1> para el negocio, una <h2> por sección y <h3> dentro de cada una',
            },
            { id: 'salto', label: 'Una <h1> para el negocio y <h4> para las secciones, que se ven mejor' },
            { id: 'sin-h1', label: 'Sin <h1>: se arranca en <h2> para que el título no quede tan grande' },
          ]}
          answer="correcta"
          explanation={
            <>
              Correcto. Una sola <code>&lt;h1&gt;</code> por página y sin saltarse niveles: los
              títulos son el índice de tu página. El tamaño se ajusta después con CSS — nunca se
              elige la etiqueta por cómo se ve.
            </>
          }
          hint="Piensa en la tabla de contenido de un libro: un título del libro, capítulos, subtítulos."
        />

        <OrderSteps
          id="anidacion-correcta"
          index={5}
          title="Ordena la sección de productos"
          prompt="Estas líneas arman el catálogo con una tarjeta de producto. Ordénalas: lo que se abre primero se cierra de último."
          steps={[
            { id: 'sec', text: '<section id="productos">' },
            { id: 'h2', text: '  <h2>Nuestros Productos</h2>' },
            { id: 'art', text: '  <article>' },
            { id: 'h3', text: '    <h3>Café artesanal 250g</h3>' },
            { id: 'cierra-art', text: '  </article>' },
            { id: 'cierra-sec', text: '</section>' },
          ]}
          explanation={
            <>
              Ese es el orden. El <code>&lt;article&gt;</code> se abre dentro de la{' '}
              <code>&lt;section&gt;</code>, así que se cierra <em>antes</em> que ella: abre A, abre
              B, cierra B, cierra A. La sangría te muestra la anidación de un vistazo.
            </>
          }
          hint="Fíjate en la sangría de cada línea: las que van más adentro se abren después y se cierran antes."
        />
      </Exercises>
    </TopicPage>
  );
}
