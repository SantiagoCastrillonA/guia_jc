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

const SLUG = 'react-router';

/** Sesión 18 del cronograma — React Router y navegación en una SPA. */
export default function ReactRouterTopic() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Qué es una SPA">
        <p>
          En un sitio tradicional, cada enlace pide una página nueva al servidor y el navegador
          recarga todo. En una <strong>SPA</strong> (aplicación de una sola página) el navegador
          carga la app una vez, y al navegar solo cambia la parte que hace falta.
        </p>
        <Compare
          bien={{
            titulo: 'SPA con React Router',
            items: [
              'Cambiar de pantalla es instantáneo',
              'El estado de la app no se pierde al navegar',
              'La URL sigue funcionando: se puede compartir',
              'Se carga solo el código de la pantalla que se visita',
            ],
          }}
          mal={{
            titulo: 'Recarga completa',
            items: [
              'Pantalla en blanco entre página y página',
              'Todo el estado se pierde',
              'Vuelve a descargar CSS y JavaScript',
              'Se siente lento aunque el servidor sea rápido',
            ],
          }}
        />
        <Callout>
          Esta misma guía es una SPA. Cambia de tema y fíjate: la barra de arriba no parpadea, el
          contenido entra con una transición, y la URL cambia igual.
        </Callout>
      </Lesson>

      <Lesson title="2. Las piezas de React Router">
        <Terminal lineas={['$ npm install react-router-dom']} />
        <Terminal
          lineas={[
            "import { createBrowserRouter, RouterProvider } from 'react-router-dom';",
            '',
            'const router = createBrowserRouter([',
            '  {',
            "    path: '/',",
            '    element: <Layout />,',
            '    children: [',
            '      { index: true, element: <Inicio /> },',
            "      { path: 'productos', element: <Productos /> },",
            "      { path: 'productos/:id', element: <DetalleProducto /> },",
            "      { path: '*', element: <NoEncontrado /> },",
            '    ],',
            '  },',
            ']);',
            '',
            '<RouterProvider router={router} />',
          ]}
        />
        <RefTable
          cabeceras={['Pieza', 'Qué hace']}
          filas={[
            [<code key="a">path</code>, 'La ruta en la URL'],
            [<code key="b">element</code>, 'El componente que se muestra en esa ruta'],
            [<code key="c">children</code>, 'Rutas anidadas que comparten un layout'],
            [<code key="d">index: true</code>, 'La ruta por defecto del padre'],
            [<code key="e">path: '*'</code>, 'Cualquier ruta que no coincidió: el 404'],
          ]}
        />
      </Lesson>

      <Lesson title="3. Layout y Outlet: lo que no cambia">
        <p>
          La barra de navegación y el pie se repiten en todas las pantallas. En vez de copiarlos, se
          ponen en un <strong>layout</strong> y se deja un hueco donde va el contenido de cada ruta:
          ese hueco es <code>&lt;Outlet /&gt;</code>.
        </p>

        <Figure
          label="Diagrama: el layout envuelve al Outlet, que cambia según la ruta"
          caption="La barra y el pie se dibujan una vez. Solo el contenido del centro se reemplaza al navegar."
        >
          <svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="640" height="200" rx="10" fill="var(--color-text)" opacity="0.04" />
            <rect x="16" y="16" width="608" height="34" rx="6" fill="var(--color-accent)" opacity="0.18" />
            <text x="32" y="38" fontSize="12.5" fill="var(--color-text)" opacity="0.85">
              Barra de navegación — siempre visible
            </text>
            <rect
              x="16"
              y="60"
              width="608"
              height="96"
              rx="6"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.3"
              strokeDasharray="5 4"
            />
            <text x="32" y="86" fontSize="12" fill="var(--color-accent-text)" fontFamily="ui-monospace, monospace">
              &lt;Outlet /&gt;
            </text>
            <text x="32" y="112" fontSize="12.5" fill="var(--color-text-2)">
              / → Inicio · /productos → Productos · /productos/7 → Detalle
            </text>
            <text x="32" y="134" fontSize="12" fill="var(--color-text-2)">
              esta parte se reemplaza al navegar
            </text>
            <rect x="16" y="164" width="608" height="24" rx="6" fill="var(--color-accent)" opacity="0.18" />
            <text x="32" y="181" fontSize="12" fill="var(--color-text)" opacity="0.85">
              Pie de página
            </text>
          </svg>
        </Figure>

        <Terminal
          lineas={[
            "import { Outlet, NavLink } from 'react-router-dom';",
            '',
            'function Layout() {',
            '  return (',
            '    <>',
            '      <nav>',
            '        <NavLink to="/">Inicio</NavLink>',
            '        <NavLink to="/productos">Productos</NavLink>',
            '      </nav>',
            '      <main><Outlet /></main>',
            '      <footer>© 2026 Mi Negocio</footer>',
            '    </>',
            '  );',
            '}',
          ]}
        />
      </Lesson>

      <Lesson title="4. Navegar: Link, NavLink y useNavigate">
        <RefTable
          cabeceras={['Herramienta', 'Cuándo se usa']}
          filas={[
            [<code key="a">&lt;Link to="/x"&gt;</code>, 'Un enlace normal, sin recargar la página'],
            [<code key="b">&lt;NavLink&gt;</code>, 'Igual, pero sabe si está activo: útil para el menú'],
            [<code key="c">useNavigate()</code>, 'Navegar desde código: después de guardar, tras el login'],
            [<code key="d">useParams()</code>, 'Leer los parámetros de la URL: el :id'],
          ]}
        />
        <Callout tipo="ojo">
          Nunca uses <code>&lt;a href="/productos"&gt;</code> dentro de la app: eso recarga la
          página entera y pierde todo el estado. Los <code>&lt;a&gt;</code> se reservan para
          enlaces a sitios externos.
        </Callout>
        <Terminal
          lineas={[
            "import { useParams, useNavigate } from 'react-router-dom';",
            '',
            'function DetalleProducto() {',
            '  const { id } = useParams();          // de /productos/:id',
            '  const navegar = useNavigate();',
            '',
            '  async function eliminar() {',
            "    await fetch(`/api/productos/${id}`, { method: 'DELETE' });",
            "    navegar('/productos');            // volver a la lista",
            '  }',
            '  // ...',
            '}',
          ]}
        />
      </Lesson>

      <Lesson title="5. Rutas protegidas">
        <p>
          El panel de administración no debería abrirse sin sesión. Un componente que revisa y
          redirige resuelve el caso:
        </p>
        <Terminal
          lineas={[
            "import { Navigate } from 'react-router-dom';",
            '',
            'function SoloAdmin({ children }) {',
            '  const { usuario, cargando } = useAuth();',
            '',
            '  if (cargando) return null;',
            '  if (!usuario) return <Navigate to="/entrar" replace />;',
            '  if (usuario.rol !== "admin") return <Navigate to="/" replace />;',
            '  return children;',
            '}',
          ]}
        />
        <Callout tipo="ojo">
          Esto es comodidad, <strong>no seguridad</strong>. Cualquiera puede abrir las herramientas
          del navegador y saltarse la redirección. La seguridad de verdad está en el backend: si la
          API no verifica el rol, el panel está abierto aunque el botón no se vea.
        </Callout>
      </Lesson>

      <Lesson title="6. El detalle del despliegue">
        <Steps>
          <Step title="El servidor debe devolver el index en cualquier ruta">
            Al entrar directo a <code>/productos</code>, el servidor busca ese archivo y no existe.
            Hay que configurarlo para que devuelva siempre <code>index.html</code> y deje que React
            Router resuelva.
          </Step>
          <Step title="En nginx">
            <Terminal lineas={['location / {', '  try_files $uri $uri/ /index.html;', '}']} />
          </Step>
          <Step title="En Netlify">
            Un archivo <code>_redirects</code> con: <code>/* /index.html 200</code>
          </Step>
        </Steps>
        <Callout>
          Este es <em>el</em> error clásico al desplegar una SPA: navegando funciona, pero al
          recargar en una ruta interna sale 404. Si te pasa, es esta configuración.
        </Callout>
      </Lesson>

      <Exercises>
        <Quiz
          id="que-es-spa"
          index={1}
          title="¿Qué es una SPA?"
          options={[
            { id: 'a', label: 'Una app que se carga una vez y cambia de pantalla sin recargar' },
            { id: 'b', label: 'Una página con una sola sección' },
            { id: 'c', label: 'Una app sin URLs' },
            { id: 'd', label: 'Una página sin JavaScript' },
          ]}
          answer="a"
          explanation="Single Page Application. La página es una sola; las «pantallas» las dibuja JavaScript según la URL."
        />

        <TrueFalse
          id="spa-sin-url"
          index={2}
          title="Las URLs en una SPA"
          statement="En una SPA la URL deja de cambiar y no se pueden compartir enlaces internos."
          answer={false}
          explanation="Falso. React Router actualiza la URL: se puede compartir, marcar como favorita y usar el botón de atrás. Eso es justo lo que lo diferencia de esconder y mostrar divs."
        />

        <MatchPairs
          id="empareja-router"
          index={3}
          title="Empareja cada pieza"
          pairs={[
            { id: 'path', izquierda: <code>path</code>, derecha: 'La ruta en la URL' },
            { id: 'element', izquierda: <code>element</code>, derecha: 'El componente que se muestra' },
            { id: 'outlet', izquierda: <code>&lt;Outlet /&gt;</code>, derecha: 'El hueco del layout donde entra la ruta' },
            { id: 'link', izquierda: <code>&lt;Link&gt;</code>, derecha: 'Navegar sin recargar' },
            { id: 'params', izquierda: <code>useParams()</code>, derecha: 'Leer el :id de la URL' },
          ]}
          explanation="Con estas cinco piezas se arma la navegación de casi cualquier app."
        />

        <Quiz
          id="a-vs-link"
          index={4}
          title="¿a o Link?"
          prompt="Un enlace de tu menú hacia /productos."
          options={[
            { id: 'a', label: '<Link to="/productos">, para no recargar la página' },
            { id: 'b', label: '<a href="/productos">, que es HTML estándar' },
            { id: 'c', label: 'Un botón con onClick y window.location' },
            { id: 'd', label: 'Cualquiera de los tres da igual' },
          ]}
          answer="a"
          explanation="El <a> recarga la app completa y pierde el estado. Link intercepta el clic y solo cambia lo que hace falta."
        />

        <FillBlank
          id="outlet"
          index={5}
          title="El hueco del layout"
          code={'<main>\n  ___\n</main>'}
          options={['<Outlet />', '<Children />', '<Route />', '<Content />']}
          answer="<Outlet />"
          explanation="Outlet marca dónde se dibuja la ruta hija. Sin él, el layout se ve pero el contenido nunca aparece."
        />

        <Quiz
          id="navlink"
          index={6}
          title="Marcar el enlace activo"
          prompt="Quieres que el enlace del menú de la sección actual se vea distinto."
          options={[
            { id: 'a', label: 'NavLink, que sabe si su ruta está activa' },
            { id: 'b', label: 'Link con una clase fija' },
            { id: 'c', label: 'Un <a> con :hover' },
            { id: 'd', label: 'Comparando la URL a mano en cada componente' },
          ]}
          answer="a"
          explanation="NavLink aplica una clase o un estado activo automáticamente según la ruta. Hacerlo a mano funciona, pero es reinventar lo que ya viene."
        />

        <FillBlank
          id="useparams"
          index={7}
          title="Leer el id de la URL"
          prompt="La ruta es /productos/:id."
          code={'const { id } = ___();'}
          options={['useParams', 'useNavigate', 'useState', 'useLocation']}
          answer="useParams"
          explanation="useParams devuelve un objeto con los parámetros de la ruta. Y como vienen de la URL, siempre llegan como texto."
        />

        <Quiz
          id="usenavigate"
          index={8}
          title="Navegar después de guardar"
          prompt="Guardaste un producto y quieres volver a la lista desde el código."
          options={[
            { id: 'a', label: "const navegar = useNavigate(); navegar('/productos')" },
            { id: 'b', label: "window.location.href = '/productos'" },
            { id: 'c', label: '<Link to="/productos"> dentro de la función' },
            { id: 'd', label: 'location.reload()' },
          ]}
          answer="a"
          explanation="useNavigate es la versión programática de Link. window.location recargaría toda la app."
        />

        <Quiz
          id="ruta-404"
          index={9}
          title="La ruta comodín"
          prompt="¿Para qué sirve path: '*'?"
          options={[
            { id: 'a', label: 'Para atrapar cualquier URL que no coincidió con las otras: el 404' },
            { id: 'b', label: 'Para la página de inicio' },
            { id: 'c', label: 'Para las rutas protegidas' },
            { id: 'd', label: 'Para las rutas con parámetros' },
          ]}
          answer="a"
          explanation="Va de última y captura lo que sobró. Sin ella, una URL mal escrita muestra una pantalla vacía sin explicación."
        />

        <TrueFalse
          id="index-true"
          index={10}
          title="La ruta índice"
          statement="index: true define qué se muestra en la ruta del padre, sin segmento adicional."
          answer={true}
          explanation="Verdadero. Es la pantalla de «/» dentro del layout: la portada."
        />

        <OrderSteps
          id="orden-router"
          index={11}
          title="Ordena la configuración"
          steps={[
            { id: 'install', text: 'npm install react-router-dom' },
            { id: 'layout', text: 'Crear el Layout con la barra, el Outlet y el pie' },
            { id: 'router', text: 'Definir las rutas con createBrowserRouter' },
            { id: 'provider', text: 'Envolver la app con RouterProvider' },
            { id: 'links', text: 'Reemplazar los <a> internos por <Link>' },
          ]}
          explanation="El layout primero: así las rutas ya nacen anidadas y no hay que reorganizarlas después."
        />

        <Quiz
          id="404-al-recargar"
          index={12}
          title="404 al recargar en /productos"
          prompt="Navegando funciona, pero si recargas estando en /productos sale 404. ¿Qué falta?"
          options={[
            { id: 'a', label: 'Configurar el servidor para que devuelva index.html en cualquier ruta' },
            { id: 'b', label: 'Agregar más rutas en el router' },
            { id: 'c', label: 'Cambiar Link por <a>' },
            { id: 'd', label: 'Reinstalar react-router-dom' },
          ]}
          answer="a"
          explanation="Al recargar, el navegador le pide /productos al servidor, que busca ese archivo y no lo encuentra. try_files en nginx o _redirects en Netlify lo resuelven."
        />

        <FillBlank
          id="try-files"
          index={13}
          title="La configuración de nginx"
          code={'location / {\n  try_files $uri $uri/ ___;\n}'}
          options={['/index.html', '/404.html', '/app.js', '=404']}
          answer="/index.html"
          explanation="Si el archivo no existe, se entrega el index y React Router decide qué mostrar. Es exactamente la línea que hace funcionar esta guía en el servidor."
        />

        <Quiz
          id="ruta-protegida"
          index={14}
          title="Proteger el panel"
          prompt="¿Cómo evitas que alguien sin sesión abra /admin?"
          options={[
            { id: 'a', label: 'Un componente que revisa la sesión y devuelve <Navigate to="/entrar" />' },
            { id: 'b', label: 'Escondiendo el enlace del menú' },
            { id: 'c', label: 'Poniendo una contraseña en el CSS' },
            { id: 'd', label: 'Cambiando el nombre de la ruta por algo difícil de adivinar' },
          ]}
          answer="a"
          explanation="Esconder el enlace no protege nada: la URL se puede escribir a mano. La redirección es la comodidad; la protección real está en la API."
        />

        <TrueFalse
          id="proteccion-frontend"
          index={15}
          title="¿El frontend protege?"
          statement="Con la ruta protegida en React, los datos de administración están seguros."
          answer={false}
          explanation="Falso, y es de lo más importante de la sesión. El frontend corre en el computador del usuario y se puede modificar. Si la API no verifica el rol, cualquiera consulta los datos directamente."
        />

        <Quiz
          id="lazy-rutas"
          index={16}
          title="Cargar solo lo necesario"
          prompt="Tu app tiene 12 pantallas y el archivo de JavaScript pesa mucho. ¿Qué haces?"
          options={[
            { id: 'a', label: 'Cargar cada pantalla con React.lazy, para que su código viaje solo cuando se visita' },
            { id: 'b', label: 'Borrar pantallas' },
            { id: 'c', label: 'Poner todo en un solo componente' },
            { id: 'd', label: 'Comprimir las imágenes' },
          ]}
          answer="a"
          explanation="Se llama code splitting. Esta guía lo hace: el código de cada tema se descarga solo al abrirlo, y por eso la home carga rápido aunque haya 25 temas."
        />

        <MultiSelect
          id="ventajas-spa"
          index={17}
          title="Ventajas de una SPA"
          prompt="Marca las reales."
          options={[
            { id: 'rapido', label: 'Cambiar de pantalla es casi instantáneo' },
            { id: 'estado', label: 'El estado de la app sobrevive a la navegación' },
            { id: 'urls', label: 'Las URLs se siguen pudiendo compartir' },
            { id: 'seguro', label: 'Es más segura que un sitio tradicional' },
            { id: 'sinserver', label: 'Ya no necesita servidor' },
          ]}
          answers={['rapido', 'estado', 'urls']}
          explanation="La seguridad no cambia —vive en el backend— y sigues necesitando un servidor que entregue los archivos y responda la API."
        />

        <Quiz
          id="parametro-texto"
          index={18}
          title="El parámetro de la URL"
          prompt="useParams te da id = '7'. Vas a compararlo con el _id de un producto."
          options={[
            { id: 'a', label: 'Tener en cuenta que es texto: convertirlo o comparar con el tipo correcto' },
            { id: 'b', label: 'Compararlo directamente con ===, siempre funciona' },
            { id: 'c', label: 'Usar == para que convierta solo' },
            { id: 'd', label: 'Guardarlo en estado primero' },
          ]}
          answer="a"
          explanation="Todo lo que viene de la URL es texto. Es el mismo cuidado que en la sesión 12 con req.params.id."
        />

        <OrderSteps
          id="orden-detalle"
          index={19}
          title="Ordena la pantalla de detalle"
          steps={[
            { id: 'params', text: 'Leer el id con useParams' },
            { id: 'estados', text: 'Declarar los estados: producto, cargando, error' },
            { id: 'effect', text: 'Pedir el producto en un useEffect con [id] como dependencia' },
            { id: 'estados-ui', text: 'Mostrar cargando, error o no encontrado según corresponda' },
            { id: 'render', text: 'Dibujar el producto' },
          ]}
          explanation="Ojo con la dependencia [id]: si el usuario navega de /productos/7 a /productos/9 sin desmontar el componente, sin esa dependencia se quedaría mostrando el producto viejo."
        />

        <MultiSelect
          id="checklist-router"
          index={20}
          title="Checklist de navegación"
          options={[
            { id: 'link', label: 'Todos los enlaces internos usan Link o NavLink' },
            { id: '404', label: 'Hay una ruta comodín para el 404' },
            { id: 'layout', label: 'La barra y el pie están en un layout con Outlet' },
            { id: 'server', label: 'El servidor devuelve index.html en cualquier ruta' },
            { id: 'api', label: 'Las rutas protegidas también se validan en la API' },
          ]}
          answers={['link', '404', 'layout', 'server', 'api']}
          explanation="Las cinco. La última es la que separa una app que parece protegida de una que lo está."
        />
      </Exercises>
    </TopicPage>
  );
}
