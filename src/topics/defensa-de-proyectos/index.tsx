import { Exercises, Lesson, TopicPage } from '../../components/TopicPage';
import {
  FillBlank,
  MatchPairs,
  MultiSelect,
  OrderSteps,
  Quiz,
  TrueFalse,
} from '../../components/exercises';
import { Callout, Compare, Figure, RefTable, Step, Steps } from '../../components/visuals';

const SLUG = 'defensa-de-proyectos';

/** Sesión 25 del cronograma — defensa final del proyecto. */
export default function DefensaDeProyectos() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Qué se evalúa hoy">
        <p>
          No es un examen de memoria. Se evalúa si construiste algo que funciona, si entiendes lo
          que construiste, y si lo puedes explicar. Esas tres cosas juntas son lo que hace a alguien
          contratable.
        </p>
        <RefTable
          cabeceras={['Se evalúa', 'Cómo se nota']}
          filas={[
            ['Que funcione', 'La demo corre en vivo, en la URL pública, sin caerse'],
            ['Que lo entiendas', 'Respondes por qué está hecho así, no solo qué hace'],
            ['Que esté cuidado', 'Código organizado, commits con sentido, README completo'],
            ['Que lo sepas contar', 'Cinco minutos claros, sin perderse en detalles'],
            ['Que sepas qué falta', 'Reconoces las limitaciones y qué harías después'],
          ]}
        />
      </Lesson>

      <Lesson title="2. La estructura de la presentación">
        <Steps>
          <Step title="El problema (30 segundos)">
            Qué necesidad resuelve tu emprendimiento y para quién. Nada de tecnología todavía.
          </Step>
          <Step title="La demo (2 a 3 minutos)">
            La app funcionando. Un recorrido que muestre el valor: entrar, ver el catálogo, hacer
            algo, y el panel del administrador.
          </Step>
          <Step title="Cómo está construido (1 minuto)">
            Las piezas y por qué las elegiste. Una decisión técnica explicada vale más que una lista
            de tecnologías.
          </Step>
          <Step title="Lo difícil (30 segundos)">
            Un problema que enfrentaste y cómo lo resolviste. Esto es lo que más recuerdan los
            evaluadores.
          </Step>
          <Step title="Qué sigue (30 segundos)">
            Dos o tres cosas que agregarías. Muestra que sabes dónde están los límites de lo que
            hiciste.
          </Step>
        </Steps>
        <Callout>
          Cinco minutos se pasan volando. Ensáyalo en voz alta con un cronómetro <em>antes</em> del
          día: casi siempre la primera versión dura el doble.
        </Callout>
      </Lesson>

      <Lesson title="3. La demo: que no se caiga">
        <Compare
          bien={{
            titulo: 'Demo preparada',
            items: [
              'Pestañas abiertas antes de empezar',
              'Datos de prueba cargados y con sentido',
              'Recorrido ensayado, sin improvisar',
              'Una captura de respaldo por si falla internet',
              'Sesión iniciada de antemano si el login no es el punto',
            ],
          }}
          mal={{
            titulo: 'Demo improvisada',
            items: [
              'Buscar la URL en el momento',
              'Base vacía: no se ve nada',
              'Registrarse en vivo y fallar en la validación',
              'Sin plan B si algo no carga',
              'Descubrir un bug delante de todos',
            ],
          }}
        />
        <Callout tipo="ojo">
          Si algo falla en vivo, no te bloquees: dilo, explica qué debería pasar y sigue. Manejar
          bien un fallo deja mejor impresión que una demo perfecta y muda — les pasa a todos los
          equipos, en todas las empresas.
        </Callout>
      </Lesson>

      <Lesson title="4. Las preguntas que van a hacerte">
        <RefTable
          cabeceras={['Pregunta', 'Qué buscan saber']}
          filas={[
            ['¿Por qué elegiste esta estructura de datos?', 'Si decidiste o copiaste'],
            ['¿Qué pasa si la API no responde?', 'Si pensaste en los casos de fallo'],
            ['¿Cómo proteges el panel de administración?', 'Si entiendes que la seguridad es del backend'],
            ['Muéstrame dónde está el código que hace X', 'Si conoces tu propio repositorio'],
            ['¿Cómo agregarías una funcionalidad nueva?', 'Si entiendes tu arquitectura'],
            ['¿Qué fue lo más difícil?', 'Cómo enfrentas los problemas'],
            ['¿Usaste IA? ¿Para qué?', 'Si la usas con criterio — no es una trampa'],
          ]}
        />
        <Callout>
          Si no sabes algo, dilo. «No lo sé, pero lo buscaría en la documentación de Mongoose» es
          una respuesta profesional. Inventar se nota siempre, y cuesta mucho más caro.
        </Callout>
      </Lesson>

      <Lesson title="5. Después de la defensa">
        <Figure
          label="Diagrama: lo que queda después del curso"
          caption="El proyecto se entrega hoy, pero el repositorio, la URL y lo que aprendiste siguen contigo."
        >
          <svg viewBox="0 0 640 160" xmlns="http://www.w3.org/2000/svg">
            {[
              { t: 'Un repositorio', d: 'con historial real de trabajo', x: 0 },
              { t: 'Una app publicada', d: 'que cualquiera puede abrir', x: 220 },
              { t: 'Un método', d: 'para construir la siguiente', x: 440 },
            ].map(({ t, d, x }) => (
              <g key={t}>
                <rect x={x} y="30" width="196" height="80" rx="10" fill="var(--color-accent)" opacity="0.12" />
                <text x={x + 16} y="62" fontSize="14" fill="var(--color-text)">
                  {t}
                </text>
                <text x={x + 16} y="86" fontSize="12" fill="var(--color-text-2)">
                  {d}
                </text>
              </g>
            ))}
            <text x="0" y="146" fontSize="12" fill="var(--color-text-2)">
              Lo que más pesa en una entrevista es poder mostrar algo que hiciste y explicarlo.
            </text>
          </svg>
        </Figure>
        <p>
          Deja tu repositorio presentable: README claro, sin código comentado a medias, sin
          <code> console.log</code> de depuración. Alguien lo va a abrir sin ti al lado.
        </p>
      </Lesson>

      <Exercises>
        <Quiz
          id="que-evaluan"
          index={1}
          title="¿Qué se evalúa?"
          options={[
            { id: 'a', label: 'Que funcione, que lo entiendas y que lo puedas explicar' },
            { id: 'b', label: 'Cuántas líneas de código escribiste' },
            { id: 'c', label: 'Cuántas librerías usaste' },
            { id: 'd', label: 'Que sea la app más bonita' },
          ]}
          answer="a"
          explanation="Funcionar, entender y comunicar. Un proyecto sencillo bien entendido supera a uno ambicioso que nadie sabe explicar."
        />

        <OrderSteps
          id="orden-presentacion"
          index={2}
          title="Ordena la presentación"
          steps={[
            { id: 'problema', text: 'El problema que resuelve y para quién' },
            { id: 'demo', text: 'La demostración en vivo' },
            { id: 'como', text: 'Cómo está construido y por qué' },
            { id: 'dificil', text: 'Lo más difícil y cómo lo resolviste' },
            { id: 'sigue', text: 'Qué agregarías después' },
          ]}
          explanation="Problema antes que tecnología: si empiezas por el stack, la audiencia todavía no sabe para qué sirve nada de eso."
        />

        <Quiz
          id="empezar-por"
          index={3}
          title="Cómo abrir"
          prompt="¿Con qué frase conviene empezar?"
          options={[
            { id: 'a', label: '«Mi negocio vende café artesanal y necesitaba que los clientes pudieran pedir sin escribir por WhatsApp»' },
            { id: 'b', label: '«Usé React, Express, MongoDB, Mongoose, JWT y bcrypt»' },
            { id: 'c', label: '«No me alcanzó el tiempo para todo»' },
            { id: 'd', label: '«Voy a mostrar el código»' },
          ]}
          answer="a"
          explanation="El problema y la persona. La lista de tecnologías no dice nada sin contexto, y disculparse de entrada tumba la presentación."
        />

        <MultiSelect
          id="preparar-demo"
          index={4}
          title="Preparar la demo"
          prompt="Marca lo que conviene tener listo antes de empezar."
          options={[
            { id: 'pestanas', label: 'Las pestañas abiertas' },
            { id: 'datos', label: 'Datos de prueba cargados y con sentido' },
            { id: 'ensayo', label: 'El recorrido ensayado' },
            { id: 'captura', label: 'Capturas de respaldo por si falla internet' },
            { id: 'improvisar', label: 'Improvisar para que se vea natural' },
          ]}
          answers={['pestanas', 'datos', 'ensayo', 'captura']}
          explanation="Improvisar en una demo de cinco minutos es cómo se acaba el tiempo buscando una URL. Lo natural se logra ensayando."
        />

        <TrueFalse
          id="si-falla"
          index={5}
          title="Si algo falla en vivo"
          statement="Si la demo falla, lo mejor es reconocerlo, explicar qué debería pasar y continuar."
          answer={true}
          explanation="Verdadero. Le pasa a todo el mundo. Manejarlo con calma demuestra dominio; quedarse en silencio intentando arreglarlo, no."
        />

        <Quiz
          id="datos-vacios"
          index={6}
          title="La base vacía"
          prompt="Llegas a la demo y tu catálogo no tiene productos. ¿Qué pasó y cómo se evita?"
          options={[
            { id: 'a', label: 'No cargaste datos de prueba: hay que dejarlos listos con antelación' },
            { id: 'b', label: 'Se borró la base sola' },
            { id: 'c', label: 'Es normal, se explica y ya' },
            { id: 'd', label: 'Hay que crearlos en vivo' },
          ]}
          answer="a"
          explanation="Una app vacía no muestra nada de lo que construiste. Datos realistas —no «prueba 1», «prueba 2»— cargados desde antes."
        />

        <MatchPairs
          id="empareja-preguntas"
          index={7}
          title="Empareja la pregunta con lo que buscan"
          pairs={[
            { id: 'datos', izquierda: '¿Por qué esta estructura de datos?', derecha: 'Si decidiste o copiaste' },
            { id: 'falla', izquierda: '¿Qué pasa si la API no responde?', derecha: 'Si pensaste en los fallos' },
            { id: 'panel', izquierda: '¿Cómo proteges el panel?', derecha: 'Si entiendes dónde vive la seguridad' },
            { id: 'donde', izquierda: '¿Dónde está el código de X?', derecha: 'Si conoces tu repositorio' },
            { id: 'nuevo', izquierda: '¿Cómo agregarías una función?', derecha: 'Si entiendes tu arquitectura' },
          ]}
          explanation="Ninguna pregunta busca pillarte: buscan saber si el proyecto es tuyo de verdad."
        />

        <Quiz
          id="no-se"
          index={8}
          title="Cuando no sabes"
          prompt="Te preguntan algo que no sabes responder. ¿Qué haces?"
          options={[
            { id: 'a', label: 'Decir que no lo sabes y explicar cómo lo averiguarías' },
            { id: 'b', label: 'Inventar una respuesta que suene bien' },
            { id: 'c', label: 'Cambiar de tema' },
            { id: 'd', label: 'Decir que lo hizo tu compañero' },
          ]}
          answer="a"
          explanation="Reconocerlo y decir dónde buscarías es una respuesta profesional. Inventar se nota, y una vez que se nota, todo lo demás queda en duda."
        />

        <Quiz
          id="seguridad-panel"
          index={9}
          title="«¿Cómo proteges el panel?»"
          prompt="¿Cuál respuesta es correcta?"
          options={[
            {
              id: 'a',
              label: 'La ruta del frontend redirige si no hay sesión, y la API verifica el token y el rol en cada petición',
            },
            { id: 'b', label: 'El enlace no aparece en el menú' },
            { id: 'c', label: 'La URL es difícil de adivinar' },
            { id: 'd', label: 'Está en una carpeta aparte' },
          ]}
          answer="a"
          explanation="La respuesta completa menciona las dos capas y deja claro cuál es la que protege: la del backend."
        />

        <Quiz
          id="pregunta-ia"
          index={10}
          title="«¿Usaste IA?»"
          prompt="¿Cómo respondes?"
          options={[
            { id: 'a', label: 'Con honestidad: para qué la usaste y cómo revisaste lo que entregó' },
            { id: 'b', label: 'Negarlo' },
            { id: 'c', label: 'Decir que la usaste para todo' },
            { id: 'd', label: 'Cambiar de tema' },
          ]}
          answer="a"
          explanation="No es una trampa: usarla es normal en la industria. Lo que evalúan es el criterio con que la usaste."
        />

        <MultiSelect
          id="repositorio-presentable"
          index={11}
          title="Un repositorio presentable"
          prompt="Antes de la defensa, revisa que…"
          options={[
            { id: 'readme', label: 'El README explique qué es, cómo correrlo y tenga la URL' },
            { id: 'logs', label: 'No queden console.log de depuración' },
            { id: 'muerto', label: 'No haya bloques de código comentado a medias' },
            { id: 'commits', label: 'Los commits tengan mensajes con sentido' },
            { id: 'secretos', label: 'No haya secretos en el historial' },
            { id: 'lineas', label: 'Tenga muchas líneas de código' },
          ]}
          answers={['readme', 'logs', 'muerto', 'commits', 'secretos']}
          explanation="La cantidad de código no es mérito. Lo que se lee es el orden y la claridad."
        />

        <TrueFalse
          id="ensayar"
          index={12}
          title="Ensayar"
          statement="Conviene ensayar la presentación en voz alta con cronómetro antes del día."
          answer={true}
          explanation="Verdadero. En la cabeza todo dura tres minutos; en voz alta suele durar ocho. Solo se descubre ensayando."
        />

        <Quiz
          id="que-mostrar-demo"
          index={13}
          title="Qué mostrar en la demo"
          prompt="Tienes tres minutos de demostración. ¿Qué recorrido eliges?"
          options={[
            { id: 'a', label: 'El camino que muestra el valor: entrar, ver el catálogo, hacer un pedido y el panel del admin' },
            { id: 'b', label: 'Todas las pantallas, una por una' },
            { id: 'c', label: 'El código de cada archivo' },
            { id: 'd', label: 'La consola del navegador' },
          ]}
          answer="a"
          explanation="Un recorrido con hilo, no un inventario. Que se entienda para qué sirve la app, no cuántas pantallas tiene."
        />

        <Quiz
          id="lo-dificil"
          index={14}
          title="«¿Qué fue lo más difícil?»"
          prompt="¿Cuál respuesta deja mejor impresión?"
          options={[
            {
              id: 'a',
              label:
                '«La sesión: el usuario se salía al recargar. Descubrí que la ruta protegida decidía antes de que cargara la sesión, y lo resolví con un estado de carga»',
            },
            { id: 'b', label: '«Todo fue fácil»' },
            { id: 'c', label: '«Nada funcionaba»' },
            { id: 'd', label: '«El tiempo»' },
          ]}
          answer="a"
          explanation="Problema concreto, diagnóstico y solución. Eso demuestra capacidad de depurar, que es la habilidad que más se valora."
        />

        <FillBlank
          id="cierre"
          index={15}
          title="El cierre"
          prompt="Para terminar mostrando que sabes dónde están los límites."
          code={'"Si tuviera dos semanas más, agregaría ___"'}
          options={[
            'pasarela de pagos y notificaciones por correo',
            'más colores',
            'nada, está perfecto',
            'no sé',
          ]}
          answer="pasarela de pagos y notificaciones por correo"
          explanation="Concreto y realista. Decir que está perfecto suena a que no revisaste; decir «no sé» desaprovecha el cierre."
        />

        <MultiSelect
          id="antes-de-presentar"
          index={16}
          title="La lista del día"
          prompt="Marca lo que revisas antes de presentar."
          options={[
            { id: 'url', label: 'Que la URL pública cargue' },
            { id: 'datos', label: 'Que haya datos de prueba' },
            { id: 'cuenta', label: 'Que la cuenta de demostración funcione' },
            { id: 'internet', label: 'Tener capturas por si falla la conexión' },
            { id: 'nuevo', label: 'Subir un cambio de último momento' },
          ]}
          answers={['url', 'datos', 'cuenta', 'internet']}
          explanation="Nada de cambios de último momento: es la forma más común de romper una demo que funcionaba."
        />

        <Quiz
          id="equipo-presenta"
          index={17}
          title="Presentar en equipo"
          prompt="Son tres personas. ¿Cómo se reparten?"
          options={[
            { id: 'a', label: 'Cada uno presenta la parte que construyó, con los tiempos acordados' },
            { id: 'b', label: 'Habla solo el que mejor se expresa' },
            { id: 'c', label: 'Los tres hablan a la vez' },
            { id: 'd', label: 'Se improvisa en el momento' },
          ]}
          answer="a"
          explanation="Cada quien responde por lo suyo, y a todos les pueden preguntar. Que hable uno solo deja la impresión de que los demás no participaron."
        />

        <TrueFalse
          id="portafolio"
          index={18}
          title="Después del curso"
          statement="Este proyecto y su repositorio te sirven como portafolio para buscar trabajo o prácticas."
          answer={true}
          explanation="Verdadero. Un proyecto publicado que puedes explicar es lo que más pesa cuando todavía no tienes experiencia laboral."
        />

        <Quiz
          id="mantener-vivo"
          index={19}
          title="Mantenerlo vivo"
          prompt="El curso terminó. ¿Qué conviene hacer con el proyecto?"
          options={[
            { id: 'a', label: 'Dejarlo publicado, seguir mejorándolo de a poco y mantener el README al día' },
            { id: 'b', label: 'Borrar el repositorio' },
            { id: 'c', label: 'Ponerlo en privado' },
            { id: 'd', label: 'No tocarlo nunca más' },
          ]}
          answer="a"
          explanation="Un repositorio con actividad después del curso dice mucho: que aprendiste porque te interesa, no solo porque lo pedían."
        />

        <MultiSelect
          id="cierre-curso"
          index={20}
          title="Lo que te llevas"
          prompt="Al terminar las 25 sesiones tienes…"
          options={[
            { id: 'app', label: 'Una aplicación full stack publicada' },
            { id: 'repo', label: 'Un repositorio con historial de trabajo real' },
            { id: 'metodo', label: 'Un método para construir la siguiente' },
            { id: 'ia', label: 'Criterio para usar la IA como herramienta' },
            { id: 'todo', label: 'Todo el conocimiento que existe sobre programación' },
          ]}
          answers={['app', 'repo', 'metodo', 'ia']}
          explanation="Lo último no lo tiene nadie, y ese es el punto: lo que te llevas es la capacidad de seguir aprendiendo por tu cuenta."
        />
      </Exercises>
    </TopicPage>
  );
}
