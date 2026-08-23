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

const SLUG = 'reto-todo-app-react';

/** Sesión 19 del cronograma — reto integrador: frontend y backend juntos. */
export default function RetoTodoAppReact() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. El reto: unir las dos mitades">
        <p>
          Tienes una API con login y tareas (sesión 15) y sabes construir interfaces con React
          (sesiones 16–18). Hoy los conectas: una app donde alguien se registra, entra, y gestiona
          sus propias tareas desde el navegador.
        </p>

        <Figure
          label="Diagrama: las dos mitades de una aplicación full stack"
          caption="Dos programas separados que se hablan por HTTP. Cada uno se ejecuta en un lugar distinto y ninguno confía ciegamente en el otro."
        >
          <svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="30" width="270" height="120" rx="10" fill="var(--color-text)" opacity="0.06" />
            <text x="16" y="52" fontSize="11" letterSpacing="1.2" fill="var(--color-accent-text)">
              FRONTEND · React
            </text>
            {['Componentes y estado', 'Rutas y navegación', 'Formularios y validación visual'].map((t, i) => (
              <text key={t} x="16" y={80 + i * 22} fontSize="12.5" fill="var(--color-text)" opacity="0.7">
                {t}
              </text>
            ))}

            <line x1="286" y1="76" x2="354" y2="76" stroke="var(--color-accent)" strokeWidth="1.2" />
            <path d="M361 76 l-8 -4.5 l0 9 z" fill="var(--color-accent)" />
            <text x="292" y="66" fontSize="11" fill="var(--color-accent-text)" fontFamily="ui-monospace, monospace">
              fetch
            </text>
            <line x1="354" y1="104" x2="290" y2="104" stroke="var(--color-text)" strokeWidth="1.2" opacity="0.4" />
            <path d="M283 104 l8 -4.5 l0 9 z" fill="var(--color-text)" opacity="0.5" />
            <text x="292" y="122" fontSize="11" fill="var(--color-text)" opacity="0.5" fontFamily="ui-monospace, monospace">
              JSON
            </text>

            <rect x="370" y="30" width="270" height="120" rx="10" fill="var(--color-text)" opacity="0.06" />
            <text x="386" y="52" fontSize="11" letterSpacing="1.2" fill="var(--color-accent-text)">
              BACKEND · Express + Mongo
            </text>
            {['Rutas y middleware', 'Autenticación y permisos', 'Validación y base de datos'].map((t, i) => (
              <text key={t} x="386" y={80 + i * 22} fontSize="12.5" fill="var(--color-text)" opacity="0.7">
                {t}
              </text>
            ))}
            <text x="0" y="186" fontSize="12" fill="var(--color-text)" opacity="0.5">
              La validación se hace en los dos lados: en el frontend para avisar, en el backend para proteger.
            </text>
          </svg>
        </Figure>
      </Lesson>

      <Lesson title="2. La sesión en el frontend">
        <p>
          El backend entrega la sesión en una cookie <code>httpOnly</code>, así que el JavaScript no
          puede leerla — y no debe. Lo que el frontend necesita saber es simplemente{' '}
          <em>quién está adentro</em>, y eso se pregunta:
        </p>
        <Terminal
          lineas={[
            '// al arrancar la app',
            'useEffect(() => {',
            "  fetch('/api/auth/me')",
            '    .then((r) => r.json())',
            '    .then((d) => setUsuario(d.usuario))',
            '    .finally(() => setCargando(false));',
            '}, []);',
          ]}
        />
        <Callout tipo="ojo">
          Ese <code>cargando</code> importa más de lo que parece. Sin él, en el primer instante{' '}
          <code>usuario</code> es <code>null</code> y una ruta protegida te expulsa al login aunque
          tengas sesión válida. El síntoma es «me saca al recargar la página».
        </Callout>
      </Lesson>

      <Lesson title="3. Un contexto para no pasar props por todos lados">
        <p>
          El usuario lo necesitan la barra, el panel y cada ruta protegida. Pasarlo como prop por
          seis niveles es incómodo: para eso está el <strong>contexto</strong>.
        </p>
        <Terminal
          lineas={[
            'const AuthContext = createContext(null);',
            '',
            'export function AuthProvider({ children }) {',
            '  const [usuario, setUsuario] = useState(null);',
            '  const [cargando, setCargando] = useState(true);',
            '  // ...cargar sesión, login, logout...',
            '  return (',
            '    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>',
            '      {children}',
            '    </AuthContext.Provider>',
            '  );',
            '}',
            '',
            'export const useAuth = () => useContext(AuthContext);',
          ]}
        />
        <Compare
          bien={{
            titulo: 'Contexto',
            items: [
              'Un solo lugar donde vive la sesión',
              'Cualquier componente la pide con useAuth()',
              'Ideal para sesión, tema e idioma',
            ],
          }}
          mal={{
            titulo: 'Props por todos lados',
            items: [
              'El dato atraviesa componentes que no lo usan',
              'Cambiar la forma del usuario obliga a tocar diez archivos',
              'Se llama «prop drilling»',
            ],
          }}
        />
      </Lesson>

      <Lesson title="4. El formulario, bien hecho">
        <Steps>
          <Step title="Estado por campo">
            <code>value</code> y <code>onChange</code>: el estado de React es la única verdad de lo
            que hay escrito.
          </Step>
          <Step title="Bloquear el envío mientras responde">
            Deshabilita el botón: sin eso, un doble clic crea la tarea dos veces.
          </Step>
          <Step title="Mostrar el error del servidor">
            Si la API responde 400 con un mensaje, muéstralo tal cual junto al formulario. No un
            genérico «algo salió mal».
          </Step>
          <Step title="Limpiar al terminar">
            Campo vacío y foco listo para lo siguiente.
          </Step>
          <Step title="preventDefault en el submit">
            Sin él, el navegador recarga la página y pierdes todo el estado.
          </Step>
        </Steps>
        <Terminal
          lineas={[
            'async function enviar(e) {',
            '  e.preventDefault();',
            '  setEnviando(true);',
            '  setError(null);',
            '  try {',
            "    const res = await fetch('/api/tareas', {",
            "      method: 'POST',",
            "      headers: { 'Content-Type': 'application/json' },",
            '      body: JSON.stringify({ texto }),',
            '    });',
            '    const datos = await res.json();',
            '    if (!res.ok) throw new Error(datos.error);',
            '    setTareas((prev) => [...prev, datos]);',
            "    setTexto('');",
            '  } catch (err) {',
            '    setError(err.message);',
            '  } finally {',
            '    setEnviando(false);',
            '  }',
            '}',
          ]}
        />
        <Callout tipo="ojo">
          <code>fetch</code> <strong>no lanza error</strong> con un 400 o un 500: solo falla si no
          hubo red. Hay que revisar <code>res.ok</code> a mano. Es de los descubrimientos más
          sorpresivos de la sesión.
        </Callout>
      </Lesson>

      <Lesson title="5. CORS y el proxy de desarrollo">
        <p>
          En desarrollo el frontend corre en un puerto y la API en otro. Para el navegador son{' '}
          <em>orígenes distintos</em>, y por seguridad bloquea la petición. Dos salidas:
        </p>
        <RefTable
          cabeceras={['Opción', 'Cómo', 'Cuándo']}
          filas={[
            ['Proxy de Vite', 'Configurar /api en vite.config.js', 'Desarrollo: el navegador cree que es el mismo origen'],
            ['CORS en Express', 'app.use(cors({ origin, credentials: true }))', 'Cuando el frontend vive en otro dominio'],
            ['Mismo origen', 'nginx sirve el sitio y hace proxy de /api', 'Producción: la solución más simple'],
          ]}
        />
        <Callout>
          Esta guía usa la tercera: nginx entrega los archivos y reenvía <code>/api</code> al Node.
          Como todo sale del mismo dominio, no hay CORS que configurar y la cookie viaja sin
          problemas.
        </Callout>
      </Lesson>

      <Exercises>
        <Quiz
          id="full-stack"
          index={1}
          title="Full stack"
          prompt="¿Qué significa que tu app sea full stack?"
          options={[
            { id: 'a', label: 'Que tú construyes las dos mitades: la interfaz y el servidor con su base de datos' },
            { id: 'b', label: 'Que usa muchas librerías' },
            { id: 'c', label: 'Que está publicada en internet' },
            { id: 'd', label: 'Que tiene login' },
          ]}
          answer="a"
          explanation="Frontend y backend. Son dos programas separados que se comunican por HTTP, y cada uno tiene sus propias responsabilidades."
        />

        <TrueFalse
          id="fetch-no-lanza"
          index={2}
          title="fetch y los errores"
          statement="Si el servidor responde 400, fetch lanza una excepción y entra al catch."
          answer={false}
          explanation="Falso. fetch solo falla si no hubo red. Un 400 o un 500 llegan como respuesta normal: hay que revisar res.ok tú mismo."
        />

        <FillBlank
          id="res-ok"
          index={3}
          title="Detecta el error del servidor"
          code={'const datos = await res.json();\nif (!res.___) throw new Error(datos.error);'}
          options={['ok', 'error', 'status', 'success']}
          answer="ok"
          explanation="res.ok es true si el código está entre 200 y 299. También puedes mirar res.status si necesitas distinguir un 401 de un 404."
        />

        <Quiz
          id="prevent-default"
          index={4}
          title="El formulario recarga la página"
          prompt="Al enviar, la página se recarga y se pierde todo. ¿Qué falta?"
          options={[
            { id: 'a', label: 'e.preventDefault() al comienzo del manejador del submit' },
            { id: 'b', label: 'Un useEffect' },
            { id: 'c', label: 'Cambiar el botón por un div' },
            { id: 'd', label: 'Quitar el formulario y usar solo inputs' },
          ]}
          answer="a"
          explanation="El comportamiento por defecto de un formulario es enviar y recargar. preventDefault lo cancela para que tú manejes el envío con fetch."
        />

        <Quiz
          id="me-al-arrancar"
          index={5}
          title="Saber quién está adentro"
          prompt="La sesión está en una cookie httpOnly que el JavaScript no puede leer. ¿Cómo sabe el frontend quién es el usuario?"
          options={[
            { id: 'a', label: 'Preguntándole a la API con GET /api/auth/me al arrancar' },
            { id: 'b', label: 'Leyendo la cookie con document.cookie' },
            { id: 'c', label: 'Guardando el usuario en localStorage al hacer login' },
            { id: 'd', label: 'No se puede saber' },
          ]}
          answer="a"
          explanation="El navegador manda la cookie sola; el servidor la verifica y responde quién es. El frontend nunca ve el token."
        />

        <Quiz
          id="cargando-sesion"
          index={6}
          title="Me saca al recargar"
          prompt="Recargas estando logueado y la app te manda al login por un instante. ¿Por qué?"
          options={[
            { id: 'a', label: 'La ruta protegida decide antes de que termine de cargar la sesión' },
            { id: 'b', label: 'La cookie se borró' },
            { id: 'c', label: 'El token venció' },
            { id: 'd', label: 'Falta CORS' },
          ]}
          answer="a"
          explanation="En el primer render usuario es null porque la petición no ha vuelto. Con un estado cargando y un «if (cargando) return null» se arregla."
        />

        <Quiz
          id="para-que-contexto"
          index={7}
          title="¿Para qué el contexto?"
          options={[
            { id: 'a', label: 'Para que cualquier componente acceda a la sesión sin pasarla por props en cada nivel' },
            { id: 'b', label: 'Para guardar datos en el servidor' },
            { id: 'c', label: 'Para reemplazar useState' },
            { id: 'd', label: 'Para hacer la app más rápida' },
          ]}
          answer="a"
          explanation="Evita el prop drilling. Es ideal para datos globales como la sesión, el tema o el idioma — no para todo el estado de la app."
        />

        <MatchPairs
          id="empareja-full"
          index={8}
          title="¿De quién es cada responsabilidad?"
          pairs={[
            { id: 'ui', izquierda: 'Dibujar los formularios', derecha: 'Frontend' },
            { id: 'hash', izquierda: 'Hashear la contraseña', derecha: 'Backend' },
            { id: 'nav', izquierda: 'Cambiar de pantalla sin recargar', derecha: 'Frontend' },
            { id: 'permiso', izquierda: 'Verificar que la tarea sea del usuario', derecha: 'Backend' },
            { id: 'guardar', izquierda: 'Guardar en la base de datos', derecha: 'Backend' },
          ]}
          explanation="Regla práctica: todo lo que proteja datos va en el backend. El frontend hace la experiencia agradable, no segura."
        />

        <TrueFalse
          id="validacion-doble"
          index={9}
          title="Validar dos veces"
          statement="Si ya validas el formulario en React, el backend puede confiar en los datos."
          answer={false}
          explanation="Falso. Cualquiera puede mandar una petición saltándose tu formulario. La validación del frontend es cortesía; la del backend es la que protege."
        />

        <FillBlank
          id="agregar-lista"
          index={10}
          title="Agrega la tarea a la lista"
          code={'setTareas((prev) => ___);'}
          options={['[...prev, datos]', 'prev.push(datos)', 'datos', '[datos]']}
          answer="[...prev, datos]"
          explanation="Un array nuevo con lo anterior más lo nuevo. push modifica el mismo array y React no se entera; [datos] borraría las tareas anteriores."
        />

        <Quiz
          id="doble-envio"
          index={11}
          title="Se crearon dos tareas iguales"
          prompt="El usuario hizo doble clic en «Agregar». ¿Cómo lo evitas?"
          options={[
            { id: 'a', label: 'Deshabilitar el botón mientras la petición está en curso' },
            { id: 'b', label: 'Poner un alert de advertencia' },
            { id: 'c', label: 'Borrar la tarea duplicada después' },
            { id: 'd', label: 'No se puede evitar' },
          ]}
          answer="a"
          explanation="Un estado enviando que deshabilita el botón. Es un detalle de dos líneas que se nota mucho cuando la conexión está lenta."
        />

        <Quiz
          id="cors"
          index={12}
          title="El error de CORS"
          prompt="En desarrollo, el frontend en el puerto 5173 llama a la API en el 3000 y el navegador bloquea. ¿Qué es eso?"
          options={[
            { id: 'a', label: 'CORS: son orígenes distintos y el navegador lo bloquea por seguridad' },
            { id: 'b', label: 'Un error de sintaxis' },
            { id: 'c', label: 'La API está caída' },
            { id: 'd', label: 'Falta instalar React Router' },
          ]}
          answer="a"
          explanation="Puerto distinto es origen distinto. Se resuelve con el proxy de Vite en desarrollo, o sirviendo todo desde el mismo dominio en producción."
        />

        <Quiz
          id="cookie-credentials"
          index={13}
          title="La cookie no llega"
          prompt="Haces login, todo responde bien, pero las siguientes peticiones salen 401. ¿Qué revisas?"
          options={[
            { id: 'a', label: 'Que el fetch envíe las credenciales y que el origen coincida' },
            { id: 'b', label: 'Que el CSS esté cargado' },
            { id: 'c', label: 'Que React Router tenga la ruta' },
            { id: 'd', label: 'Que la base de datos esté vacía' },
          ]}
          answer="a"
          explanation="Si la petición va a otro origen, el navegador no manda la cookie salvo que lo pidas explícitamente y el servidor lo permita. Con mismo origen no hay problema."
        />

        <OrderSteps
          id="orden-reto-react"
          index={14}
          title="Ordena la construcción"
          steps={[
            { id: 'auth', text: 'Crear el contexto de autenticación con login, logout y carga de sesión' },
            { id: 'rutas', text: 'Definir las rutas: entrar, tareas y la protegida' },
            { id: 'login', text: 'Construir el formulario de login contra la API' },
            { id: 'lista', text: 'Cargar y mostrar las tareas del usuario' },
            { id: 'crud', text: 'Agregar, marcar y eliminar tareas' },
            { id: 'estados', text: 'Cubrir cargando, error y lista vacía' },
          ]}
          explanation="La sesión primero: casi todo lo demás depende de saber quién está adentro."
        />

        <MultiSelect
          id="estados-ui-reto"
          index={15}
          title="Estados de la pantalla de tareas"
          prompt="Marca lo que tu interfaz debería contemplar."
          options={[
            { id: 'cargando', label: 'Cargando las tareas' },
            { id: 'error', label: 'La API no respondió' },
            { id: 'vacio', label: 'El usuario no tiene tareas todavía' },
            { id: 'enviando', label: 'Se está guardando una tarea nueva' },
            { id: 'imprimir', label: 'Imprimiendo la lista en papel' },
          ]}
          answers={['cargando', 'error', 'vacio', 'enviando']}
          explanation="Los cuatro primeros. El estado vacío con un mensaje amable es lo primero que ve un usuario nuevo: vale la pena cuidarlo."
        />

        <TrueFalse
          id="optimista"
          index={16}
          title="Actualización optimista"
          statement="Mostrar la tarea en la lista antes de que el servidor confirme hace la app más rápida, pero obliga a deshacer el cambio si falla."
          answer={true}
          explanation="Verdadero. Es una técnica válida y muy usada, con una condición: manejar el fallo. Si no revierte, el usuario cree que guardó algo que no existe."
        />

        <Quiz
          id="donde-total"
          index={17}
          title="¿Estado o cálculo?"
          prompt="Quieres mostrar cuántas tareas faltan por hacer."
          options={[
            { id: 'a', label: 'Calcularlo en el render: tareas.filter(t => !t.hecha).length' },
            { id: 'b', label: 'Un useState con el conteo, actualizado en cada cambio' },
            { id: 'c', label: 'Pedirlo a la API cada vez' },
            { id: 'd', label: 'Guardarlo en localStorage' },
          ]}
          answer="a"
          explanation="Se puede derivar de los datos que ya tienes. Guardarlo en estado crea una segunda verdad que tarde o temprano se desincroniza."
        />

        <Quiz
          id="separar-api"
          index={18}
          title="Las llamadas a la API"
          prompt="Tienes fetch repartido en ocho componentes. ¿Qué conviene?"
          options={[
            { id: 'a', label: 'Centralizarlas en un archivo api.js con funciones por operación' },
            { id: 'b', label: 'Dejarlo así, funciona' },
            { id: 'c', label: 'Ponerlas todas en App.jsx' },
            { id: 'd', label: 'Usar variables globales' },
          ]}
          answer="a"
          explanation="Un solo lugar donde se define la URL base, el manejo de errores y las credenciales. Cuando cambie algo, cambias un archivo y no ocho."
        />

        <MultiSelect
          id="checklist-integrador"
          index={19}
          title="Checklist del reto"
          options={[
            { id: 'login', label: 'Registro y login funcionando contra la API' },
            { id: 'proteccion', label: 'Rutas protegidas en el frontend Y verificación en el backend' },
            { id: 'crud', label: 'Crear, listar, marcar y eliminar tareas' },
            { id: 'propias', label: 'Cada usuario ve solo sus tareas — probado con dos cuentas' },
            { id: 'estados', label: 'Cargando, error y vacío cubiertos' },
            { id: 'consola', label: 'La consola llena de console.log de depuración' },
          ]}
          answers={['login', 'proteccion', 'crud', 'propias', 'estados']}
          explanation="Los console.log de depuración se limpian antes de entregar. Dejarlos delata trabajo sin terminar — y a veces filtra datos."
        />

        <Quiz
          id="probar-dos-cuentas"
          index={20}
          title="La prueba que no puede faltar"
          prompt="¿Cuál es la prueba más importante antes de dar por terminado el reto?"
          options={[
            { id: 'a', label: 'Entrar con dos cuentas distintas y comprobar que ninguna ve las tareas de la otra' },
            { id: 'b', label: 'Que se vea bien en pantalla grande' },
            { id: 'c', label: 'Que el botón tenga hover' },
            { id: 'd', label: 'Que cargue en menos de un segundo' },
          ]}
          answer="a"
          explanation="Es la prueba que valida la autorización, que es lo más delicado que has construido. Lo demás importa, pero un fallo ahí expone datos de otras personas."
        />
      </Exercises>
    </TopicPage>
  );
}
