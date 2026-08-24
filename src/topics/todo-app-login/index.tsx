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

const SLUG = 'todo-app-login';

/** Sesión 15 del cronograma — reto integrador de backend con autenticación. */
export default function TodoAppLogin() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Qué vas a construir">
        <p>
          Una API donde cada persona tiene su propia lista de tareas. Suena simple y esconde el tema
          más delicado del curso: <strong>autenticación</strong>. Dos preguntas que el servidor debe
          responder en cada petición:
        </p>
        <RefTable
          cabeceras={['Pregunta', 'Nombre técnico', 'Cómo se responde']}
          filas={[
            ['¿Quién eres?', 'Autenticación', 'Con la contraseña, una sola vez, al entrar'],
            ['¿Puedes hacer esto?', 'Autorización', 'Con el rol y el dueño del dato, en cada petición'],
          ]}
        />
      </Lesson>

      <Lesson title="2. Contraseñas: nunca en texto plano">
        <p>
          No se guarda la contraseña. Se guarda su <strong>hash</strong>: el resultado de pasarla
          por una función que no se puede revertir. Al iniciar sesión se vuelve a calcular y se
          comparan los hashes.
        </p>

        <Figure
          label="Diagrama: registro e inicio de sesión con hash de contraseña"
          caption="La contraseña original no queda guardada en ninguna parte. Por eso los sistemas serios te dejan restablecerla, no recuperarla."
        >
          <svg viewBox="0 0 640 190" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="14" fontSize="11" letterSpacing="1.3" fill="var(--color-accent-text)">
              REGISTRO
            </text>
            <text x="0" y="44" fontSize="13" fontFamily="ui-monospace, monospace" fill="var(--color-text)">
              "MiClave123"
            </text>
            <line x1="120" y1="39" x2="196" y2="39" stroke="var(--color-accent)" strokeWidth="1.2" />
            <path d="M203 39 l-8 -4.5 l0 9 z" fill="var(--color-accent)" />
            <text x="128" y="30" fontSize="11" fill="var(--color-accent-text)" fontFamily="ui-monospace, monospace">
              bcrypt
            </text>
            <text x="215" y="44" fontSize="13" fontFamily="ui-monospace, monospace" fill="var(--color-text)" opacity="0.8">
              $2b$12$K9x…qP  → se guarda esto
            </text>

            <line x1="0" y1="76" x2="620" y2="76" stroke="var(--color-divider)" strokeWidth="1" />

            <text x="0" y="106" fontSize="11" letterSpacing="1.3" fill="var(--color-accent-text)">
              INICIO DE SESIÓN
            </text>
            <text x="0" y="136" fontSize="13" fontFamily="ui-monospace, monospace" fill="var(--color-text)">
              lo que escribió
            </text>
            <line x1="130" y1="131" x2="206" y2="131" stroke="var(--color-accent)" strokeWidth="1.2" />
            <path d="M213 131 l-8 -4.5 l0 9 z" fill="var(--color-accent)" />
            <text x="136" y="122" fontSize="11" fill="var(--color-accent-text)" fontFamily="ui-monospace, monospace">
              compare
            </text>
            <text x="225" y="136" fontSize="13" fontFamily="ui-monospace, monospace" fill="var(--color-text)" opacity="0.8">
              ¿coincide con el hash guardado?
            </text>
            <text x="0" y="176" fontSize="12" fill="var(--color-text-2)">
              El hash no se puede revertir: de $2b$12$K9x…qP no se saca "MiClave123".
            </text>
          </svg>
        </Figure>

        <Terminal
          lineas={[
            "const bcrypt = require('bcryptjs');",
            '',
            '// al registrar',
            'const hash = await bcrypt.hash(password, 12);',
            '',
            '// al iniciar sesión',
            'const coincide = await bcrypt.compare(password, usuario.passwordHash);',
          ]}
        />
        <Callout tipo="ojo">
          Ese <code>12</code> es el costo: cuántas vueltas da el algoritmo. Más alto es más lento de
          calcular — y por eso más caro de romper por fuerza bruta. Un hash lento es una virtud, no
          un defecto.
        </Callout>
      </Lesson>

      <Lesson title="3. Sesión: no volver a pedir la contraseña">
        <p>
          Después del login, el servidor entrega un <strong>token</strong> firmado (JWT) que dice
          «esta persona es el usuario tal, y esto vence en 7 días». El cliente lo manda en cada
          petición y el servidor verifica la firma.
        </p>
        <Terminal
          lineas={[
            "const jwt = require('jsonwebtoken');",
            '',
            '// al iniciar sesión, después de comprobar la contraseña',
            "const token = jwt.sign({ sub: usuario._id }, process.env.JWT_SECRET, { expiresIn: '7d' });",
            '',
            '// en el middleware que protege las rutas',
            'const datos = jwt.verify(token, process.env.JWT_SECRET);',
          ]}
        />
        <Compare
          bien={{
            titulo: 'Cookie httpOnly',
            items: [
              'El JavaScript de la página no la puede leer',
              'El navegador la manda sola en cada petición',
              'Con secure, solo viaja por HTTPS',
              'Es lo que usa este mismo sitio',
            ],
          }}
          mal={{
            titulo: 'Token en localStorage',
            items: [
              'Cualquier script de la página lo puede leer',
              'Si te inyectan código, se lo llevan',
              'Hay que acordarse de mandarlo a mano',
              'Más fácil de escribir, más fácil de robar',
            ],
          }}
        />
        <Callout>
          El <code>JWT_SECRET</code> es la llave con la que se firma. Si se filtra, cualquiera puede
          fabricar tokens y entrar como quien quiera. Va en el <code>.env</code>, nunca en el
          repositorio.
        </Callout>
      </Lesson>

      <Lesson title="4. Autorización: que cada quien vea lo suyo">
        <p>
          Autenticarse no basta. Si tus tareas se piden con <code>GET /tareas/:id</code> y no
          verificas el dueño, cualquier usuario logueado puede leer las tareas de otro cambiando el
          id en la URL.
        </p>
        <Terminal
          lineas={[
            "app.get('/tareas/:id', requireAuth, async (req, res) => {",
            '  const tarea = await Tarea.findById(req.params.id);',
            "  if (!tarea) return res.status(404).json({ error: 'No existe' });",
            '',
            '  // la línea que casi todo el mundo olvida',
            '  if (!tarea.usuario.equals(req.user._id)) {',
            "    return res.status(403).json({ error: 'No es tuya' });",
            '  }',
            '  res.json(tarea);',
            '});',
          ]}
        />
        <RefTable
          cabeceras={['Código', 'Cuándo']}
          filas={[
            ['401', 'No hay sesión: no sé quién eres'],
            ['403', 'Sé quién eres, pero esto no es tuyo'],
            ['404', 'El recurso no existe'],
          ]}
        />
      </Lesson>

      <Lesson title="5. Arma el reto, paso a paso">
        <Steps>
          <Step title="Modelos">
            <code>Usuario</code> (nombre, correo único, passwordHash, rol) y <code>Tarea</code>{' '}
            (texto, hecha, y una referencia al usuario).
          </Step>
          <Step title="Registro">
            <code>POST /auth/registro</code>: validar, revisar que el correo no exista, hashear y
            crear.
          </Step>
          <Step title="Login">
            <code>POST /auth/login</code>: buscar por correo, comparar con bcrypt, firmar el token y
            mandarlo en una cookie httpOnly.
          </Step>
          <Step title="Middleware de sesión">
            Lee la cookie, verifica el token y deja <code>req.user</code> listo. Si no hay token
            válido, 401.
          </Step>
          <Step title="CRUD de tareas, siempre filtrado por usuario">
            <Terminal lineas={['const tareas = await Tarea.find({ usuario: req.user._id });']} />
            Nunca <code>Tarea.find()</code> a secas: eso devolvería las tareas de todo el mundo.
          </Step>
          <Step title="Prueba el ataque">
            Crea dos usuarios, entra con el primero e intenta leer una tarea del segundo. Si te
            responde 403, tu autorización sirve.
          </Step>
        </Steps>
      </Lesson>

      <Exercises>
        <Quiz
          id="auth-vs-autz"
          index={1}
          title="Autenticación y autorización"
          prompt="¿Cuál es la diferencia?"
          options={[
            { id: 'a', label: 'Autenticación es «quién eres»; autorización es «qué puedes hacer»' },
            { id: 'b', label: 'Son dos nombres para lo mismo' },
            { id: 'c', label: 'Autenticación es del frontend y autorización del backend' },
            { id: 'd', label: 'Autorización va antes que autenticación' },
          ]}
          answer="a"
          explanation="Primero identificas, después decides qué le permites. Un usuario autenticado no necesariamente puede tocar los datos de otro."
        />

        <TrueFalse
          id="password-plana"
          index={2}
          title="Guardar contraseñas"
          statement="Se puede guardar la contraseña en texto plano si la base de datos es privada."
          answer={false}
          explanation="Falso, siempre. Si alguien accede a la base tendría todas las contraseñas — y como la gente las repite, comprometerías también sus otras cuentas. Se guarda el hash."
        />

        <FillBlank
          id="hash-bcrypt"
          index={3}
          title="Al registrar"
          code={'const hash = await bcrypt.___(password, 12);'}
          options={['hash', 'compare', 'encrypt', 'sign']}
          answer="hash"
          explanation="hash convierte la contraseña; compare la verifica después. El 12 es el costo: entre más alto, más lento de calcular y más caro de romper."
        />

        <FillBlank
          id="compare-bcrypt"
          index={4}
          title="Al iniciar sesión"
          code={'const coincide = await bcrypt.___(password, usuario.passwordHash);'}
          options={['compare', 'hash', 'verify', 'match']}
          answer="compare"
          explanation="compare vuelve a calcular el hash de lo que escribió el usuario y lo compara con el guardado. Nunca se «descifra» el hash: eso no se puede."
        />

        <Quiz
          id="hash-reversible"
          index={5}
          title="Recuperar la contraseña"
          prompt="Un usuario olvidó su contraseña y te pide que se la digas. ¿Qué puedes hacer?"
          options={[
            { id: 'a', label: 'Nada: no la tienes. Solo puedes darle un modo de establecer una nueva' },
            { id: 'b', label: 'Buscarla en la base de datos y enviársela' },
            { id: 'c', label: 'Descifrar el hash' },
            { id: 'd', label: 'Pedírsela al navegador' },
          ]}
          answer="a"
          explanation="El hash no se revierte. Por eso los sistemas serios ofrecen «restablecer», nunca «recuperar»: si un sitio te manda tu contraseña por correo, la guardó mal."
        />

        <Quiz
          id="que-es-jwt"
          index={6}
          title="¿Qué es un JWT?"
          options={[
            { id: 'a', label: 'Un token firmado que dice quién eres y hasta cuándo vale' },
            { id: 'b', label: 'Una contraseña cifrada' },
            { id: 'c', label: 'Una cookie del navegador' },
            { id: 'd', label: 'Un tipo de base de datos' },
          ]}
          answer="a"
          explanation="Lleva datos y una firma. El servidor verifica la firma con su secreto: si alguien lo modifica, la firma deja de cuadrar y el token se rechaza."
        />

        <TrueFalse
          id="jwt-cifrado"
          index={7}
          title="¿El JWT esconde la información?"
          statement="El contenido de un JWT está cifrado y nadie puede leerlo."
          answer={false}
          explanation="Falso: está firmado, no cifrado. Cualquiera puede leer lo que lleva dentro. Lo que no puede es modificarlo sin romper la firma. Nunca metas datos sensibles en un token."
        />

        <MatchPairs
          id="empareja-codigos-auth"
          index={8}
          title="Empareja el código con la situación"
          pairs={[
            { id: '401', izquierda: '401', derecha: 'No iniciaste sesión' },
            { id: '403', izquierda: '403', derecha: 'Estás dentro, pero eso no es tuyo' },
            { id: '404', izquierda: '404', derecha: 'El recurso no existe' },
            { id: '400', izquierda: '400', derecha: 'Faltan datos en la petición' },
          ]}
          explanation="401 y 403 se confunden mucho: el primero es «no sé quién eres», el segundo es «sé quién eres y no puedes»."
        />

        <Quiz
          id="cookie-httponly"
          index={9}
          title="¿Dónde guardar el token?"
          options={[
            { id: 'a', label: 'En una cookie httpOnly, que el JavaScript de la página no puede leer' },
            { id: 'b', label: 'En localStorage, que es más cómodo' },
            { id: 'c', label: 'En una variable global' },
            { id: 'd', label: 'En la URL' },
          ]}
          answer="a"
          explanation="httpOnly la hace invisible para los scripts: si te inyectan código malicioso, no pueden robarla. Además el navegador la manda sola en cada petición."
        />

        <Quiz
          id="jwt-secret"
          index={10}
          title="El JWT_SECRET"
          prompt="¿Qué pasa si se filtra el secreto con el que firmas los tokens?"
          options={[
            { id: 'a', label: 'Cualquiera puede fabricar tokens válidos y entrar como cualquier usuario' },
            { id: 'b', label: 'No pasa nada, es público' },
            { id: 'c', label: 'Solo se caen las sesiones activas' },
            { id: 'd', label: 'Habría que cambiar las contraseñas de todos' },
          ]}
          answer="a"
          explanation="Es la llave maestra. Va en el .env, fuera del repositorio, y si se filtra hay que cambiarlo — lo que invalida todas las sesiones, que es justo lo que quieres."
        />

        <MultiSelect
          id="middleware-auth"
          index={11}
          title="El middleware de sesión"
          prompt="¿Qué debe hacer requireAuth?"
          options={[
            { id: 'lee', label: 'Leer el token de la cookie' },
            { id: 'verifica', label: 'Verificar la firma y que no esté vencido' },
            { id: 'user', label: 'Dejar el usuario disponible en req.user' },
            { id: '401', label: 'Responder 401 si no hay token válido' },
            { id: 'hash', label: 'Volver a hashear la contraseña' },
          ]}
          answers={['lee', 'verifica', 'user', '401']}
          explanation="La contraseña solo se toca en el login. Después, cada petición se resuelve con el token."
        />

        <Quiz
          id="filtrar-por-usuario"
          index={12}
          title="El bug que expone datos"
          prompt="En GET /tareas escribes Tarea.find() sin filtro. ¿Qué pasa?"
          options={[
            { id: 'a', label: 'Cada usuario ve las tareas de todos' },
            { id: 'b', label: 'No devuelve nada' },
            { id: 'c', label: 'Da error 500' },
            { id: 'd', label: 'Mongoose filtra solo por el usuario' },
          ]}
          answer="a"
          explanation="Devuelve la colección completa. Siempre Tarea.find({ usuario: req.user._id }): el filtro por dueño no es opcional."
        />

        <TrueFalse
          id="idor"
          index={13}
          title="Cambiar el id en la URL"
          statement="Si un usuario autenticado cambia el id en /tareas/:id y no verificas el dueño, puede leer las tareas de otro."
          answer={true}
          explanation="Verdadero, y es una de las fallas más comunes en apps reales. Estar autenticado no significa estar autorizado sobre ese dato en particular."
        />

        <FillBlank
          id="verificar-dueno"
          index={14}
          title="Verifica el dueño"
          code={
            'if (!tarea.usuario.equals(req.user._id)) {\n  return res.status(___).json({ error: "No es tuya" });\n}'
          }
          options={['403', '401', '404', '200']}
          answer="403"
          explanation="403: sé quién eres y no te corresponde. Algunos sistemas prefieren 404 para no revelar que el recurso existe — las dos posturas son defendibles."
        />

        <OrderSteps
          id="orden-login"
          index={15}
          title="Ordena el inicio de sesión"
          steps={[
            { id: 'buscar', text: 'Buscar el usuario por correo' },
            { id: 'compare', text: 'Comparar la contraseña con bcrypt.compare' },
            { id: 'activo', text: 'Verificar que la cuenta esté activa' },
            { id: 'token', text: 'Firmar el JWT' },
            { id: 'cookie', text: 'Enviarlo en una cookie httpOnly' },
          ]}
          explanation="Y ojo con el mensaje de error: si dices «ese correo no existe» le estás confirmando a un atacante qué correos están registrados. Un solo mensaje para los dos casos."
        />

        <Quiz
          id="mensaje-error-login"
          index={16}
          title="El mensaje del login fallido"
          prompt="El correo no existe. ¿Qué le respondes?"
          options={[
            { id: 'a', label: '«Usuario o contraseña incorrectos», igual que si la clave estuviera mal' },
            { id: 'b', label: '«Ese correo no está registrado»' },
            { id: 'c', label: '«La contraseña es incorrecta»' },
            { id: 'd', label: 'Mostrar el correo más parecido que encontraste' },
          ]}
          answer="a"
          explanation="El mismo mensaje para los dos casos: así nadie puede usar tu login para averiguar qué correos tienen cuenta."
        />

        <MultiSelect
          id="proteger-login"
          index={17}
          title="Proteger el login"
          prompt="Marca las medidas que valen la pena."
          options={[
            { id: 'rate', label: 'Límite de intentos por IP en un rango de tiempo' },
            { id: 'largo', label: 'Exigir una longitud mínima de contraseña' },
            { id: 'https', label: 'Servir el sitio por HTTPS' },
            { id: 'mensaje', label: 'Un mismo mensaje para usuario inexistente y clave errada' },
            { id: 'pregunta', label: 'Pedir la contraseña dos veces en cada login' },
          ]}
          answers={['rate', 'largo', 'https', 'mensaje']}
          explanation="Pedirla dos veces solo molesta al usuario legítimo. Las otras cuatro son medidas reales; sin HTTPS la contraseña viaja en texto claro por la red."
        />

        <Quiz
          id="expiracion"
          index={18}
          title="La expiración del token"
          prompt="¿Por qué el token vence a los 7 días y no nunca?"
          options={[
            { id: 'a', label: 'Para que un token robado deje de servir en algún momento' },
            { id: 'b', label: 'Porque los tokens ocupan espacio' },
            { id: 'c', label: 'Porque el navegador los borra igual' },
            { id: 'd', label: 'Para obligar a cambiar la contraseña' },
          ]}
          answer="a"
          explanation="Limita el daño. Un token sin vencimiento robado hoy sirve para siempre; uno de 7 días caduca solo."
        />

        <OrderSteps
          id="orden-reto"
          index={19}
          title="Ordena el reto integrador"
          steps={[
            { id: 'modelos', text: 'Crear los modelos Usuario y Tarea' },
            { id: 'registro', text: 'Ruta de registro con hash de la contraseña' },
            { id: 'login', text: 'Ruta de login que firma y envía el token' },
            { id: 'mw', text: 'Middleware que verifica el token y deja req.user' },
            { id: 'crud', text: 'CRUD de tareas filtrado por usuario' },
            { id: 'prueba', text: 'Probar con dos usuarios que ninguno vea lo del otro' },
          ]}
          explanation="El último paso es el que de verdad valida el trabajo: si con dos cuentas cada una ve solo lo suyo, la autorización está bien hecha."
        />

        <MultiSelect
          id="checklist-seguridad"
          index={20}
          title="Checklist de seguridad"
          prompt="Antes de entregar, verifica que…"
          options={[
            { id: 'hash', label: 'Las contraseñas están hasheadas, nunca en texto plano' },
            { id: 'env', label: 'El JWT_SECRET y la cadena de Mongo están en .env, fuera del repo' },
            { id: 'filtro', label: 'Todas las consultas filtran por el usuario dueño' },
            { id: 'codigos', label: 'Devuelves 401 y 403 según corresponda' },
            { id: 'valida', label: 'Validas lo que llega del cliente en el backend' },
            { id: 'consola', label: 'Imprimes la contraseña en consola para depurar' },
          ]}
          answers={['hash', 'env', 'filtro', 'codigos', 'valida']}
          explanation="Todo menos el último: un console.log de la contraseña la deja escrita en los registros del servidor, que suelen guardarse y compartirse."
        />
      </Exercises>
    </TopicPage>
  );
}
