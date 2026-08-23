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

const SLUG = 'proyecto-cierre-deploy';

/** Sesión 24 del cronograma — cierre y despliegue final. */
export default function ProyectoCierreDeploy() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Publicar una app full stack">
        <p>
          Publicar un sitio estático era copiar archivos. Ahora hay tres cosas que tienen que vivir
          en algún lado y hablarse entre sí:
        </p>
        <Figure
          label="Diagrama: las tres piezas de una app full stack en producción"
          caption="El frontend son archivos que se sirven; el backend es un proceso que corre; la base es un servicio que persiste. Cada uno tiene su forma de desplegarse."
        >
          <svg viewBox="0 0 640 190" xmlns="http://www.w3.org/2000/svg">
            {[
              { t: 'Frontend', d: 'Archivos estáticos del build', h: 'Netlify, Vercel, nginx', x: 0 },
              { t: 'Backend', d: 'Un proceso Node corriendo', h: 'Render, Railway, una VM', x: 218 },
              { t: 'Base de datos', d: 'Un servicio que guarda', h: 'MongoDB Atlas', x: 436 },
            ].map(({ t, d, h, x }) => (
              <g key={t}>
                <rect x={x} y="30" width="204" height="110" rx="10" fill="var(--color-text)" opacity="0.06" />
                <rect x={x} y="30" width="204" height="2" rx="1" fill="var(--color-accent)" opacity="0.8" />
                <text x={x + 16} y="60" fontSize="14" fill="var(--color-text)">
                  {t}
                </text>
                <text x={x + 16} y="84" fontSize="12" fill="var(--color-text)" opacity="0.6">
                  {d}
                </text>
                <text x={x + 16} y="112" fontSize="11.5" fill="var(--color-accent-text)" opacity="0.9">
                  {h}
                </text>
              </g>
            ))}
            <text x="0" y="172" fontSize="12" fill="var(--color-text)" opacity="0.5">
              Cada pieza necesita saber dónde está la siguiente: variables de entorno, no direcciones fijas en el código.
            </text>
          </svg>
        </Figure>
      </Lesson>

      <Lesson title="2. Variables de entorno: nada de direcciones fijas">
        <p>
          En tu computador el backend está en <code>localhost:3000</code>. En producción está en
          otro lado. Si esa dirección está escrita en el código, cada despliegue obliga a editarlo.
        </p>
        <Compare
          bien={{
            titulo: 'Configurable',
            items: [
              'La URL de la API sale de una variable de entorno',
              'La cadena de Mongo también',
              'El mismo código funciona en local y en producción',
              'Cambiar de servidor no toca el código',
            ],
          }}
          mal={{
            titulo: 'Fijo en el código',
            items: [
              'http://localhost:3000 escrito en un componente',
              'Hay que editar y volver a compilar para desplegar',
              'Alguien olvida cambiarlo de vuelta',
              'La demo apunta a un servidor que no existe',
            ],
          }}
        />
        <Terminal
          lineas={[
            '# backend: .env en el servidor',
            'MONGO_URL=...',
            'JWT_SECRET=...',
            'IA_API_KEY=...',
            'COOKIE_SECURE=true',
            '',
            '# frontend: variable de build (Vite)',
            'VITE_API_URL=https://api.mi-negocio.com',
          ]}
        />
        <Callout tipo="ojo">
          En el frontend, las variables se <strong>incrustan en el build</strong>: cualquiera las
          puede leer en el navegador. Sirven para la URL de la API, nunca para una clave. Los
          secretos son siempre del backend.
        </Callout>
      </Lesson>

      <Lesson title="3. Checklist de producción">
        <RefTable
          cabeceras={['Área', 'Qué revisar']}
          filas={[
            ['HTTPS', 'Certificado válido y todo el tráfico redirigido'],
            ['Cookies', 'secure activado cuando el sitio va por HTTPS'],
            ['CORS', 'Solo tu dominio, no cualquiera'],
            ['Base de datos', 'Con usuario y contraseña, no abierta a internet'],
            ['Secretos', 'En el servidor, nunca en el repositorio'],
            ['Errores', 'Sin stack traces hacia el cliente'],
            ['Rutas de la SPA', 'El servidor devuelve index.html en cualquier ruta'],
            ['Logs', 'Que quede rastro de los errores para poder revisarlos'],
          ]}
        />
      </Lesson>

      <Lesson title="4. El día del despliegue, paso a paso">
        <Steps>
          <Step title="Congela el alcance">
            No se agregan funcionalidades nuevas hoy. Solo se arregla lo roto: cada cosa nueva es un
            riesgo nuevo a horas de la entrega.
          </Step>
          <Step title="Prueba el build de producción en local">
            <Terminal lineas={['$ npm run build', '$ npm run preview']} />
            El build se comporta distinto al modo desarrollo: aquí aparecen los errores de rutas y
            de variables.
          </Step>
          <Step title="Despliega el backend y comprueba su salud">
            Una ruta simple como <code>/api/health</code> te confirma que está vivo antes de mirar
            nada más.
          </Step>
          <Step title="Despliega el frontend apuntando a la API real">
            Y revisa la pestaña Network: si sigue llamando a localhost, la variable no se aplicó.
          </Step>
          <Step title="Recorre la app completa en la URL pública">
            Registro, login, crear, editar, borrar, cerrar sesión. En el celular y en el computador.
          </Step>
          <Step title="Actualiza el README y haz el commit final">
            URL del demo, cómo correrlo, y credenciales de una cuenta de prueba si el evaluador las
            necesita.
          </Step>
        </Steps>
      </Lesson>

      <Lesson title="5. Cuando algo falla en producción">
        <RefTable
          cabeceras={['Síntoma', 'Dónde mirar']}
          filas={[
            ['Página en blanco', 'Consola del navegador: casi siempre un error de JavaScript o una ruta de assets'],
            ['404 al recargar en una ruta interna', 'Falta el fallback a index.html en el servidor'],
            ['Las peticiones fallan por CORS', 'El origen permitido en el backend'],
            ['Login funciona pero se pierde la sesión', 'La cookie: secure, sameSite y el dominio'],
            ['Todo devuelve 500', 'Los logs del backend: probablemente falta una variable de entorno'],
            ['Funciona en local y no publicado', 'Rutas relativas, mayúsculas en nombres, variables de entorno'],
          ]}
        />
        <Callout>
          Sistemático, no a la suerte: primero mira si el frontend cargó, después si la petición
          salió, después qué respondió el backend, y por último los logs del servidor. En ese orden
          se encuentra casi todo.
        </Callout>
      </Lesson>

      <Exercises>
        <Quiz
          id="tres-piezas"
          index={1}
          title="Las tres piezas"
          prompt="¿Qué hay que desplegar en una app full stack?"
          options={[
            { id: 'a', label: 'El frontend compilado, el backend corriendo y la base de datos' },
            { id: 'b', label: 'Solo el frontend' },
            { id: 'c', label: 'Solo el backend' },
            { id: 'd', label: 'Un único archivo con todo' },
          ]}
          answer="a"
          explanation="Tres piezas con necesidades distintas: archivos que se sirven, un proceso que corre y un servicio que persiste."
        />

        <TrueFalse
          id="url-fija"
          index={2}
          title="La URL de la API"
          statement="Escribir http://localhost:3000 en el código del frontend está bien mientras funcione en tu máquina."
          answer={false}
          explanation="Falso. En producción esa dirección no existe y la app queda muerta. La URL va en una variable de entorno desde el principio."
        />

        <Quiz
          id="variable-frontend"
          index={3}
          title="Variables en el frontend"
          prompt="¿Puedes poner la clave de la API de IA en una variable VITE_ del frontend?"
          options={[
            { id: 'a', label: 'No: las variables del frontend quedan incrustadas en el build y cualquiera las lee' },
            { id: 'b', label: 'Sí, porque empieza por VITE_ y eso las protege' },
            { id: 'c', label: 'Sí, si el repositorio es privado' },
            { id: 'd', label: 'Sí, si se llama SECRET' },
          ]}
          answer="a"
          explanation="El build se descarga al navegador. Ahí no hay secretos posibles: las claves viven en el backend, siempre."
        />

        <MultiSelect
          id="checklist-produccion"
          index={4}
          title="Checklist de producción"
          prompt="Marca lo que hay que verificar antes de entregar."
          options={[
            { id: 'https', label: 'HTTPS con certificado válido' },
            { id: 'cookie', label: 'Cookies con secure activado' },
            { id: 'cors', label: 'CORS restringido a tu dominio' },
            { id: 'secretos', label: 'Secretos fuera del repositorio' },
            { id: 'spa', label: 'El servidor devuelve index.html en cualquier ruta' },
            { id: 'consola', label: 'Todos los console.log activos para depurar mejor' },
          ]}
          answers={['https', 'cookie', 'cors', 'secretos', 'spa']}
          explanation="Los logs de depuración se limpian: ensucian la consola y a veces filtran datos."
        />

        <Quiz
          id="404-recarga"
          index={5}
          title="404 al recargar"
          prompt="En producción navegas bien, pero al recargar en /catalogo sale 404. ¿Qué falta?"
          options={[
            { id: 'a', label: 'Configurar el servidor para devolver index.html en cualquier ruta' },
            { id: 'b', label: 'Agregar la ruta en React Router' },
            { id: 'c', label: 'Cambiar el dominio' },
            { id: 'd', label: 'Reiniciar la base de datos' },
          ]}
          answer="a"
          explanation="El servidor busca un archivo llamado /catalogo y no existe. Con el fallback a index.html, React Router resuelve la ruta."
        />

        <Quiz
          id="pagina-blanco"
          index={6}
          title="Página en blanco"
          prompt="Abres la URL de producción y no se ve nada. ¿Dónde miras primero?"
          options={[
            { id: 'a', label: 'La consola del navegador' },
            { id: 'b', label: 'Los logs de Mongo' },
            { id: 'c', label: 'El README' },
            { id: 'd', label: 'El código fuente en GitHub' },
          ]}
          answer="a"
          explanation="Pantalla en blanco casi siempre es un error de JavaScript o un archivo que no cargó, y las dos cosas salen en la consola."
        />

        <MatchPairs
          id="empareja-sintomas"
          index={7}
          title="Empareja el síntoma con la causa"
          pairs={[
            { id: 'blanco', izquierda: 'Página en blanco', derecha: 'Error de JS o asset que no carga' },
            { id: '404', izquierda: '404 al recargar una ruta', derecha: 'Falta el fallback a index.html' },
            { id: 'cors', izquierda: 'Peticiones bloqueadas', derecha: 'CORS mal configurado' },
            { id: 'sesion', izquierda: 'Se pierde la sesión', derecha: 'La cookie no viaja: secure o dominio' },
            { id: '500', izquierda: 'Todo devuelve 500', derecha: 'Falta una variable de entorno' },
          ]}
          explanation="Estos cinco cubren la mayoría de los sustos del día del despliegue."
        />

        <TrueFalse
          id="congelar-alcance"
          index={8}
          title="El día de la entrega"
          statement="El día del despliegue final es buen momento para agregar esa funcionalidad que faltaba."
          answer={false}
          explanation="Falso. Cada cosa nueva es un riesgo nuevo. Ese día se congela el alcance y solo se arregla lo roto."
        />

        <FillBlank
          id="build-preview"
          index={9}
          title="Probar el build"
          prompt="Para ver la versión de producción antes de publicar."
          code={'$ npm run build\n$ npm run ___'}
          options={['preview', 'dev', 'start', 'test']}
          answer="preview"
          explanation="preview sirve el build real, no el modo desarrollo. Ahí aparecen los problemas de rutas y variables que dev esconde."
        />

        <Quiz
          id="health-check"
          index={10}
          title="La ruta de salud"
          prompt="¿Para qué sirve un GET /api/health que devuelve { ok: true }?"
          options={[
            { id: 'a', label: 'Para comprobar en un segundo si el backend está vivo' },
            { id: 'b', label: 'Para medir la velocidad de internet' },
            { id: 'c', label: 'Para reiniciar el servidor' },
            { id: 'd', label: 'Para el login' },
          ]}
          answer="a"
          explanation="Es lo primero que se consulta cuando algo falla: si health responde, el proceso está arriba y el problema está en otra parte."
        />

        <OrderSteps
          id="orden-deploy-final"
          index={11}
          title="Ordena el despliegue final"
          steps={[
            { id: 'congela', text: 'Congelar el alcance: solo arreglos' },
            { id: 'build', text: 'Probar el build de producción en local' },
            { id: 'back', text: 'Desplegar el backend y comprobar /api/health' },
            { id: 'front', text: 'Desplegar el frontend apuntando a la API real' },
            { id: 'recorrido', text: 'Recorrer la app completa en la URL pública' },
            { id: 'readme', text: 'Actualizar el README y commit final' },
          ]}
          explanation="El backend primero: sin API viva, el frontend no se puede probar de verdad."
        />

        <MultiSelect
          id="recorrido-final"
          index={12}
          title="El recorrido de prueba"
          prompt="En la URL pública, ¿qué pruebas?"
          options={[
            { id: 'registro', label: 'Registrar una cuenta nueva' },
            { id: 'login', label: 'Iniciar y cerrar sesión' },
            { id: 'crud', label: 'Crear, editar y borrar desde el panel' },
            { id: 'movil', label: 'Todo lo anterior en el celular' },
            { id: 'consola', label: 'Que la consola no muestre errores' },
            { id: 'codigo', label: 'Leer todo el código una vez más' },
          ]}
          answers={['registro', 'login', 'crud', 'movil', 'consola']}
          explanation="Se prueba el comportamiento, no el código. Y el celular no es opcional: es donde va a entrar la mayoría."
        />

        <Quiz
          id="cookie-secure"
          index={13}
          title="La cookie en producción"
          prompt="Ya tienes HTTPS. ¿Qué cambia en la configuración de la cookie de sesión?"
          options={[
            { id: 'a', label: 'Se activa secure, para que solo viaje por HTTPS' },
            { id: 'b', label: 'Se desactiva httpOnly' },
            { id: 'c', label: 'Se le quita la expiración' },
            { id: 'd', label: 'Nada' },
          ]}
          answer="a"
          explanation="secure impide que la cookie viaje por HTTP. En desarrollo se deja apagado porque localhost no tiene certificado."
        />

        <Quiz
          id="mongo-produccion"
          index={14}
          title="La base en producción"
          prompt="¿Qué NO debe pasar con tu MongoDB de producción?"
          options={[
            { id: 'a', label: 'Que esté abierta a internet sin usuario ni contraseña' },
            { id: 'b', label: 'Que tenga usuario y contraseña' },
            { id: 'c', label: 'Que esté en Atlas' },
            { id: 'd', label: 'Que tenga respaldos' },
          ]}
          answer="a"
          explanation="Una base abierta a internet la encuentran los escáneres automáticos en horas. Usuario, contraseña y acceso restringido: mínimo."
        />

        <TrueFalse
          id="backup"
          index={15}
          title="Respaldos"
          statement="Vale la pena tener un respaldo de la base antes de la presentación."
          answer={true}
          explanation="Verdadero. Un borrado accidental a un día de la entrega, sin respaldo, es una historia que se cuenta muchas veces. Un mongodump toma un minuto."
        />

        <Quiz
          id="cuenta-demo"
          index={16}
          title="Para que el evaluador entre"
          prompt="El panel requiere login. ¿Cómo se lo facilitas a quien va a revisar?"
          options={[
            { id: 'a', label: 'Con una cuenta de prueba documentada en el README' },
            { id: 'b', label: 'Quitando el login ese día' },
            { id: 'c', label: 'Pasándole tu contraseña personal' },
            { id: 'd', label: 'Que se registre y le das permisos en el momento' },
          ]}
          answer="a"
          explanation="Una cuenta de demostración con datos de prueba. Quitar el login rompe justo lo que quieres mostrar, y tu contraseña personal no se comparte nunca."
        />

        <MultiSelect
          id="readme-final"
          index={17}
          title="El README final"
          prompt="¿Qué debe tener?"
          options={[
            { id: 'que', label: 'Qué es el proyecto y qué problema resuelve' },
            { id: 'url', label: 'La URL del demo en vivo' },
            { id: 'correr', label: 'Cómo correrlo en local' },
            { id: 'stack', label: 'Las tecnologías usadas' },
            { id: 'demo', label: 'Las credenciales de la cuenta de prueba' },
            { id: 'secretos', label: 'El contenido del .env' },
          ]}
          answers={['que', 'url', 'correr', 'stack', 'demo']}
          explanation="Todo menos el .env. La cuenta de demostración sí se comparte porque es de prueba; los secretos reales, jamás."
        />

        <Quiz
          id="depurar-orden"
          index={18}
          title="Depurar en producción"
          prompt="¿En qué orden buscas cuando algo falla?"
          options={[
            {
              id: 'a',
              label: 'Consola del navegador → pestaña Network → respuesta del backend → logs del servidor',
            },
            { id: 'b', label: 'Directo a reescribir el código' },
            { id: 'c', label: 'Reiniciar todo y esperar' },
            { id: 'd', label: 'Empezar por la base de datos' },
          ]}
          answer="a"
          explanation="De afuera hacia adentro. Cada paso descarta una capa, y así llegas a la causa en minutos en vez de dar palos de ciego."
        />

        <TrueFalse
          id="funciona-local"
          index={19}
          title="«En mi máquina funciona»"
          statement="Si funciona en tu computador, debería funcionar igual publicado."
          answer={false}
          explanation="Falso, y es la frase más famosa del oficio. Cambian el sistema de archivos, las variables, los dominios y los permisos. Por eso se despliega temprano y se prueba en la URL real."
        />

        <MultiSelect
          id="checklist-entrega"
          index={20}
          title="Listo para entregar si…"
          options={[
            { id: 'url', label: 'La app funciona en una URL pública con HTTPS' },
            { id: 'recorrido', label: 'El recorrido completo funciona en móvil y escritorio' },
            { id: 'consola', label: 'La consola está limpia de errores' },
            { id: 'readme', label: 'El README tiene la URL y la cuenta de prueba' },
            { id: 'repo', label: 'Todo el código está en GitHub, sin secretos' },
            { id: 'local', label: 'Funciona en tu computador' },
          ]}
          answers={['url', 'recorrido', 'consola', 'readme', 'repo']}
          explanation="Que funcione en tu computador no es criterio de entrega: lo que se evalúa es lo que está publicado y lo que está en el repositorio."
        />
      </Exercises>
    </TopicPage>
  );
}
