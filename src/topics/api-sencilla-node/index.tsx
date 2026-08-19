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
import { Callout, Figure, RefTable, Step, Steps, Terminal } from '../../components/visuals';

const SLUG = 'api-sencilla-node';

/** Sesión 11 del cronograma — primer servidor con Node.js. */
export default function ApiSencillaNode() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Qué pasa cuando escribes una URL">
        <p>
          Presionas Enter y en medio segundo aparece una página. En ese medio segundo tu navegador
          le pidió algo a un computador que está en otro lado, y ese computador respondió. Hoy tú
          vas a ser ese computador.
        </p>

        <Figure
          label="Diagrama: el ciclo petición y respuesta entre navegador y servidor"
          caption="El navegador pide (GET /acerca) y el servidor responde con un código de estado y un contenido. Todo lo que hagas en el backend es alguna variación de este ciclo."
        >
          <svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="60" width="170" height="70" rx="8" fill="var(--color-text)" opacity="0.07" />
            <text x="85" y="92" fontSize="14" textAnchor="middle" fill="var(--color-text)">
              Navegador
            </text>
            <text x="85" y="112" fontSize="11" textAnchor="middle" fill="var(--color-text)" opacity="0.5">
              el cliente
            </text>

            <rect x="470" y="60" width="170" height="70" rx="8" fill="var(--color-text)" opacity="0.07" />
            <text x="555" y="92" fontSize="14" textAnchor="middle" fill="var(--color-text)">
              Node.js
            </text>
            <text x="555" y="112" fontSize="11" textAnchor="middle" fill="var(--color-text)" opacity="0.5">
              tu servidor
            </text>

            <line x1="180" y1="80" x2="455" y2="80" stroke="var(--color-accent)" strokeWidth="1.3" />
            <path d="M462 80 l-8 -4.5 l0 9 z" fill="var(--color-accent)" />
            <text x="318" y="70" fontSize="12" textAnchor="middle" fill="var(--color-accent)" fontFamily="ui-monospace, monospace">
              GET /acerca
            </text>

            <line x1="455" y1="112" x2="185" y2="112" stroke="var(--color-text)" strokeWidth="1.3" opacity="0.45" />
            <path d="M178 112 l8 -4.5 l0 9 z" fill="var(--color-text)" opacity="0.6" />
            <text x="318" y="132" fontSize="12" textAnchor="middle" fill="var(--color-text)" opacity="0.6" fontFamily="ui-monospace, monospace">
              200 · &lt;h1&gt;Acerca de nosotros&lt;/h1&gt;
            </text>

            <text x="0" y="180" fontSize="12" fill="var(--color-text)" opacity="0.5">
              Un servidor es un mesero: recibe el pedido (la URL) y trae el plato (la respuesta).
            </text>
          </svg>
        </Figure>
      </Lesson>

      <Lesson title="2. Tu primer servidor, línea por línea">
        <Terminal
          titulo="servidor.js"
          lineas={[
            "const http = require('http');",
            '',
            'const servidor = http.createServer(function (peticion, respuesta) {',
            "  respuesta.writeHead(200, { 'Content-Type': 'text/html' });",
            "  respuesta.end('<h1>Hola desde mi servidor Node.js</h1>');",
            '});',
            '',
            'servidor.listen(3000, function () {',
            "  console.log('Servidor corriendo en http://localhost:3000');",
            '});',
          ]}
        />
        <RefTable
          cabeceras={['Línea', 'Qué hace']}
          filas={[
            [<code key="a">require('http')</code>, 'Trae el módulo de Node que sabe hablar HTTP'],
            [<code key="b">createServer(fn)</code>, 'Define qué hacer con cada petición que llegue'],
            [<code key="c">peticion</code>, 'Lo que pidió el cliente: la URL, el método, los datos'],
            [<code key="d">respuesta</code>, 'Lo que le vas a devolver'],
            [<code key="e">writeHead(200, …)</code>, 'El código de estado y el tipo de contenido'],
            [<code key="f">respuesta.end(…)</code>, 'Envía el contenido y cierra la conexión'],
            [<code key="g">listen(3000)</code>, 'Queda escuchando en el puerto 3000'],
          ]}
        />
        <Terminal lineas={['$ node servidor.js', '# Servidor corriendo en http://localhost:3000']} />
        <Callout tipo="ojo">
          Mientras el servidor corre, esa terminal queda ocupada — no te la devuelve el prompt. Es
          normal: está esperando peticiones. Para detenerlo, <kbd>Ctrl</kbd> + <kbd>C</kbd>.
        </Callout>
      </Lesson>

      <Lesson title="3. Varias rutas: leer peticion.url">
        <p>
          Un servidor con una sola respuesta sirve de poco. La ruta pedida llega en{' '}
          <code>peticion.url</code>, y con un <code>if / else if</code> decides qué devolver — la
          misma estructura condicional de la sesión 2, ahora del lado del servidor.
        </p>
        <Terminal
          lineas={[
            'const servidor = http.createServer(function (peticion, respuesta) {',
            "  respuesta.writeHead(200, { 'Content-Type': 'text/html' });",
            '',
            "  if (peticion.url === '/') {",
            "    respuesta.end('<h1>Inicio de tu negocio</h1>');",
            "  } else if (peticion.url === '/acerca') {",
            "    respuesta.end('<h1>Acerca de nosotros</h1>');",
            "  } else if (peticion.url === '/contacto') {",
            "    respuesta.end('<h1>Contacto</h1><p>tucorreo@negocio.com</p>');",
            '  } else {',
            '    respuesta.writeHead(404);',
            "    respuesta.end('<h1>404 - Página no encontrada</h1>');",
            '  }',
            '});',
          ]}
        />
        <Callout>
          Fíjate en el <code>else</code> final: si no pusieras nada, una ruta desconocida dejaría al
          navegador esperando para siempre. Responder 404 es parte de hacer bien el trabajo.
        </Callout>
      </Lesson>

      <Lesson title="4. Códigos de estado">
        <RefTable
          cabeceras={['Código', 'Significa', 'Cuándo lo usas']}
          filas={[
            ['200', 'Todo bien', 'La respuesta normal'],
            ['201', 'Creado', 'Cuando guardas algo nuevo (lo verás con Express)'],
            ['400', 'Petición mal hecha', 'Faltan datos o vienen mal'],
            ['401', 'No autenticado', 'No inició sesión'],
            ['404', 'No existe', 'La ruta o el recurso no está'],
            ['500', 'Error del servidor', 'Se rompió algo de tu lado'],
          ]}
        />
        <Callout>
          Los 400 son culpa de quien pide; los 500 son culpa tuya. Esa distinción te ahorra tiempo
          cuando estés depurando el backend del proyecto final.
        </Callout>
      </Lesson>

      <Lesson title="5. npm y package.json">
        <Steps>
          <Step title="Inicializa el proyecto">
            <Terminal lineas={['$ npm init -y']} />
            Crea el <code>package.json</code>: la cédula del proyecto — nombre, versión, y la lista
            de librerías que necesita.
          </Step>
          <Step title="Instala librerías cuando las necesites">
            <Terminal lineas={['$ npm install express']} />
            Se descargan en <code>node_modules/</code> y quedan anotadas en el{' '}
            <code>package.json</code>.
          </Step>
          <Step title="Nunca subas node_modules a Git">
            Esa carpeta pesa muchísimo y se puede reconstruir. Se agrega al{' '}
            <code>.gitignore</code>, y quien clone tu repo corre <code>npm install</code> y la
            recrea desde el <code>package.json</code>.
          </Step>
        </Steps>
      </Lesson>

      <Exercises>
        <Quiz
          id="que-es-servidor"
          index={1}
          title="¿Qué es un servidor?"
          options={[
            { id: 'a', label: 'Un programa que espera peticiones y devuelve respuestas' },
            { id: 'b', label: 'Una página web muy grande' },
            { id: 'c', label: 'Un tipo de base de datos' },
            { id: 'd', label: 'El navegador del usuario' },
          ]}
          answer="a"
          explanation="Un mesero: recibe pedidos y trae platos. Puede correr en tu computador (localhost) o en una máquina en internet: el papel es el mismo."
        />

        <FillBlank
          id="require-http"
          index={2}
          title="Trae el módulo"
          prompt="Primera línea de tu servidor."
          code={"const http = ___('http');"}
          options={['require', 'import', 'fetch', 'install']}
          answer="require"
          explanation="require es la forma clásica de Node para traer un módulo. Más adelante verás import, que hace lo mismo con sintaxis moderna."
        />

        <Quiz
          id="que-es-puerto"
          index={3}
          title="¿Qué es el puerto 3000?"
          options={[
            { id: 'a', label: 'La puerta por la que tu servidor escucha peticiones en esa máquina' },
            { id: 'b', label: 'La velocidad de la conexión' },
            { id: 'c', label: 'El tamaño máximo de la respuesta' },
            { id: 'd', label: 'Un identificador de usuario' },
          ]}
          answer="a"
          explanation="Una máquina tiene una dirección; los puertos son las puertas numeradas de esa dirección. Tu servidor se para en una y escucha lo que llegue ahí."
        />

        <Quiz
          id="eaddrinuse"
          index={4}
          title="Error: listen EADDRINUSE"
          prompt="Arrancas el servidor y sale ese error. ¿Qué significa?"
          options={[
            { id: 'a', label: 'El puerto 3000 ya está ocupado por otro programa' },
            { id: 'b', label: 'No tienes internet' },
            { id: 'c', label: 'Falta instalar Node' },
            { id: 'd', label: 'El archivo tiene un error de sintaxis' },
          ]}
          answer="a"
          explanation="Address already in use. O dejaste otro servidor corriendo en otra terminal, o usa otro puerto: 3001, 4000, el que quieras."
        />

        <MatchPairs
          id="empareja-servidor"
          index={5}
          title="Empareja cada pieza con su papel"
          pairs={[
            { id: 'peticion', izquierda: <code>peticion</code>, derecha: 'Lo que pidió el cliente: URL, método, datos' },
            { id: 'respuesta', izquierda: <code>respuesta</code>, derecha: 'Lo que le devuelves' },
            { id: 'writeHead', izquierda: <code>writeHead(200)</code>, derecha: 'El código de estado y las cabeceras' },
            { id: 'end', izquierda: <code>respuesta.end(...)</code>, derecha: 'Envía el contenido y cierra' },
            { id: 'listen', izquierda: <code>listen(3000)</code>, derecha: 'Queda escuchando en ese puerto' },
          ]}
          explanation="Petición y respuesta son los dos objetos que vas a manejar en todo el backend, en Node y también en Express."
        />

        <PredictOutput
          id="ruta-acerca"
          index={6}
          title="¿Qué devuelve /acerca?"
          prompt="Con el servidor de rutas de la lección, escribe el texto que se ve en el navegador (sin las etiquetas)."
          code={
            "if (peticion.url === '/') {\n  respuesta.end('<h1>Inicio de tu negocio</h1>');\n} else if (peticion.url === '/acerca') {\n  respuesta.end('<h1>Acerca de nosotros</h1>');\n}"
          }
          numbered
          answers={['Acerca de nosotros']}
          explanation="Entra por el segundo if porque la URL coincide exactamente. Ojo con eso: '/acerca/' con barra al final NO coincide con '/acerca'."
        />

        <Quiz
          id="ruta-inexistente"
          index={7}
          title="Una ruta que no existe"
          prompt="El visitante entra a /productos y tu servidor no tiene esa ruta. ¿Qué debería pasar?"
          options={[
            { id: 'a', label: 'Responder 404 con un mensaje claro' },
            { id: 'b', label: 'No responder nada' },
            { id: 'c', label: 'Redirigir siempre al inicio sin avisar' },
            { id: 'd', label: 'Apagar el servidor' },
          ]}
          answer="a"
          explanation="Sin el else final el navegador se queda esperando hasta que expira el tiempo. Un 404 le dice al cliente exactamente qué pasó."
        />

        <TrueFalse
          id="todas-igual"
          index={8}
          title="Todas las rutas responden lo mismo"
          statement="Si todas tus rutas devuelven el mismo contenido, el problema está en el if de peticion.url."
          answer={true}
          explanation="Verdadero. O te faltó leer peticion.url, o pusiste un solo end antes de los condicionales, así que la respuesta se envía siempre igual."
        />

        <MatchPairs
          id="empareja-codigos"
          index={9}
          title="Empareja el código con su significado"
          pairs={[
            { id: '200', izquierda: '200', derecha: 'Todo bien' },
            { id: '404', izquierda: '404', derecha: 'No existe' },
            { id: '400', izquierda: '400', derecha: 'La petición viene mal hecha' },
            { id: '500', izquierda: '500', derecha: 'Se rompió algo en el servidor' },
          ]}
          explanation="400 es culpa de quien pide, 500 es culpa del servidor. Saber de quién es la culpa te ahorra media hora de depuración."
        />

        <OrderSteps
          id="orden-servidor"
          index={10}
          title="Ordena tu primer servidor"
          steps={[
            { id: 'require', text: "const http = require('http');" },
            { id: 'create', text: 'const servidor = http.createServer(function (peticion, respuesta) {' },
            { id: 'head', text: "  respuesta.writeHead(200, { 'Content-Type': 'text/html' });" },
            { id: 'end', text: "  respuesta.end('<h1>Hola</h1>');" },
            { id: 'cierra', text: '});' },
            { id: 'listen', text: 'servidor.listen(3000);' },
          ]}
          explanation="Traer el módulo, definir qué hacer con cada petición, y ponerse a escuchar. Sin el listen, el servidor está definido pero no atiende a nadie."
        />

        <FillBlank
          id="listen-puerto"
          index={11}
          title="Ponlo a escuchar"
          code={'servidor.___(3000, function () {\n  console.log("corriendo");\n});'}
          options={['listen', 'start', 'run', 'open']}
          answer="listen"
          explanation="listen(puerto, callback) deja el servidor esperando. El callback se ejecuta una vez, cuando ya está listo."
        />

        <Quiz
          id="content-type"
          index={12}
          title="El Content-Type"
          prompt="¿Para qué sirve { 'Content-Type': 'text/html' }?"
          options={[
            { id: 'a', label: 'Le dice al navegador cómo interpretar lo que le mandas' },
            { id: 'b', label: 'Define el idioma de la página' },
            { id: 'c', label: 'Comprime la respuesta' },
            { id: 'd', label: 'Es obligatorio pero no hace nada' },
          ]}
          answer="a"
          explanation="Con text/html el navegador renderiza las etiquetas; con text/plain te muestra el código tal cual. Cuando devuelvas datos usarás application/json."
        />

        <TrueFalse
          id="localhost"
          index={13}
          title="localhost"
          statement="http://localhost:3000 lo puede abrir cualquier persona desde su casa."
          answer={false}
          explanation="Falso. localhost es tu propio computador. Para que otros entren hay que desplegarlo en un servidor con dirección pública — como se hizo con el sitio de la sesión 7."
        />

        <Quiz
          id="npm-init"
          index={14}
          title="¿Qué hace npm init -y?"
          options={[
            { id: 'a', label: 'Crea el package.json con los valores por defecto' },
            { id: 'b', label: 'Instala todas las librerías del mundo' },
            { id: 'c', label: 'Inicia el servidor' },
            { id: 'd', label: 'Sube el proyecto a internet' },
          ]}
          answer="a"
          explanation="El -y acepta todas las preguntas con los valores por defecto. El package.json es la cédula del proyecto: nombre, versión y dependencias."
        />

        <Quiz
          id="node-modules-git"
          index={15}
          title="node_modules y Git"
          prompt="¿Se sube node_modules al repositorio?"
          options={[
            { id: 'a', label: 'No: va en el .gitignore y se reconstruye con npm install' },
            { id: 'b', label: 'Sí, si no el proyecto no funciona en otro computador' },
            { id: 'c', label: 'Solo la mitad' },
            { id: 'd', label: 'Da igual' },
          ]}
          answer="a"
          explanation="Pesa cientos de megas y es reconstruible: el package.json ya dice qué instalar. Quien clone tu repo corre npm install y listo."
        />

        <MultiSelect
          id="que-hace-node"
          index={16}
          title="Node contra navegador"
          prompt="Marca lo que SÍ puede hacer Node.js."
          options={[
            { id: 'archivos', label: 'Leer y escribir archivos del disco' },
            { id: 'servidor', label: 'Escuchar peticiones en un puerto' },
            { id: 'bd', label: 'Conectarse a una base de datos' },
            { id: 'dom', label: 'Usar document.querySelector' },
            { id: 'alert', label: 'Mostrar un alert en pantalla' },
          ]}
          answers={['archivos', 'servidor', 'bd']}
          explanation="En Node no hay página, así que no hay document ni window ni alert. A cambio tiene acceso al sistema de archivos y a la red."
        />

        <Quiz
          id="detener-servidor"
          index={17}
          title="Detener el servidor"
          prompt="La terminal quedó ocupada mostrando «Servidor corriendo». ¿Cómo lo paras?"
          options={[
            { id: 'a', label: 'Ctrl + C en esa terminal' },
            { id: 'b', label: 'Cerrando el navegador' },
            { id: 'c', label: 'Borrando servidor.js' },
            { id: 'd', label: 'Esperando a que se detenga solo' },
          ]}
          answer="a"
          explanation="Ctrl + C corta el proceso. Cerrar el navegador no hace nada: el servidor sigue escuchando aunque nadie le pida nada."
        />

        <TrueFalse
          id="cambios-reinicio"
          index={18}
          title="Cambié el código y no pasa nada"
          statement="Si editas servidor.js mientras corre, los cambios se aplican solos al recargar el navegador."
          answer={false}
          explanation="Falso. Node ya cargó el archivo en memoria: hay que detener con Ctrl+C y volver a ejecutar. Existen herramientas que lo reinician solas, pero eso llega después."
        />

        <Quiz
          id="express-porque"
          index={19}
          title="Lo que viene"
          prompt="La próxima sesión es Express. ¿Qué problema resuelve?"
          options={[
            { id: 'a', label: 'Escribir rutas sin una cadena de if/else, con menos código y más orden' },
            { id: 'b', label: 'Hacer el servidor más bonito' },
            { id: 'c', label: 'Reemplazar a Node.js' },
            { id: 'd', label: 'Publicar el sitio en internet' },
          ]}
          answer="a"
          explanation="Express corre sobre Node. Lo que hoy hiciste con if/else se convierte en app.get('/acerca', ...), y aparecen los middleware para lo que se repite."
        />

        <MultiSelect
          id="tarea-s11"
          index={20}
          title="Tarea para la próxima sesión"
          options={[
            { id: 'ruta', label: 'Agregar una cuarta ruta con contenido de tu negocio' },
            { id: 'init', label: 'Correr npm init -y y revisar el package.json generado' },
            { id: 'react', label: 'Aprender React por tu cuenta' },
            { id: 'deploy', label: 'Publicar el servidor en internet' },
          ]}
          answers={['ruta', 'init']}
          explanation="Solo esas dos. Publicar un servidor con base de datos llega al final del curso, cuando el proyecto esté completo."
        />
      </Exercises>
    </TopicPage>
  );
}
