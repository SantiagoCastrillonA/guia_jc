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

const SLUG = 'proyecto-backend';

/** Sesión 23 del cronograma — desarrollo del backend del proyecto. */
export default function ProyectoBackend() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Dónde estás y qué falta">
        <p>
          Con el plan de la sesión anterior en la mano, hoy se construye el motor: rutas, base de
          datos y autenticación del proyecto real. Ya hiciste cada pieza por separado; esta vez van
          juntas y con tus propios datos.
        </p>
        <Figure
          label="Diagrama: las capas del backend"
          caption="Una petición atraviesa las capas de arriba abajo. Cada una tiene una sola responsabilidad, y por eso se pueden arreglar por separado."
        >
          <svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg">
            {[
              { t: 'Rutas', d: 'Reciben la petición y responden', y: 0 },
              { t: 'Middleware', d: 'Sesión, validación, registro', y: 48 },
              { t: 'Modelos', d: 'La forma de los datos y sus reglas', y: 96 },
              { t: 'MongoDB', d: 'El almacenamiento', y: 144 },
            ].map(({ t, d, y }, i) => (
              <g key={t}>
                <rect
                  x={i * 18}
                  y={y}
                  width={620 - i * 36}
                  height="38"
                  rx="7"
                  fill="var(--color-accent)"
                  opacity={0.2 - i * 0.03}
                />
                <text x={i * 18 + 16} y={y + 24} fontSize="14" fill="var(--color-text)">
                  {t}
                </text>
                <text x={i * 18 + 120} y={y + 24} fontSize="12.5" fill="var(--color-text)" opacity="0.6">
                  {d}
                </text>
              </g>
            ))}
          </svg>
        </Figure>
      </Lesson>

      <Lesson title="2. El orden en que conviene construir">
        <Steps>
          <Step title="Modelos primero">
            Sin modelos no hay nada que guardar. Empieza por el recurso central de tu negocio:
            productos, servicios, citas.
          </Step>
          <Step title="Una ruta de prueba y datos de ejemplo">
            <code>GET /api/productos</code> devolviendo tres registros. Con eso ya puedes verificar
            la conexión completa.
          </Step>
          <Step title="Autenticación">
            Registro, login y el middleware de sesión. Todo lo que sigue depende de saber quién es
            el usuario.
          </Step>
          <Step title="El resto del CRUD, protegido">
            Crear, actualizar y borrar solo para el admin; leer, para cualquiera.
          </Step>
          <Step title="Las rutas propias de tu negocio">
            Pedidos, mensajes de contacto, el asistente de IA. Aquí es donde tu proyecto deja de
            parecerse al del vecino.
          </Step>
        </Steps>
      </Lesson>

      <Lesson title="3. Errores: responde siempre igual">
        <p>
          Una API que a veces responde <code>{'{ error }'}</code>, a veces un texto y a veces nada
          obliga al frontend a adivinar. Define un formato y respétalo en todas las rutas.
        </p>
        <Terminal
          lineas={[
            '// middleware de errores, al final de servidor.js',
            'app.use((err, req, res, next) => {',
            '  console.error(err);',
            "  if (err.name === 'ValidationError') {",
            '    return res.status(400).json({ error: err.message });',
            '  }',
            "  res.status(500).json({ error: 'Error del servidor' });",
            '});',
          ]}
        />
        <Compare
          bien={{
            titulo: 'Errores bien manejados',
            items: [
              'Un formato de respuesta para todos',
              'El código de estado correcto',
              'Mensaje útil para el usuario',
              'El detalle técnico en los logs del servidor',
            ],
          }}
          mal={{
            titulo: 'Errores mal manejados',
            items: [
              'Devolver 200 con un error adentro',
              'Mandar el stack trace al cliente',
              'Un genérico «error» sin más',
              'Que el proceso se caiga y tumbe la app',
            ],
          }}
        />
        <Callout tipo="ojo">
          Nunca devuelvas el detalle técnico al cliente: los mensajes de error de la base pueden
          revelar nombres de campos, rutas de archivos y hasta credenciales. Al log completo, al
          usuario lo justo.
        </Callout>
      </Lesson>

      <Lesson title="4. Seguridad mínima del proyecto">
        <RefTable
          cabeceras={['Medida', 'Por qué']}
          filas={[
            ['Contraseñas con bcrypt', 'Nunca en texto plano, ni siquiera en desarrollo'],
            ['Secretos en .env', 'Fuera del repositorio, siempre'],
            ['Validar todo lo que llega', 'El cliente puede mandar cualquier cosa'],
            ['Filtrar por dueño en cada consulta', 'Que nadie vea los datos de otro'],
            ['Rate limit en login y en la IA', 'Frena la fuerza bruta y el gasto descontrolado'],
            ['helmet', 'Cabeceras de seguridad de una línea'],
            ['HTTPS en producción', 'Sin él las contraseñas viajan en claro'],
          ]}
        />
      </Lesson>

      <Lesson title="5. Probar mientras construyes">
        <p>
          Cada ruta que termines, pruébala con Thunder Client antes de seguir. Y prueba los casos
          que fallan, no solo el feliz:
        </p>
        <Terminal
          lineas={[
            '# el caso que funciona',
            'POST /api/productos con datos válidos → 201',
            '',
            '# los que deben fallar bien',
            'POST /api/productos sin nombre        → 400',
            'POST /api/productos sin sesión        → 401',
            'POST /api/productos como estudiante   → 403',
            'GET  /api/productos/999999            → 404',
          ]}
        />
        <Callout>
          Si esas cinco respuestas son las correctas, tu ruta está bien hecha. La mayoría de los
          problemas en la demo final salen de casos que nunca se probaron.
        </Callout>
      </Lesson>

      <Exercises>
        <OrderSteps
          id="orden-construir"
          index={1}
          title="Ordena la construcción del backend"
          steps={[
            { id: 'modelos', text: 'Crear los modelos con sus validaciones' },
            { id: 'lectura', text: 'Ruta de lectura y datos de prueba' },
            { id: 'auth', text: 'Registro, login y middleware de sesión' },
            { id: 'crud', text: 'Resto del CRUD, protegido por rol' },
            { id: 'negocio', text: 'Las rutas propias del negocio' },
          ]}
          explanation="La autenticación antes del CRUD protegido: si construyes las rutas primero y la sesión después, toca volver a tocar todas."
        />

        <Quiz
          id="formato-error"
          index={2}
          title="Un formato de error"
          prompt="¿Por qué conviene que todas las rutas devuelvan el error igual?"
          options={[
            { id: 'a', label: 'Para que el frontend lo maneje en un solo lugar y no adivine' },
            { id: 'b', label: 'Porque Express lo exige' },
            { id: 'c', label: 'Para que la API sea más rápida' },
            { id: 'd', label: 'Por estética' },
          ]}
          answer="a"
          explanation="Con un formato fijo, el frontend escribe el manejo una vez. Con formatos distintos por ruta, cada pantalla necesita su propio código."
        />

        <TrueFalse
          id="stack-al-cliente"
          index={3}
          title="El detalle del error"
          statement="Conviene mandarle el stack trace al cliente para que sea más fácil depurar."
          answer={false}
          explanation="Falso. Puede revelar rutas de archivos, nombres de campos y datos de conexión. El detalle va a los logs del servidor; al cliente, un mensaje útil y nada más."
        />

        <MatchPairs
          id="empareja-codigos-proyecto"
          index={4}
          title="Empareja el caso con su código"
          pairs={[
            { id: '400', izquierda: 'Falta un campo obligatorio', derecha: '400' },
            { id: '401', izquierda: 'No inició sesión', derecha: '401' },
            { id: '403', izquierda: 'No es admin', derecha: '403' },
            { id: '404', izquierda: 'El producto no existe', derecha: '404' },
            { id: '500', izquierda: 'Se cayó la base de datos', derecha: '500' },
          ]}
          explanation="Estos cinco cubren casi todo tu proyecto. Usarlos bien le permite al frontend reaccionar distinto en cada caso."
        />

        <MultiSelect
          id="seguridad-minima"
          index={5}
          title="Seguridad mínima"
          prompt="Marca lo que tu backend debe tener sí o sí."
          options={[
            { id: 'bcrypt', label: 'Contraseñas hasheadas con bcrypt' },
            { id: 'env', label: 'Secretos en .env, fuera del repositorio' },
            { id: 'valida', label: 'Validación de todo lo que llega del cliente' },
            { id: 'dueno', label: 'Filtro por dueño en las consultas' },
            { id: 'rate', label: 'Rate limit en login' },
            { id: 'ofusca', label: 'El código minificado para que no lo entiendan' },
          ]}
          answers={['bcrypt', 'env', 'valida', 'dueno', 'rate']}
          explanation="Ofuscar no es seguridad: solo hace el código difícil de leer para ti. Las otras cinco son medidas reales."
        />

        <Quiz
          id="probar-casos-fallo"
          index={6}
          title="Probar lo que falla"
          prompt="Terminaste POST /api/productos y funciona con datos válidos. ¿Qué más pruebas?"
          options={[
            { id: 'a', label: 'Sin campos, sin sesión, con un usuario sin permiso y con un id inexistente' },
            { id: 'b', label: 'Nada más, ya funciona' },
            { id: 'c', label: 'Solo que se vea bien en el navegador' },
            { id: 'd', label: 'Que la respuesta llegue rápido' },
          ]}
          answer="a"
          explanation="Los casos de fallo son la mitad del trabajo. Casi todos los sustos de la demo final vienen de un camino que nunca se probó."
        />

        <FillBlank
          id="middleware-errores"
          index={7}
          title="El middleware de errores"
          prompt="Se distingue de los demás por la cantidad de parámetros."
          code={'app.use((___, req, res, next) => {\n  console.error(err);\n  res.status(500).json({ error: "Error del servidor" });\n});'}
          options={['err', 'error', 'e', 'exception']}
          answer="err"
          explanation="Cuatro parámetros y el primero es el error: así lo reconoce Express como manejador de errores. Con tres, sería un middleware normal."
        />

        <Quiz
          id="orden-middleware-error"
          index={8}
          title="¿Dónde va el manejador de errores?"
          options={[
            { id: 'a', label: 'Al final, después de todas las rutas' },
            { id: 'b', label: 'Al principio, antes que todo' },
            { id: 'c', label: 'En medio de las rutas' },
            { id: 'd', label: 'Da lo mismo' },
          ]}
          answer="a"
          explanation="Es la última red: atrapa lo que se escapó de las rutas anteriores. Si va al principio, no hay nada de qué atrapar todavía."
        />

        <TrueFalse
          id="rol-admin"
          index={9}
          title="Roles"
          statement="Leer el catálogo puede ser público, pero crear y borrar productos debe exigir rol de admin."
          answer={true}
          explanation="Verdadero. Es la separación natural: cualquiera ve la tienda, solo el dueño la administra."
        />

        <Quiz
          id="donde-validar-rol"
          index={10}
          title="Verificar el rol"
          prompt="¿Dónde se verifica que el usuario sea admin?"
          options={[
            { id: 'a', label: 'En el backend, en un middleware antes de la ruta' },
            { id: 'b', label: 'En el frontend, escondiendo el botón' },
            { id: 'c', label: 'En la base de datos' },
            { id: 'd', label: 'En el CSS' },
          ]}
          answer="a"
          explanation="Esconder el botón es cortesía visual. La verificación real va en el servidor, porque la petición se puede mandar sin pasar por tu interfaz."
        />

        <MultiSelect
          id="rutas-negocio"
          index={11}
          title="Las rutas propias del negocio"
          prompt="Además del CRUD y la autenticación, ¿qué suele necesitar un emprendimiento?"
          options={[
            { id: 'pedidos', label: 'POST /pedidos para registrar una compra' },
            { id: 'mensajes', label: 'POST /mensajes del formulario de contacto' },
            { id: 'chat', label: 'POST /chat del asistente de IA' },
            { id: 'stats', label: 'GET /admin/resumen con las cifras del panel' },
            { id: 'css', label: 'GET /estilos para servir el CSS' },
          ]}
          answers={['pedidos', 'mensajes', 'chat', 'stats']}
          explanation="El CSS lo sirve el servidor de archivos estáticos, no una ruta de la API. Las otras cuatro son lógica de negocio."
        />

        <Quiz
          id="cuando-500"
          index={12}
          title="Un 500 en producción"
          prompt="Tu API devuelve 500. ¿Dónde miras primero?"
          options={[
            { id: 'a', label: 'En los logs del servidor: ahí está el error completo' },
            { id: 'b', label: 'En la consola del navegador' },
            { id: 'c', label: 'En el CSS' },
            { id: 'd', label: 'En el repositorio de GitHub' },
          ]}
          answer="a"
          explanation="El 500 significa que se rompió algo del lado del servidor, y el detalle solo está allá. Por eso el console.error del manejador de errores no es opcional."
        />

        <FillBlank
          id="helmet"
          index={13}
          title="Cabeceras de seguridad"
          code={"const helmet = require('helmet');\napp.use(___());"}
          options={['helmet', 'cors', 'express.json', 'morgan']}
          answer="helmet"
          explanation="helmet agrega un conjunto de cabeceras de seguridad razonables. Es una línea y sube el piso de protección sin configurar nada."
        />

        <TrueFalse
          id="validar-en-dos"
          index={14}
          title="Validación doble"
          statement="Validar en el modelo de Mongoose hace innecesario validar en la ruta."
          answer={false}
          explanation="Falso. El modelo protege la base; la ruta puede rechazar antes y dar un mensaje más claro. Y hay validaciones —como el permiso— que el modelo no conoce."
        />

        <OrderSteps
          id="orden-peticion"
          index={15}
          title="Ordena el recorrido de una petición"
          steps={[
            { id: 'llega', text: 'Llega la petición al servidor' },
            { id: 'json', text: 'express.json() convierte el cuerpo' },
            { id: 'auth', text: 'El middleware de sesión identifica al usuario' },
            { id: 'ruta', text: 'La ruta valida y ejecuta la lógica' },
            { id: 'modelo', text: 'El modelo valida y habla con Mongo' },
            { id: 'respuesta', text: 'Se devuelve el JSON con su código de estado' },
          ]}
          explanation="Conocer este recorrido es lo que te permite saber en qué capa buscar cuando algo falla."
        />

        <Quiz
          id="datos-semilla"
          index={16}
          title="Datos iniciales"
          prompt="Necesitas que la base arranque con un usuario admin y algunos productos. ¿Qué haces?"
          options={[
            { id: 'a', label: 'Un script de carga inicial que se corre una vez' },
            { id: 'b', label: 'Insertarlos a mano cada vez que se reinicia' },
            { id: 'c', label: 'Escribirlos fijos en el código' },
            { id: 'd', label: 'No hacer nada' },
          ]}
          answer="a"
          explanation="Un script reproducible: cualquiera del equipo puede levantar el proyecto con datos coherentes en un comando."
        />

        <MultiSelect
          id="commits-backend"
          index={17}
          title="Commits durante esta etapa"
          prompt="¿Cuándo hacer commit?"
          options={[
            { id: 'ruta', label: 'Cuando una ruta queda funcionando y probada' },
            { id: 'modelo', label: 'Cuando terminas un modelo' },
            { id: 'fix', label: 'Cuando arreglas un error' },
            { id: 'todo', label: 'Solo al final del día, todo junto' },
          ]}
          answers={['ruta', 'modelo', 'fix']}
          explanation="Commits por pieza terminada. Un commit gigante al final del día es imposible de revisar y de revertir si algo salió mal."
        />

        <Quiz
          id="frontend-espera"
          index={18}
          title="El frontend va más rápido"
          prompt="Tu compañero terminó la pantalla y tu endpoint no está listo. ¿Qué hacen?"
          options={[
            { id: 'a', label: 'Que trabaje con datos falsos que tengan la forma acordada del JSON' },
            { id: 'b', label: 'Que espere sin hacer nada' },
            { id: 'c', label: 'Que escriba él el backend también' },
            { id: 'd', label: 'Cambiar el plan' },
          ]}
          answer="a"
          explanation="Por eso se acuerda la forma del JSON al planear: con datos falsos con esa forma, al conectar el endpoint real todo encaja."
        />

        <TrueFalse
          id="probar-antes-front"
          index={19}
          title="Probar la API sola"
          statement="Conviene probar cada endpoint con Thunder Client antes de conectarlo al frontend."
          answer={true}
          explanation="Verdadero. Si falla con el frontend conectado, no sabes de qué lado está el problema. Probando la API sola aíslas la causa."
        />

        <MultiSelect
          id="checklist-backend"
          index={20}
          title="Checklist del backend"
          options={[
            { id: 'crud', label: 'CRUD completo del recurso principal' },
            { id: 'auth', label: 'Registro, login y sesión funcionando' },
            { id: 'roles', label: 'Rutas de administración protegidas por rol' },
            { id: 'errores', label: 'Errores con formato y códigos correctos' },
            { id: 'env', label: 'Secretos en .env' },
            { id: 'probado', label: 'Cada ruta probada, incluidos los casos de fallo' },
          ]}
          answers={['crud', 'auth', 'roles', 'errores', 'env', 'probado']}
          explanation="Las seis. Con eso el motor está listo y la próxima sesión se puede dedicar al despliegue y los detalles."
        />
      </Exercises>
    </TopicPage>
  );
}
