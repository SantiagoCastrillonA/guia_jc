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

const SLUG = 'sitio-estatico-deploy';

/** Sesión 7 del cronograma — publicar el sitio en internet. */
export default function SitioEstaticoDeploy() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Qué cambia al publicar">
        <p>
          En tu computador el sitio se abre con Live Server desde una carpeta. En internet vive en
          un servidor, en otra ruta, y a veces dentro de un subdirectorio. Casi todo funciona igual
          — menos <strong>las rutas</strong> y <strong>los nombres de archivo</strong>.
        </p>
        <RefTable
          cabeceras={['', 'En tu computador', 'Publicado']}
          filas={[
            ['Dirección', <code key="a">http://127.0.0.1:5500/</code>, <code key="b">https://mi-negocio.netlify.app/</code>],
            ['Sistema de archivos', 'Windows o Mac: no distingue mayúsculas', 'Linux: Logo.png ≠ logo.png'],
            ['Quién lo ve', 'Solo tú', 'Cualquier persona con el enlace'],
            ['Los errores', 'Se ven en tu consola', 'Los ve quien entre a tu sitio'],
          ]}
        />
      </Lesson>

      <Lesson title="2. La regla de oro: rutas relativas">
        <p>
          Una ruta que empieza con <code>/</code> significa «desde la raíz del dominio». Otra sin la
          barra significa «desde donde está este archivo». Esa diferencia es la que rompe el 90% de
          los despliegues.
        </p>

        <Figure
          label="Diagrama: cómo resuelve el navegador una ruta con barra inicial y sin ella"
          caption="Si tu sitio queda en un subdirectorio, la barra inicial apunta fuera de tu proyecto y el archivo no aparece."
        >
          <svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="16" fontSize="11" letterSpacing="1.4" fill="var(--color-accent-text)">
              SIN BARRA — RELATIVA
            </text>
            <text x="0" y="42" fontSize="14" fontFamily="ui-monospace, monospace" fill="var(--color-text)">
              href="styles.css"
            </text>
            <text x="0" y="66" fontSize="12" fill="var(--color-text-2)">
              busca junto al index.html → funciona en local y publicado
            </text>
            <rect x="0" y="78" width="620" height="2" rx="1" fill="var(--color-accent)" opacity="0.5" />

            <text x="0" y="118" fontSize="11" letterSpacing="1.4" fill="var(--color-neutral-400)">
              CON BARRA — ABSOLUTA
            </text>
            <text x="0" y="144" fontSize="14" fontFamily="ui-monospace, monospace" fill="var(--color-text)">
              href="/styles.css"
            </text>
            <text x="0" y="168" fontSize="12" fill="var(--color-text-2)">
              busca en la raíz del dominio → en local sirve, en GitHub Pages da 404
            </text>
            <text x="0" y="196" fontSize="12" fontFamily="ui-monospace, monospace" fill="var(--color-neutral-400)">
              usuario.github.io/styles.css ✕ · usuario.github.io/mi-repo/styles.css ✓
            </text>
          </svg>
        </Figure>

        <Compare
          bien={{
            titulo: 'Sobreviven al deploy',
            items: [
              <code key="1">href="styles.css"</code>,
              <code key="2">src="images/logo.png"</code>,
              <code key="3">href="./contacto.html"</code>,
              'Nombres en minúscula, sin espacios ni tildes',
            ],
          }}
          mal={{
            titulo: 'Se rompen',
            items: [
              <code key="4">href="/styles.css"</code>,
              <code key="5">src="/images/hero.jpg"</code>,
              <code key="6">src="Images/Logo.png"</code>,
              <code key="7">src="C:/Users/santi/logo.png"</code>,
            ],
          }}
        />

        <Callout tipo="ojo">
          Windows y Mac no distinguen mayúsculas: <code>Logo.png</code> abre el archivo{' '}
          <code>logo.png</code> sin chistar. El servidor corre Linux y sí distingue. Por eso una
          imagen que se veía perfecta en tu máquina desaparece al publicar.
        </Callout>
      </Lesson>

      <Lesson title="3. Auditoría antes de publicar">
        <Steps>
          <Step title="Rutas relativas">
            Busca en tu HTML y tu CSS todas las comillas seguidas de <code>/</code> y quítales la
            barra. Incluye las de <code>url()</code> dentro del CSS.
          </Step>
          <Step title="Nombres exactos">
            Compara cada <code>src</code> con el nombre real del archivo, letra por letra. Renombra
            todo a minúsculas y sin espacios.
          </Step>
          <Step title="Consola limpia">
            F12, pestaña Console. Cualquier 404 en rojo es un archivo que no va a cargar en
            producción.
          </Step>
          <Step title="Responsive">
            Modo dispositivo, 375px y 1280px. Que no haya barra horizontal ni texto cortado.
          </Step>
          <Step title="Todo subido">
            <Terminal lineas={['$ git status', '# nothing to commit, working tree clean']} />
            Lo que no esté en GitHub no se publica: el servidor lee del repositorio, no de tu
            carpeta.
          </Step>
        </Steps>
      </Lesson>

      <Lesson title="4. Publicar: Netlify o GitHub Pages">
        <RefTable
          cabeceras={['', 'Netlify', 'GitHub Pages']}
          filas={[
            ['Carpeta del sitio', 'Cualquiera: le dices «publish directory: frontend»', 'La raíz del repo o /docs'],
            ['URL', <code key="a">mi-sitio.netlify.app</code>, <code key="b">usuario.github.io/mi-repo</code>],
            ['Vista previa por rama', 'Sí, cada rama tiene su URL', 'No'],
            ['Se actualiza con cada push', 'Sí', 'Sí'],
          ]}
        />
        <Callout>
          Si tu <code>index.html</code> vive dentro de <code>frontend/</code>, Netlify es el camino
          corto: le indicas esa carpeta y listo. Con Pages tendrías que mover archivos o usar{' '}
          <code>/docs</code>.
        </Callout>
        <Terminal
          titulo="El lanzamiento"
          lineas={[
            '$ git add .',
            '$ git commit -m "fix: ajustes pre-deploy"',
            '$ git push origin main',
            '# publicas en Netlify o Pages, copias la URL',
            '# y la documentas en el README',
            '$ git commit -m "docs: agrego URL de despliegue al README"',
            '$ git push origin main',
          ]}
        />
      </Lesson>

      <Lesson title="5. Verifica en la URL real">
        <p>
          Abre la dirección pública en una pestaña nueva — no en Live Server. Revisa la consola: los
          404 aparecen ahí, no en la apariencia. Un sitio puede verse bien y tener el CSS caído si
          alcanzaste a cachear los estilos en tu navegador.
        </p>
        <Callout tipo="ojo">
          Truco: abre tu sitio en una ventana de incógnito o desde el celular con datos móviles. Así
          lo ves como lo ve alguien que nunca ha entrado.
        </Callout>
      </Lesson>

      <Exercises>
        <TrueFalse
          id="ruta-relativa-1"
          index={1}
          title="¿Sobrevive o se rompe?"
          statement='<link href="styles.css"> sobrevive al despliegue.'
          answer={true}
          explanation="Sobrevive. Es relativa: busca el archivo junto al index.html, esté donde esté el sitio."
        />

        <TrueFalse
          id="ruta-absoluta-1"
          index={2}
          title="Con barra al inicio"
          statement='<link href="/styles.css"> funciona igual publicado que en local.'
          answer={false}
          explanation="Se rompe si el sitio no está en la raíz del dominio. En GitHub Pages tu sitio vive en /mi-repo/, así que /styles.css apunta afuera y da 404."
        />

        <TrueFalse
          id="mayusculas"
          index={3}
          title="Mayúsculas en el nombre"
          statement='Si el archivo real es images/logo.png, escribir src="Images/Logo.png" funciona igual en el servidor.'
          answer={false}
          explanation="Falso. El servidor corre Linux y distingue mayúsculas de minúsculas. En tu Windows funcionaba; publicado, la imagen desaparece."
        />

        <Quiz
          id="regla-de-oro"
          index={4}
          title="La regla de oro del día"
          prompt="Resúmela en una frase."
          options={[
            { id: 'a', label: 'Siempre usar rutas que empiecen con /' },
            { id: 'b', label: 'Rutas relativas y nombres de archivo exactos, en minúscula' },
            { id: 'c', label: 'Subir todo a una sola carpeta' },
            { id: 'd', label: 'Usar solo imágenes en formato PNG' },
          ]}
          answer="b"
          explanation="Relativas y exactas. Con eso solo evitas la mayoría de los problemas de despliegue que vas a ver en el curso."
        />

        <MultiSelect
          id="caza-el-bug"
          index={5}
          title="Caza el bug del deploy"
          prompt="Estas líneas están en un proyecto con frontend/index.html, frontend/styles.css y frontend/images/{logo.png, hero.jpg}. Marca las que se rompen al publicar."
          options={[
            { id: 'css', label: '<link rel="stylesheet" href="/styles.css">' },
            { id: 'logo', label: '<img src="images/Logo.png">' },
            { id: 'hero', label: '<img src="/images/hero.jpg">' },
            { id: 'nav', label: '<a href="/index.html">Inicio</a>' },
            { id: 'bg', label: 'background-image: url(/images/hero.jpg);' },
            { id: 'ok', label: '<a href="./contacto.html">Contacto</a>' },
          ]}
          answers={['css', 'logo', 'hero', 'nav', 'bg']}
          explanation="Cinco rotas: cuatro por la barra inicial y una por la mayúscula en Logo.png. La última es relativa y correcta. Ojo con la del CSS: las rutas dentro de url() también cuentan."
          hint="Busca las que empiezan con / y compara los nombres letra por letra."
        />

        <FillBlank
          id="arregla-ruta"
          index={6}
          title="Arregla la ruta"
          prompt="El archivo real es frontend/images/hero.jpg y el HTML está en frontend/index.html."
          code={'<img src=___ alt="Producto principal">'}
          options={['"images/hero.jpg"', '"/images/hero.jpg"', '"/frontend/images/hero.jpg"', '"Images/Hero.jpg"']}
          answer='"images/hero.jpg"'
          explanation="Relativa desde el index.html, y con el nombre exacto en minúscula. Así funciona igual en tu computador y en el servidor."
        />

        <Quiz
          id="donde-ver-404"
          index={7}
          title="¿Dónde se ven los 404?"
          prompt="Publicaste y la página se ve sin estilos. ¿Dónde confirmas qué pasó?"
          options={[
            { id: 'console', label: 'En F12 → Console y Network: ahí salen los archivos que no cargaron' },
            { id: 'ver', label: 'Mirando la página con atención' },
            { id: 'git', label: 'En git log' },
            { id: 'nada', label: 'No hay forma de saberlo' },
          ]}
          answer="console"
          explanation="Console muestra los errores en rojo y Network muestra cada archivo con su código: 200 cargó, 404 no existe. Es el primer sitio donde mira cualquier desarrollador."
        />

        <MatchPairs
          id="empareja-codigos"
          index={8}
          title="Empareja el código HTTP con su significado"
          pairs={[
            { id: '200', izquierda: '200', derecha: 'Todo bien, el archivo cargó' },
            { id: '404', izquierda: '404', derecha: 'No existe: la ruta está mal' },
            { id: '403', izquierda: '403', derecha: 'Existe pero no tienes permiso' },
            { id: '500', izquierda: '500', derecha: 'El servidor falló al procesarlo' },
          ]}
          explanation="Los 400 son culpa de quien pide (tu ruta), los 500 son culpa del servidor. Vas a verlos todo el curso, sobre todo cuando lleguemos al backend."
        />

        <Quiz
          id="netlify-o-pages"
          index={9}
          title="¿Netlify o GitHub Pages?"
          prompt="Tu index.html vive dentro de la carpeta frontend/ del repositorio."
          options={[
            { id: 'net', label: 'Netlify: le indicas «publish directory: frontend» y listo' },
            { id: 'pages', label: 'GitHub Pages, que también permite elegir cualquier carpeta' },
            { id: 'mover', label: 'Ninguno: hay que borrar la carpeta frontend' },
            { id: 'igual', label: 'Da exactamente lo mismo' },
          ]}
          answer="net"
          explanation="Netlify deja elegir la carpeta publicada. Pages solo ofrece la raíz o /docs, así que tendrías que mover archivos o reorganizar el repo."
        />

        <Quiz
          id="url-github-pages"
          index={10}
          title="La URL de GitHub Pages"
          prompt="Tu usuario es ana y el repo se llama mi-negocio. ¿Cuál es la URL?"
          options={[
            { id: 'a', label: 'ana.github.io/mi-negocio' },
            { id: 'b', label: 'mi-negocio.github.io' },
            { id: 'c', label: 'github.com/ana/mi-negocio' },
            { id: 'd', label: 'ana.netlify.app' },
          ]}
          answer="a"
          explanation="usuario.github.io/repositorio. Fíjate en que el sitio queda en un subdirectorio: por eso las rutas con barra inicial se rompen justo aquí."
        />

        <TrueFalse
          id="push-para-publicar"
          index={11}
          title="Lo que no está en GitHub"
          statement="Si un archivo está en tu computador pero no lo subiste, el sitio publicado igual lo muestra."
          answer={false}
          explanation="Falso. El servicio de hosting lee del repositorio. Si no hiciste push, ese archivo no existe para el mundo — otra causa clásica de imágenes rotas."
        />

        <OrderSteps
          id="orden-deploy"
          index={12}
          title="Ordena el lanzamiento"
          steps={[
            { id: 'audit', text: 'Auditar rutas, nombres y consola en local' },
            { id: 'commit', text: 'git add, commit y push de los ajustes' },
            { id: 'deploy', text: 'Conectar el repositorio en Netlify o activar Pages' },
            { id: 'verificar', text: 'Abrir la URL pública y revisar la consola' },
            { id: 'readme', text: 'Documentar la URL en el README y hacer push' },
          ]}
          explanation="Auditar antes de publicar te ahorra el ciclo de «publico, se rompe, arreglo, vuelvo a publicar». Y la URL en el README es parte del entregable."
        />

        <MultiSelect
          id="checklist-pre-deploy"
          index={13}
          title="Checklist previo"
          prompt="Marca lo que hay que verificar antes de publicar."
          options={[
            { id: 'rutas', label: 'Rutas relativas, sin barra inicial' },
            { id: 'semantica', label: 'HTML bien anidado, con header, main y footer' },
            { id: 'media', label: 'Al menos una media query funcionando' },
            { id: 'consola', label: 'Consola sin errores rojos' },
            { id: 'push', label: 'Último commit subido' },
            { id: 'dominio', label: 'Haber comprado un dominio propio' },
          ]}
          answers={['rutas', 'semantica', 'media', 'consola', 'push']}
          explanation="Todo menos el dominio: Netlify y Pages te dan una URL gratis. El dominio propio es opcional y viene después."
        />

        <Quiz
          id="cache-navegador"
          index={14}
          title="Cambié el CSS y no se ve"
          prompt="Subiste un cambio de estilos, el deploy terminó, pero la página se ve igual. ¿Qué haces primero?"
          options={[
            { id: 'a', label: 'Recargar sin caché (Ctrl+Shift+R) o abrir en incógnito' },
            { id: 'b', label: 'Volver a escribir todo el CSS' },
            { id: 'c', label: 'Cambiar de servicio de hosting' },
            { id: 'd', label: 'Esperar 24 horas' },
          ]}
          answer="a"
          explanation="El navegador guarda copias de los archivos. Una recarga forzada o el modo incógnito te muestran la versión nueva de verdad."
        />

        <FillBlank
          id="readme-url"
          index={15}
          title="Documenta tu URL"
          prompt="En el README, en formato Markdown, con el texto visible y el enlace."
          code={'## Demo en vivo\n___'}
          options={[
            '[mi-negocio.netlify.app](https://mi-negocio.netlify.app)',
            'https://mi-negocio.netlify.app',
            '<a href="https://mi-negocio.netlify.app">',
            'mi-negocio.netlify.app',
          ]}
          answer="[mi-negocio.netlify.app](https://mi-negocio.netlify.app)"
          explanation="En Markdown el enlace es [texto](url). Las otras opciones o no son enlaces o son HTML, que funciona pero desentona en un README."
        />

        <TrueFalse
          id="deploy-automatico"
          index={16}
          title="Cada push publica"
          statement="Después de conectar el repositorio, cada push a main vuelve a publicar el sitio solo."
          answer={true}
          explanation="Verdadero, tanto en Netlify como en Pages. Eso también significa que un error subido a main sale al aire de inmediato: revisa antes de hacer push."
        />

        <Quiz
          id="que-es-estatico"
          index={17}
          title="¿Qué es un sitio estático?"
          options={[
            { id: 'a', label: 'Un sitio que no se puede modificar nunca' },
            { id: 'b', label: 'Un sitio de archivos HTML, CSS e imágenes que el servidor entrega tal cual, sin ejecutar nada' },
            { id: 'c', label: 'Un sitio sin animaciones' },
            { id: 'd', label: 'Un sitio que solo funciona en computador' },
          ]}
          answer="b"
          explanation="El servidor solo entrega archivos. Por eso publicarlo es tan barato y tan rápido. Cuando lleguemos a Node y Mongo, el servidor va a ejecutar código y la cosa cambia."
        />

        <Quiz
          id="revisar-movil"
          index={18}
          title="Verificación en móvil"
          prompt="¿Cuál es la mejor forma de comprobar cómo se ve tu sitio en un celular?"
          options={[
            { id: 'a', label: 'Abrir la URL pública desde tu propio teléfono' },
            { id: 'b', label: 'Achicar la ventana del navegador con el mouse' },
            { id: 'c', label: 'Preguntarle a la IA cómo se ve' },
            { id: 'd', label: 'Suponer que si se ve bien en el computador, se ve bien en el celular' },
          ]}
          answer="a"
          explanation="El teléfono real es la prueba definitiva: pantalla, dedos y conexión de verdad. El modo dispositivo de DevTools es una buena aproximación, pero no reemplaza el aparato."
        />

        <Quiz
          id="feedback-companero"
          index={19}
          title="Revisión cruzada"
          prompt="Revisas el sitio de un compañero. ¿Cuál comentario le sirve más?"
          options={[
            { id: 'a', label: '«Está chévere»' },
            { id: 'b', label: '«En 375px el menú se sale de la pantalla y hay que hacer scroll horizontal»' },
            { id: 'c', label: '«No me gusta el color»' },
            { id: 'd', label: '«Le falta más contenido»' },
          ]}
          answer="b"
          explanation="Concreto, reproducible y accionable: dice dónde, en qué tamaño y qué pasa. Ese es el tipo de feedback que se agradece en un equipo."
        />
      </Exercises>
    </TopicPage>
  );
}
