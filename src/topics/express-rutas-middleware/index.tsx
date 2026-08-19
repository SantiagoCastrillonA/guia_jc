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

const SLUG = 'express-rutas-middleware';

/** Sesión 12 del cronograma — Express: rutas, middleware y JSON. */
export default function ExpressRutasMiddleware() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Por qué Express y no Node puro">
        <p>
          En la sesión anterior escribiste un servidor con una cadena de <code>if / else if</code>.
          Funciona, pero con diez rutas y cuatro métodos se vuelve inmanejable. Express es una
          librería que corre <em>encima</em> de Node y organiza eso.
        </p>
        <Compare
          bien={{
            titulo: 'Con Express',
            items: [
              <code key="1">{"app.get('/productos', ...)"}</code>,
              'Una línea por ruta, con su método',
              'Middleware para lo que se repite',
              <code key="2">res.json(datos)</code>,
            ],
          }}
          mal={{
            titulo: 'Con Node puro',
            items: [
              'if (peticion.url === … && peticion.method === …)',
              'Un condicional gigante que crece sin control',
              'Leer el cuerpo de un POST a mano, pedazo por pedazo',
              'Escribir las cabeceras en cada respuesta',
            ],
          }}
        />
        <Terminal lineas={['$ npm init -y', '$ npm install express']} />
      </Lesson>

      <Lesson title="2. El servidor mínimo">
        <Terminal
          titulo="servidor.js"
          lineas={[
            "const express = require('express');",
            'const app = express();',
            '',
            '// middleware: entiende los cuerpos en JSON que llegan',
            'app.use(express.json());',
            '',
            "app.get('/', function (req, res) {",
            "  res.json({ mensaje: 'API de mi negocio' });",
            '});',
            '',
            'app.listen(3000, function () {',
            "  console.log('http://localhost:3000');",
            '});',
          ]}
        />
        <RefTable
          cabeceras={['Pieza', 'Qué es']}
          filas={[
            [<code key="a">app</code>, 'Tu aplicación: donde registras rutas y middleware'],
            [<code key="b">req</code>, 'La petición: parámetros, cuerpo, cabeceras'],
            [<code key="c">res</code>, 'La respuesta: lo que devuelves'],
            [<code key="d">res.json(...)</code>, 'Responde con JSON y pone el Content-Type solo'],
            [<code key="e">res.status(404)</code>, 'Cambia el código de estado'],
          ]}
        />
      </Lesson>

      <Lesson title="3. Los cuatro métodos de una API REST">
        <p>
          Una misma dirección puede hacer cosas distintas según el <strong>método</strong> con que
          se pida. Esa es la idea central de REST: la URL dice <em>qué</em> recurso, el método dice{' '}
          <em>qué le vas a hacer</em>.
        </p>

        <Figure
          label="Diagrama: los cuatro métodos sobre el recurso productos"
          caption="Cuatro métodos, un recurso. Con esto se arma cualquier CRUD: crear, leer, actualizar y borrar."
        >
          <svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg">
            {[
              { m: 'GET', u: '/productos', d: 'Traer la lista completa', y: 0 },
              { m: 'GET', u: '/productos/7', d: 'Traer solo el producto 7', y: 50 },
              { m: 'POST', u: '/productos', d: 'Crear uno nuevo', y: 100 },
              { m: 'PUT', u: '/productos/7', d: 'Actualizar el 7 completo', y: 150 },
            ].map(({ m, u, d, y }) => (
              <g key={m + u}>
                <rect x="0" y={y} width="72" height="34" rx="5" fill="var(--color-accent)" opacity="0.22" />
                <text x="36" y={y + 22} fontSize="12" textAnchor="middle" fontFamily="ui-monospace, monospace" fill="var(--color-accent)">
                  {m}
                </text>
                <text x="92" y={y + 22} fontSize="14" fontFamily="ui-monospace, monospace" fill="var(--color-text)">
                  {u}
                </text>
                <text x="290" y={y + 22} fontSize="13" fill="var(--color-text)" opacity="0.6">
                  {d}
                </text>
              </g>
            ))}
            <text x="0" y="202" fontSize="12" fill="var(--color-text)" opacity="0.5" fontFamily="ui-monospace, monospace">
              DELETE /productos/7 → borrar el 7
            </text>
          </svg>
        </Figure>

        <Terminal
          lineas={[
            'let productos = [{ id: 1, nombre: "Café 250g", precio: 18000 }];',
            '',
            "app.get('/productos', (req, res) => {",
            '  res.json(productos);',
            '});',
            '',
            "app.get('/productos/:id', (req, res) => {",
            '  const producto = productos.find(p => p.id === Number(req.params.id));',
            "  if (!producto) return res.status(404).json({ error: 'No existe' });",
            '  res.json(producto);',
            '});',
            '',
            "app.post('/productos', (req, res) => {",
            '  const nuevo = { id: productos.length + 1, ...req.body };',
            '  productos.push(nuevo);',
            '  res.status(201).json(nuevo);',
            '});',
          ]}
        />
        <Callout>
          <code>:id</code> es un <strong>parámetro de ruta</strong>: lo que venga ahí queda en{' '}
          <code>req.params.id</code>. Siempre llega como texto, por eso el <code>Number(...)</code>{' '}
          antes de comparar con <code>===</code>.
        </Callout>
      </Lesson>

      <Lesson title="4. Middleware: lo que pasa en el medio">
        <p>
          Un middleware es una función que se ejecuta <em>entre</em> que llega la petición y que
          responde tu ruta. Recibe <code>req</code>, <code>res</code> y <code>next</code>: hace lo
          suyo y llama a <code>next()</code> para dejar pasar.
        </p>
        <Terminal
          lineas={[
            '// registra cada petición que llega',
            'app.use((req, res, next) => {',
            '  console.log(`${req.method} ${req.url}`);',
            '  next();',
            '});',
          ]}
        />
        <RefTable
          cabeceras={['Middleware', 'Para qué sirve']}
          filas={[
            [<code key="a">express.json()</code>, 'Convierte el cuerpo JSON de la petición en req.body'],
            ['Logger', 'Deja rastro de cada petición: método, ruta, hora'],
            ['Autenticación', 'Revisa la sesión y corta con 401 si no hay'],
            ['Manejo de errores', 'Atrapa lo que falle y responde 500 sin exponer detalles'],
          ]}
        />
        <Callout tipo="ojo">
          Si se te olvida <code>next()</code>, la petición se queda colgada ahí y el navegador
          espera para siempre. Y si se te olvida <code>app.use(express.json())</code>,{' '}
          <code>req.body</code> llega <code>undefined</code> — los dos errores más comunes de esta
          sesión.
        </Callout>
      </Lesson>

      <Lesson title="5. Probar la API sin frontend">
        <Steps>
          <Step title="Instala Thunder Client o Postman">
            Thunder Client es una extensión de VS Code: no tienes que salir del editor.
          </Step>
          <Step title="Prueba un GET">
            Método GET, URL <code>http://localhost:3000/productos</code>, Send. Deberías ver el JSON
            de la lista.
          </Step>
          <Step title="Prueba un POST">
            Método POST, la misma URL, pestaña Body → JSON:
            <Terminal lineas={['{ "nombre": "Café 500g", "precio": 32000 }']} />
            Deberías recibir 201 y el objeto creado con su id.
          </Step>
          <Step title="Prueba el caso que falla">
            <code>GET /productos/999</code> debe devolver 404 con un mensaje claro. Probar lo que
            falla es tan importante como probar lo que funciona.
          </Step>
        </Steps>
      </Lesson>

      <Exercises>
        <Quiz
          id="por-que-express"
          index={1}
          title="¿Qué es Express?"
          options={[
            { id: 'a', label: 'Una librería sobre Node que organiza rutas, middleware y respuestas' },
            { id: 'b', label: 'Un lenguaje que reemplaza a JavaScript' },
            { id: 'c', label: 'Una base de datos' },
            { id: 'd', label: 'Un servicio de hosting' },
          ]}
          answer="a"
          explanation="Corre encima de Node. Lo que hiciste con if/else se vuelve app.get(...), y aparecen los middleware para lo que se repite en todas las rutas."
        />

        <FillBlank
          id="express-json"
          index={2}
          title="Entender el cuerpo JSON"
          prompt="Sin esta línea, req.body llega undefined en los POST."
          code={'const app = express();\napp.use(express.___());'}
          options={['json', 'body', 'parse', 'post']}
          answer="json"
          explanation="express.json() es un middleware que lee el cuerpo de la petición y lo convierte en un objeto disponible en req.body."
        />

        <MatchPairs
          id="empareja-metodos"
          index={3}
          title="Empareja el método con su acción"
          pairs={[
            { id: 'get', izquierda: 'GET', derecha: 'Leer datos' },
            { id: 'post', izquierda: 'POST', derecha: 'Crear algo nuevo' },
            { id: 'put', izquierda: 'PUT', derecha: 'Actualizar lo que ya existe' },
            { id: 'delete', izquierda: 'DELETE', derecha: 'Borrar' },
          ]}
          explanation="Los cuatro verbos del CRUD. La URL dice sobre qué recurso; el método dice qué le haces."
        />

        <Quiz
          id="params-id"
          index={4}
          title="El parámetro de ruta"
          prompt="En app.get('/productos/:id', ...), ¿dónde queda el valor del id?"
          options={[
            { id: 'a', label: 'req.params.id' },
            { id: 'b', label: 'req.body.id' },
            { id: 'c', label: 'req.query.id' },
            { id: 'd', label: 'res.id' },
          ]}
          answer="a"
          explanation="Los dos puntos declaran un parámetro de ruta y su valor llega en req.params. El body es para POST y PUT; query es lo que va después del ?."
        />

        <TrueFalse
          id="params-texto"
          index={5}
          title="El tipo del parámetro"
          statement="req.params.id llega siempre como texto, aunque en la URL se vea un número."
          answer={true}
          explanation="Verdadero. Por eso hay que convertirlo con Number(req.params.id) antes de comparar con ===, o la comparación siempre dará false."
        />

        <PredictOutput
          id="status-code-post"
          index={6}
          title="El código de un POST exitoso"
          prompt="Escribe solo el número que se suele devolver al crear un recurso."
          code={'app.post("/productos", (req, res) => {\n  productos.push(nuevo);\n  res.status(___).json(nuevo);\n});'}
          answers={['201']}
          explanation="201 Created. Funciona con 200, pero 201 le dice al cliente exactamente qué pasó: se creó algo nuevo."
        />

        <Quiz
          id="res-json"
          index={7}
          title="res.json()"
          prompt="¿Qué hace res.json({ ok: true }) además de enviar el objeto?"
          options={[
            { id: 'a', label: 'Pone el Content-Type en application/json automáticamente' },
            { id: 'b', label: 'Guarda el objeto en la base de datos' },
            { id: 'c', label: 'Lo imprime en la consola del cliente' },
            { id: 'd', label: 'Cierra el servidor' },
          ]}
          answer="a"
          explanation="Convierte el objeto a JSON y pone la cabecera correcta. Con res.send() de un objeto pasa algo parecido, pero json() es explícito."
        />

        <Quiz
          id="middleware-next"
          index={8}
          title="Se me olvidó next()"
          prompt="Tu middleware de logging no llama a next(). ¿Qué pasa?"
          options={[
            { id: 'a', label: 'La petición se queda colgada y el cliente espera indefinidamente' },
            { id: 'b', label: 'Express lo llama solo' },
            { id: 'c', label: 'Se salta el middleware' },
            { id: 'd', label: 'El servidor se cae' },
          ]}
          answer="a"
          explanation="next() pasa el control al siguiente eslabón. Sin él la petición muere ahí: no hay respuesta y el navegador espera hasta que expira."
        />

        <FillBlank
          id="middleware-firma"
          index={9}
          title="La firma de un middleware"
          code={'app.use((req, res, ___) => {\n  console.log(req.method, req.url);\n  next();\n});'}
          options={['next', 'done', 'end', 'callback']}
          answer="next"
          explanation="Tres parámetros: petición, respuesta y la función que continúa la cadena."
        />

        <MultiSelect
          id="usos-middleware"
          index={10}
          title="¿Para qué sirve un middleware?"
          prompt="Marca los usos reales."
          options={[
            { id: 'log', label: 'Registrar cada petición que llega' },
            { id: 'auth', label: 'Verificar la sesión antes de dejar pasar' },
            { id: 'json', label: 'Convertir el cuerpo JSON en req.body' },
            { id: 'errores', label: 'Atrapar errores y responder 500' },
            { id: 'css', label: 'Aplicar estilos a la página' },
          ]}
          answers={['log', 'auth', 'json', 'errores']}
          explanation="Todo lo que se repite en varias rutas. El CSS es del frontend: el servidor no sabe de estilos."
        />

        <Quiz
          id="body-undefined"
          index={11}
          title="req.body llega undefined"
          prompt="Mandas un POST con JSON y en el servidor req.body es undefined. ¿Qué falta?"
          options={[
            { id: 'a', label: 'app.use(express.json()) antes de las rutas' },
            { id: 'b', label: 'Instalar Postman' },
            { id: 'c', label: 'Cambiar el puerto' },
            { id: 'd', label: 'Usar GET en vez de POST' },
          ]}
          answer="a"
          explanation="Sin ese middleware el cuerpo llega como bytes sin procesar. Y ojo: tiene que registrarse ANTES de las rutas que lo usan."
        />

        <OrderSteps
          id="orden-express"
          index={12}
          title="Ordena el archivo del servidor"
          steps={[
            { id: 'require', text: "const express = require('express');" },
            { id: 'app', text: 'const app = express();' },
            { id: 'mw', text: 'app.use(express.json());' },
            { id: 'rutas', text: "app.get('/productos', ...) y las demás rutas" },
            { id: 'listen', text: 'app.listen(3000)' },
          ]}
          explanation="El middleware antes de las rutas —si va después, las rutas ya se ejecutaron sin él— y listen al final."
        />

        <Quiz
          id="404-express"
          index={13}
          title="Responder que no existe"
          prompt="El producto pedido no está en la lista. ¿Cómo respondes?"
          options={[
            { id: 'a', label: "res.status(404).json({ error: 'No existe' })" },
            { id: 'b', label: 'res.json(null)' },
            { id: 'c', label: 'No responder nada' },
            { id: 'd', label: "res.status(200).json({ error: 'No existe' })" },
          ]}
          answer="a"
          explanation="El código de estado es parte de la respuesta. Devolver 200 con un error adentro obliga al cliente a adivinar leyendo el contenido."
        />

        <TrueFalse
          id="return-en-ruta"
          index={14}
          title="El return del early exit"
          statement="En «if (!producto) return res.status(404).json(...)», el return evita que se ejecute el resto de la ruta."
          answer={true}
          explanation="Verdadero. Sin ese return, el código seguiría e intentaría responder otra vez: «Cannot set headers after they are sent». Un clásico."
        />

        <Quiz
          id="rest-que-es"
          index={15}
          title="¿Qué significa que una API sea REST?"
          options={[
            { id: 'a', label: 'Que las URLs identifican recursos y el método dice qué hacer con ellos' },
            { id: 'b', label: 'Que el servidor descansa entre peticiones' },
            { id: 'c', label: 'Que está escrita en Express' },
            { id: 'd', label: 'Que devuelve HTML' },
          ]}
          answer="a"
          explanation="/productos es el recurso; GET, POST, PUT y DELETE son las acciones. Es una convención, y seguirla hace que cualquier desarrollador entienda tu API sin manual."
        />

        <MultiSelect
          id="urls-rest"
          index={16}
          title="URLs bien diseñadas"
          prompt="Marca las que siguen la convención REST."
          options={[
            { id: 'a', label: 'GET /productos' },
            { id: 'b', label: 'GET /productos/7' },
            { id: 'c', label: 'GET /traerTodosLosProductos' },
            { id: 'd', label: 'POST /productos' },
            { id: 'e', label: 'GET /borrarProducto/7' },
          ]}
          answers={['a', 'b', 'd']}
          explanation="El sustantivo va en la URL y el verbo en el método. «GET /borrarProducto» es peligroso además: un GET nunca debería modificar datos."
        />

        <Quiz
          id="probar-api"
          index={17}
          title="Probar sin frontend"
          prompt="¿Cómo pruebas un POST si todavía no tienes página?"
          options={[
            { id: 'a', label: 'Con Thunder Client o Postman' },
            { id: 'b', label: 'Escribiendo la URL en el navegador' },
            { id: 'c', label: 'No se puede hasta tener frontend' },
            { id: 'd', label: 'Con git push' },
          ]}
          answer="a"
          explanation="La barra del navegador solo hace GET. Para POST, PUT y DELETE con cuerpo necesitas un cliente de API."
        />

        <TrueFalse
          id="memoria-se-pierde"
          index={18}
          title="Datos en memoria"
          statement="Si guardas los productos en un array de JavaScript, siguen ahí después de reiniciar el servidor."
          answer={false}
          explanation="Falso. Al reiniciar, el array vuelve a su estado inicial. Por eso la próxima sesión es MongoDB: para que los datos sobrevivan."
        />

        <Quiz
          id="orden-rutas"
          index={19}
          title="El orden de las rutas importa"
          prompt="Tienes app.get('/productos/:id') antes de app.get('/productos/destacados'). ¿Qué pasa al pedir /productos/destacados?"
          options={[
            { id: 'a', label: 'Entra por la primera, con id = "destacados"' },
            { id: 'b', label: 'Entra por la segunda, que es más específica' },
            { id: 'c', label: 'Responde 404' },
            { id: 'd', label: 'Express lanza un error al arrancar' },
          ]}
          answer="a"
          explanation="Express prueba en orden y se queda con la primera que coincida. Las rutas específicas van antes que las que tienen parámetros."
        />

        <MultiSelect
          id="checklist-api"
          index={20}
          title="Tu API está lista si…"
          options={[
            { id: 'crud', label: 'Tiene GET, POST, PUT y DELETE del recurso' },
            { id: '404', label: 'Responde 404 cuando el recurso no existe' },
            { id: 'json', label: 'Devuelve JSON con res.json()' },
            { id: 'probada', label: 'La probaste con Thunder Client, incluidos los casos que fallan' },
            { id: 'css', label: 'Tiene estilos aplicados' },
          ]}
          answers={['crud', '404', 'json', 'probada']}
          explanation="Una API no tiene estilos: devuelve datos. La parte visual la pone el frontend que la consume."
        />
      </Exercises>
    </TopicPage>
  );
}
