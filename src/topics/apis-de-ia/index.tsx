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

const SLUG = 'apis-de-ia';

/** Sesión 21 del cronograma — consumir una API de IA desde el backend. */
export default function ApisDeIa() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Del chat a la API">
        <p>
          Hasta ahora usabas la IA desde una página web. Hoy la usas desde tu código: le mandas una
          petición HTTP y te devuelve JSON, igual que la PokeAPI de la sesión 10. La diferencia es
          que esta petición <strong>cuesta dinero</strong> y necesita una <strong>clave</strong>.
        </p>
        <p>
          Con eso puedes ponerle a tu emprendimiento un asistente que responda preguntas sobre tus
          productos, que redacte descripciones, o que clasifique los mensajes de contacto.
        </p>
      </Lesson>

      <Lesson title="2. La regla de oro: la clave vive en el backend">
        <Figure
          label="Diagrama: el navegador llama a tu backend y el backend llama a la IA"
          caption="Tu clave nunca sale del servidor. El navegador solo habla con tu API, y tu API es la única que conoce la credencial."
        >
          <svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="50" width="150" height="70" rx="8" fill="var(--color-text)" opacity="0.07" />
            <text x="75" y="80" fontSize="13" textAnchor="middle" fill="var(--color-text)">
              Navegador
            </text>
            <text x="75" y="100" fontSize="11" textAnchor="middle" fill="var(--color-text)" opacity="0.5">
              sin claves
            </text>

            <line x1="160" y1="85" x2="228" y2="85" stroke="var(--color-accent)" strokeWidth="1.2" />
            <path d="M235 85 l-8 -4.5 l0 9 z" fill="var(--color-accent)" />
            <text x="166" y="75" fontSize="11" fill="var(--color-accent)" fontFamily="ui-monospace, monospace">
              POST /api/chat
            </text>

            <rect x="245" y="50" width="150" height="70" rx="8" fill="var(--color-accent)" opacity="0.16" />
            <text x="320" y="80" fontSize="13" textAnchor="middle" fill="var(--color-text)">
              Tu backend
            </text>
            <text x="320" y="100" fontSize="11" textAnchor="middle" fill="var(--color-text)" opacity="0.6">
              aquí vive la clave
            </text>

            <line x1="405" y1="85" x2="473" y2="85" stroke="var(--color-accent)" strokeWidth="1.2" />
            <path d="M480 85 l-8 -4.5 l0 9 z" fill="var(--color-accent)" />
            <text x="410" y="75" fontSize="11" fill="var(--color-accent)" fontFamily="ui-monospace, monospace">
              + API key
            </text>

            <rect x="490" y="50" width="150" height="70" rx="8" fill="var(--color-text)" opacity="0.07" />
            <text x="565" y="80" fontSize="13" textAnchor="middle" fill="var(--color-text)">
              API de IA
            </text>

            <text x="0" y="170" fontSize="12" fill="var(--color-text)" opacity="0.5">
              Si el navegador llamara directo a la IA, la clave viajaría al cliente y cualquiera podría verla
            </text>
            <text x="0" y="192" fontSize="12" fill="var(--color-text)" opacity="0.5">
              en la pestaña Network — y gastarla a tu nombre.
            </text>
          </svg>
        </Figure>

        <Callout tipo="ojo">
          Todo lo que llega al navegador es público. Una clave en el código del frontend se lee en
          diez segundos abriendo las herramientas de desarrollo — y como esas claves se cobran por
          uso, el gasto queda a tu nombre.
        </Callout>
      </Lesson>

      <Lesson title="3. La petición, pieza por pieza">
        <Terminal
          titulo="rutas/chat.js"
          lineas={[
            "app.post('/api/chat', requireAuth, async (req, res) => {",
            '  const { mensaje } = req.body;',
            "  if (!mensaje) return res.status(400).json({ error: 'Falta el mensaje' });",
            '',
            '  try {',
            '    const respuesta = await fetch(URL_DEL_PROVEEDOR, {',
            "      method: 'POST',",
            '      headers: {',
            "        'Content-Type': 'application/json',",
            '        Authorization: `Bearer ${process.env.IA_API_KEY}`,',
            '      },',
            '      body: JSON.stringify({',
            '        model: MODELO,',
            '        messages: [',
            "          { role: 'system', content: 'Eres el asistente de una cafetería...' },",
            "          { role: 'user', content: mensaje },",
            '        ],',
            '        max_tokens: 300,',
            '      }),',
            '    });',
            '',
            '    const datos = await respuesta.json();',
            '    res.json({ texto: datos.choices[0].message.content });',
            '  } catch (error) {',
            "    res.status(502).json({ error: 'El servicio de IA no respondió' });",
            '  }',
            '});',
          ]}
        />
        <RefTable
          cabeceras={['Pieza', 'Qué es']}
          filas={[
            [<code key="a">Authorization: Bearer …</code>, 'La cabecera con tu clave: es lo que te identifica'],
            [<code key="b">model</code>, 'Qué modelo quieres usar'],
            [<code key="c">role: "system"</code>, 'Las instrucciones fijas: quién es el asistente y qué puede hacer'],
            [<code key="d">role: "user"</code>, 'Lo que escribió la persona'],
            [<code key="e">max_tokens</code>, 'El techo de la respuesta: controla el costo'],
          ]}
        />
      </Lesson>

      <Lesson title="4. Tokens y costo">
        <p>
          Los proveedores cobran por <strong>tokens</strong>: pedazos de palabra, tanto los que
          mandas como los que te devuelven. Un texto en español ronda 1 token cada 3 o 4 caracteres.
        </p>
        <Compare
          bien={{
            titulo: 'Gastar poco',
            items: [
              'Instrucciones de sistema cortas y claras',
              'max_tokens según lo que de verdad necesitas',
              'No mandar toda la conversación si no hace falta',
              'Guardar respuestas repetidas en caché',
            ],
          }}
          mal={{
            titulo: 'Quemar el presupuesto',
            items: [
              'Pegar el catálogo completo en cada petición',
              'Sin límite de tokens en la respuesta',
              'Sin límite de peticiones por usuario',
              'Reintentar en bucle cuando falla',
            ],
          }}
        />
        <Callout tipo="ojo">
          Pon un <strong>límite de peticiones por usuario</strong> desde el primer día. Sin eso, una
          persona con un bucle mal escrito —o alguien de mala fe— puede agotar tu crédito en
          minutos. El middleware de rate limit de la sesión 15 sirve igual aquí.
        </Callout>
      </Lesson>

      <Lesson title="5. Diseñar el asistente de tu negocio">
        <Steps>
          <Step title="Define para qué sirve, en una frase">
            «Responde preguntas sobre nuestros cafés, horarios y despachos.» Si no lo puedes decir
            en una frase, el asistente va a responder cualquier cosa.
          </Step>
          <Step title="Escribe las instrucciones de sistema">
            Quién es, qué tono usa, y sobre todo <em>qué NO hace</em>: «Si te preguntan algo fuera
            del negocio, responde que solo puedes ayudar con temas de la tienda.»
          </Step>
          <Step title="Dale los datos que necesita">
            El catálogo, los horarios. Solo lo necesario: cada dato extra son tokens en cada
            petición.
          </Step>
          <Step title="Maneja el fallo">
            El servicio puede caerse, demorarse o rechazar la petición. Tu app debe seguir viva y
            avisar con claridad.
          </Step>
          <Step title="Avisa que es una IA">
            Que el usuario sepa con qué está hablando. Es honestidad básica y evita malentendidos.
          </Step>
        </Steps>
      </Lesson>

      <Exercises>
        <Quiz
          id="donde-la-clave"
          index={1}
          title="¿Dónde va la clave?"
          options={[
            { id: 'a', label: 'En el .env del backend, y solo el backend llama a la IA' },
            { id: 'b', label: 'En el JavaScript del frontend, así es más rápido' },
            { id: 'c', label: 'En el HTML, en una etiqueta oculta' },
            { id: 'd', label: 'En el repositorio, para no perderla' },
          ]}
          answer="a"
          explanation="Todo lo que llega al navegador es público. La clave se queda en el servidor y el frontend habla únicamente con tu API."
        />

        <TrueFalse
          id="clave-en-front"
          index={2}
          title="Esconder la clave en el frontend"
          statement="Si guardas la clave en una variable con nombre raro dentro del JavaScript, nadie la encuentra."
          answer={false}
          explanation="Falso. Todo el código del frontend se descarga al navegador: cualquiera lo abre y busca. No hay forma de esconder un secreto en el cliente."
        />

        <FillBlank
          id="header-auth"
          index={3}
          title="La cabecera de autenticación"
          code={"headers: {\n  Authorization: `___ ${process.env.IA_API_KEY}`,\n}"}
          options={['Bearer', 'Basic', 'Token', 'Key']}
          answer="Bearer"
          explanation="Bearer es el esquema estándar para tokens de acceso. La mayoría de las APIs de IA lo usan."
        />

        <MatchPairs
          id="empareja-roles"
          index={4}
          title="Empareja el rol del mensaje"
          pairs={[
            { id: 'system', izquierda: 'system', derecha: 'Las instrucciones fijas del asistente' },
            { id: 'user', izquierda: 'user', derecha: 'Lo que escribió la persona' },
            { id: 'assistant', izquierda: 'assistant', derecha: 'Lo que respondió el modelo antes' },
          ]}
          explanation="El rol system define el comportamiento. Los otros dos arman el historial de la conversación cuando quieres que recuerde lo anterior."
        />

        <Quiz
          id="que-es-token"
          index={5}
          title="¿Qué es un token?"
          options={[
            { id: 'a', label: 'Un pedazo de palabra: la unidad con la que se mide y se cobra el texto' },
            { id: 'b', label: 'La clave de acceso a la API' },
            { id: 'c', label: 'Una cookie de sesión' },
            { id: 'd', label: 'Un tipo de error' },
          ]}
          answer="a"
          explanation="Cuidado con el nombre: el token de un JWT y el token de un modelo son cosas distintas. Aquí es una unidad de texto, y se cobra tanto lo que mandas como lo que recibes."
        />

        <MultiSelect
          id="controlar-costo"
          index={6}
          title="Controlar el costo"
          prompt="Marca lo que de verdad reduce el gasto."
          options={[
            { id: 'max', label: 'Poner max_tokens en la respuesta' },
            { id: 'system', label: 'Instrucciones de sistema cortas' },
            { id: 'cache', label: 'Guardar en caché respuestas que se repiten' },
            { id: 'rate', label: 'Límite de peticiones por usuario' },
            { id: 'catalogo', label: 'Mandar el catálogo completo en cada petición' },
          ]}
          answers={['max', 'system', 'cache', 'rate']}
          explanation="Todo menos el catálogo completo: eso multiplica los tokens de entrada en cada llamada. Manda solo lo que la pregunta necesita."
        />

        <Quiz
          id="rate-limit-ia"
          index={7}
          title="Sin límite de peticiones"
          prompt="Publicas el chat sin límite por usuario. ¿Cuál es el riesgo?"
          options={[
            { id: 'a', label: 'Que alguien agote tu crédito en minutos con un bucle' },
            { id: 'b', label: 'Que la página cargue lento' },
            { id: 'c', label: 'Que el modelo se confunda' },
            { id: 'd', label: 'Ninguno' },
          ]}
          answer="a"
          explanation="Cada petición cuesta. Un bucle mal escrito o alguien de mala fe puede hacer miles en poco tiempo: el rate limit no es opcional aquí."
        />

        <FillBlank
          id="instruccion-sistema"
          index={8}
          title="Las instrucciones de sistema"
          prompt="Quieres que el asistente no se salga del tema del negocio."
          code={
            "{ role: 'system', content: 'Eres el asistente de una cafetería. ___' }"
          }
          options={[
            'Si te preguntan algo ajeno al negocio, responde que solo ayudas con temas de la tienda.',
            'Responde lo que sea.',
            'Sé simpático.',
            'Usa muchos emojis.',
          ]}
          answer="Si te preguntan algo ajeno al negocio, responde que solo ayudas con temas de la tienda."
          explanation="Decir qué NO debe hacer es tan importante como decir qué sí. Sin ese límite, tu asistente de cafetería termina explicando ecuaciones."
        />

        <Quiz
          id="servicio-caido"
          index={9}
          title="El servicio no responde"
          prompt="La API de IA se demora o devuelve error. ¿Qué debe hacer tu backend?"
          options={[
            { id: 'a', label: 'Atrapar el error y responder un mensaje claro, sin tumbar la app' },
            { id: 'b', label: 'Reintentar en bucle hasta que responda' },
            { id: 'c', label: 'Dejar que el servidor se caiga' },
            { id: 'd', label: 'Devolver una respuesta inventada' },
          ]}
          answer="a"
          explanation="Try/catch y un mensaje honesto. El bucle de reintentos gasta crédito y puede empeorar la caída; inventar una respuesta es peor todavía."
        />

        <TrueFalse
          id="datos-a-la-ia"
          index={10}
          title="Qué le mandas al proveedor"
          statement="Los datos que envías a la API de IA salen de tu servidor hacia un tercero."
          answer={true}
          explanation="Verdadero. Es una empresa externa: aplica lo mismo que en el chat. No mandes datos personales de tus clientes sin haberlo pensado y avisado."
        />

        <OrderSteps
          id="orden-ruta-ia"
          index={11}
          title="Ordena la ruta del chat"
          steps={[
            { id: 'auth', text: 'Verificar la sesión con el middleware' },
            { id: 'valida', text: 'Validar que venga el mensaje' },
            { id: 'llama', text: 'Llamar a la API de IA con la clave del .env' },
            { id: 'extrae', text: 'Extraer el texto de la respuesta' },
            { id: 'responde', text: 'Devolverlo al frontend en JSON' },
          ]}
          explanation="La sesión primero: si la ruta es pública, cualquiera en internet gasta tu crédito."
        />

        <Quiz
          id="502"
          index={12}
          title="El código del error"
          prompt="Tu servidor está bien, pero la API de IA no respondió. ¿Qué código devuelves?"
          options={[
            { id: 'a', label: '502 o 503: falló un servicio del que dependes' },
            { id: 'b', label: '200, con un mensaje de error adentro' },
            { id: 'c', label: '404' },
            { id: 'd', label: '400' },
          ]}
          answer="a"
          explanation="502 Bad Gateway describe justamente eso: el intermediario recibió una respuesta inválida del servicio del que depende. 400 le echaría la culpa al cliente."
        />

        <MultiSelect
          id="usos-ia-proyecto"
          index={13}
          title="Ideas para tu emprendimiento"
          prompt="Marca los usos razonables de una API de IA en tu proyecto."
          options={[
            { id: 'chat', label: 'Un asistente que responde sobre productos y horarios' },
            { id: 'desc', label: 'Generar descripciones de producto a partir de datos' },
            { id: 'clasif', label: 'Clasificar los mensajes de contacto por tema' },
            { id: 'resumen', label: 'Resumir los comentarios de los clientes' },
            { id: 'precio', label: 'Dejar que la IA decida sola los precios y cobre a los clientes' },
          ]}
          answers={['chat', 'desc', 'clasif', 'resumen']}
          explanation="Los cuatro primeros son asistencia. El último le entrega una decisión de negocio con consecuencias de dinero a un sistema que puede equivocarse sin avisar."
        />

        <Quiz
          id="avisar-ia"
          index={14}
          title="¿Hay que avisar que es una IA?"
          options={[
            { id: 'a', label: 'Sí: el usuario debe saber con qué está hablando' },
            { id: 'b', label: 'No, es mejor que crea que es una persona' },
            { id: 'c', label: 'Solo si pregunta' },
            { id: 'd', label: 'Da igual' },
          ]}
          answer="a"
          explanation="Es honestidad básica y además ajusta las expectativas: quien sabe que habla con una IA verifica los datos importantes."
        />

        <Quiz
          id="respuesta-inventada"
          index={15}
          title="El asistente inventó un producto"
          prompt="Un cliente pregunta por un café que no vendes y el asistente le dice el precio. ¿Qué falló?"
          options={[
            { id: 'a', label: 'Las instrucciones de sistema: hay que decirle que use solo el catálogo y que responda «no lo tenemos» si no está' },
            { id: 'b', label: 'La clave está mal' },
            { id: 'c', label: 'El modelo es viejo' },
            { id: 'd', label: 'Falta rate limit' },
          ]}
          answer="a"
          explanation="Sin límites explícitos, el modelo completa con lo que suene plausible. Darle el catálogo y prohibirle inventar es parte del diseño."
        />

        <FillBlank
          id="env-key"
          index={16}
          title="Leer la clave"
          code={'Authorization: `Bearer ${___.IA_API_KEY}`'}
          options={['process.env', 'window', 'localStorage', 'document']}
          answer="process.env"
          explanation="process.env lee las variables de entorno en Node. window y localStorage son del navegador: si aparecen en tu backend, algo está mal."
        />

        <TrueFalse
          id="env-gitignore"
          index={17}
          title="El .env y Git"
          statement="El archivo .env con la clave de la IA va en el .gitignore."
          answer={true}
          explanation="Verdadero, y si alguna vez lo subes por error, la clave se considera comprometida: hay que revocarla y generar otra, no basta con borrar el archivo."
        />

        <Quiz
          id="max-tokens"
          index={18}
          title="max_tokens"
          prompt="¿Qué pasa si no pones max_tokens?"
          options={[
            { id: 'a', label: 'La respuesta puede salir mucho más larga de lo necesario, y eso se cobra' },
            { id: 'b', label: 'La petición falla' },
            { id: 'c', label: 'El modelo responde más rápido' },
            { id: 'd', label: 'No pasa nada' },
          ]}
          answer="a"
          explanation="Es el techo de la respuesta. Para un asistente de tienda, 200 o 300 tokens suelen sobrar — y acotan tanto el costo como la verborrea."
        />

        <MultiSelect
          id="checklist-ia-api"
          index={19}
          title="Checklist antes de publicar el asistente"
          options={[
            { id: 'clave', label: 'La clave está solo en el .env del servidor' },
            { id: 'auth', label: 'La ruta exige sesión' },
            { id: 'rate', label: 'Hay límite de peticiones por usuario' },
            { id: 'max', label: 'max_tokens está definido' },
            { id: 'error', label: 'El fallo del servicio está manejado' },
            { id: 'aviso', label: 'El usuario sabe que habla con una IA' },
          ]}
          answers={['clave', 'auth', 'rate', 'max', 'error', 'aviso']}
          explanation="Las seis. Las tres primeras protegen tu bolsillo y tu cuenta; las tres últimas, la experiencia del usuario."
        />

        <Quiz
          id="mismo-patron"
          index={20}
          title="Ya sabías hacer esto"
          prompt="¿En qué se parece llamar a una API de IA a lo que hiciste en la sesión 10 con la PokeAPI?"
          options={[
            { id: 'a', label: 'Es el mismo patrón: fetch, esperar la respuesta, convertir el JSON y usar los datos' },
            { id: 'b', label: 'No se parece en nada' },
            { id: 'c', label: 'La IA no usa HTTP' },
            { id: 'd', label: 'Solo se parece en el nombre' },
          ]}
          answer="a"
          explanation="Exactamente el mismo patrón. Lo único nuevo es la clave, el costo y que la llamada se hace desde el servidor y no desde el navegador."
        />
      </Exercises>
    </TopicPage>
  );
}
