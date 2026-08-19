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

const SLUG = 'ia-en-desarrollo';

/** Sesión 20 del cronograma — la IA como herramienta de trabajo. */
export default function IaEnDesarrollo() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. La misma IA de la sesión 1, con otros ojos">
        <p>
          En la primera sesión usaste la IA para inventar el nombre de tu negocio. Ahora sabes
          programar, y eso cambia la relación: puedes <strong>juzgar</strong> lo que te responde. Un
          principiante recibe código y lo pega; alguien que entiende lee, evalúa y decide.
        </p>
        <Callout>
          Regla del módulo: <strong>solo entregas código que puedas explicar.</strong> No porque
          usar IA esté mal — se usa todos los días en la industria — sino porque en la defensa del
          proyecto, y en cualquier trabajo, te van a preguntar por qué está escrito así.
        </Callout>
      </Lesson>

      <Lesson title="2. Para qué sirve de verdad">
        <Compare
          bien={{
            titulo: 'Donde rinde',
            items: [
              'Explicarte un error que no entiendes',
              'Escribir código repetitivo que ya sabes hacer',
              'Proponer nombres, estructuras y alternativas',
              'Traducir de un lenguaje a otro',
              'Escribir pruebas y datos de ejemplo',
              'Revisar tu código y señalar riesgos',
            ],
          }}
          mal={{
            titulo: 'Donde falla',
            items: [
              'Decidir la arquitectura de tu proyecto',
              'Saber qué necesitan tus usuarios',
              'Garantizar que algo es seguro',
              'Conocer tu código completo si no se lo muestras',
              'Datos actuales de librerías nuevas',
              'Responder «no sé» cuando no sabe',
            ],
          }}
        />
      </Lesson>

      <Lesson title="3. Cómo pedir ayuda con un error">
        <p>
          «No me funciona» no le sirve a nadie, ni a la IA ni a un compañero. Un buen reporte tiene
          cuatro partes:
        </p>
        <Steps>
          <Step title="Qué esperabas">
            «Al enviar el formulario debería crearse la tarea y aparecer en la lista.»
          </Step>
          <Step title="Qué pasó">
            «La tarea se crea en la base de datos pero la lista no se actualiza hasta que recargo.»
          </Step>
          <Step title="El error exacto">
            Copiado y pegado, completo. Un error resumido de memoria pierde justo el dato que
            importaba.
          </Step>
          <Step title="El código relevante">
            La función que falla y las líneas alrededor. Ni un fragmento de tres líneas sin
            contexto, ni el proyecto entero.
          </Step>
        </Steps>
        <Terminal
          titulo="Un buen prompt de depuración"
          lineas={[
            'Tengo un componente de React que agrega tareas contra mi API de Express.',
            'Esperaba: al enviar, la tarea aparece en la lista.',
            'Pasa: se guarda en Mongo pero la lista no cambia hasta recargar.',
            'Error en consola: ninguno.',
            'Este es el manejador del submit y el useEffect que carga la lista:',
            '[código]',
            '¿Qué está mal y por qué?',
          ]}
        />
        <Callout>
          Fíjate en el «¿y por qué?» del final. Pedir la explicación además de la solución convierte
          una respuesta que copias en una lección que aprendes.
        </Callout>
      </Lesson>

      <Lesson title="4. Revisar lo que te entrega">
        <RefTable
          cabeceras={['Qué revisar', 'Pregunta concreta']}
          filas={[
            ['¿Hace lo que pedí?', 'Léelo línea por línea, no solo el resumen'],
            ['¿Entiendo cada línea?', 'Si hay una que no entiendes, pregúntale por esa'],
            ['¿Inventó algo?', 'Funciones o propiedades que no existen en la librería'],
            ['¿Y los casos raros?', 'Lista vacía, red caída, usuario sin permiso'],
            ['¿Es seguro?', 'Datos del cliente sin validar, credenciales en el código'],
            ['¿Encaja con mi proyecto?', 'Mismo estilo, mismas convenciones, mismas librerías'],
          ]}
        />
        <Callout tipo="ojo">
          El riesgo más traicionero no es el código que falla — ese lo ves de una. Es el que{' '}
          <em>funciona</em> pero hace algo distinto de lo que crees: devuelve datos de más, no valida
          el permiso, o guarda mal un caso límite que aparecerá dentro de un mes.
        </Callout>
      </Lesson>

      <Lesson title="5. Lo que nunca se le pega a un chat">
        <Figure
          label="Diagrama: qué se puede compartir con una IA y qué no"
          caption="Regla práctica: si no lo publicarías en un grupo de WhatsApp del colegio, no lo pegues en un chat de IA."
        >
          <svg viewBox="0 0 640 180" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="20" width="300" height="140" rx="10" fill="var(--color-accent)" opacity="0.1" />
            <text x="20" y="46" fontSize="11" letterSpacing="1.2" fill="var(--color-accent)">
              SE PUEDE
            </text>
            {['Tu código sin credenciales', 'Mensajes de error', 'Datos inventados de prueba', 'Preguntas de concepto'].map(
              (t, i) => (
                <text key={t} x="20" y={74 + i * 22} fontSize="12.5" fill="var(--color-text)" opacity="0.8">
                  {t}
                </text>
              ),
            )}

            <rect x="330" y="20" width="300" height="140" rx="10" fill="var(--color-text)" opacity="0.06" />
            <text x="350" y="46" fontSize="11" letterSpacing="1.2" fill="var(--color-neutral-400)">
              NUNCA
            </text>
            {['Contraseñas, tokens, JWT_SECRET', 'Datos reales de clientes', 'Cédulas, teléfonos, correos', 'La cadena de conexión'].map(
              (t, i) => (
                <text key={t} x="350" y={74 + i * 22} fontSize="12.5" fill="var(--color-text)" opacity="0.8">
                  {t}
                </text>
              ),
            )}
          </svg>
        </Figure>
      </Lesson>

      <Lesson title="6. Trabajar con IA sin perder el control del proyecto">
        <Steps>
          <Step title="Pide de a poco">
            Una función, no un módulo completo. Lo que llega en pedazos pequeños se revisa; lo que
            llega en bloques de 300 líneas se acepta sin leer.
          </Step>
          <Step title="Prueba antes de seguir">
            Cada pedazo que integres, pruébalo. Si acumulas cinco cambios sin probar y algo falla,
            no vas a saber cuál fue.
          </Step>
          <Step title="Haz commit de lo que funciona">
            Un commit por pieza probada. Así siempre tienes un punto sano al que volver.
          </Step>
          <Step title="Anota lo que no entendiste">
            Vuelve sobre eso después, con calma o con el mentor. La deuda de entendimiento se paga
            con intereses en la defensa del proyecto.
          </Step>
        </Steps>
      </Lesson>

      <Exercises>
        <Quiz
          id="regla-modulo"
          index={1}
          title="La regla del módulo"
          prompt="¿Cuál es la condición para usar IA en el proyecto?"
          options={[
            { id: 'a', label: 'Poder explicar cada línea que entregas' },
            { id: 'b', label: 'No usarla nunca' },
            { id: 'c', label: 'Usarla solo para el diseño' },
            { id: 'd', label: 'Avisar en cada commit que la usaste' },
          ]}
          answer="a"
          explanation="No hay prohibición: hay una condición. Si no puedes explicarlo, no lo entregues — porque tampoco vas a poder arreglarlo cuando falle."
        />

        <MultiSelect
          id="donde-rinde"
          index={2}
          title="¿Dónde rinde la IA?"
          prompt="Marca las tareas donde de verdad te ahorra tiempo."
          options={[
            { id: 'error', label: 'Explicarte un mensaje de error' },
            { id: 'repetitivo', label: 'Escribir código repetitivo que ya sabes hacer' },
            { id: 'pruebas', label: 'Generar datos de prueba' },
            { id: 'traducir', label: 'Traducir código de un lenguaje a otro' },
            { id: 'usuarios', label: 'Decidir qué necesitan tus usuarios' },
            { id: 'seguro', label: 'Garantizar que tu app es segura' },
          ]}
          answers={['error', 'repetitivo', 'pruebas', 'traducir']}
          explanation="Los cuatro primeros. Lo que necesita conocer a tus usuarios o responder por las consecuencias sigue siendo tuyo."
        />

        <Quiz
          id="buen-reporte"
          index={3}
          title="Pedir ayuda con un error"
          prompt="¿Cuál mensaje va a obtener mejor respuesta?"
          options={[
            { id: 'a', label: '«no me funciona el login, ayuda»' },
            {
              id: 'b',
              label:
                '«Esperaba que el login redirigiera al panel; en cambio recarga y vuelve al formulario. La consola muestra 401. Este es el manejador del submit: [código]»',
            },
            { id: 'c', label: '«mi proyecto está roto»' },
            { id: 'd', label: '«arréglame el código» + todo el repositorio pegado' },
          ]}
          answer="b"
          explanation="Qué esperabas, qué pasó, el error exacto y el código relevante. Esas cuatro partes sirven igual con la IA y con un compañero."
        />

        <TrueFalse
          id="error-completo"
          index={4}
          title="El mensaje de error"
          statement="Conviene copiar el error completo, no resumirlo de memoria."
          answer={true}
          explanation="Verdadero. El nombre exacto del error, el archivo y la línea suelen ser lo que resuelve el caso — y es justo lo que se pierde al resumir."
        />

        <MultiSelect
          id="que-nunca-pegar"
          index={5}
          title="Lo que nunca se pega en un chat"
          prompt="Marca lo que NO debe salir de tu proyecto."
          options={[
            { id: 'jwt', label: 'El JWT_SECRET' },
            { id: 'mongo', label: 'La cadena de conexión a Mongo con usuario y contraseña' },
            { id: 'clientes', label: 'La tabla real de clientes con sus cédulas' },
            { id: 'codigo', label: 'Una función tuya sin credenciales' },
            { id: 'error', label: 'Un mensaje de error de la consola' },
          ]}
          answers={['jwt', 'mongo', 'clientes']}
          explanation="Credenciales y datos de personas, nunca. Tu código sin secretos y los errores, sin problema."
        />

        <Quiz
          id="alucina-funcion"
          index={6}
          title="Una función que no existe"
          prompt="La IA te da código que usa mongoose.findAndReplaceOne(), y al ejecutarlo falla porque ese método no existe. ¿Qué pasó?"
          options={[
            { id: 'a', label: 'Alucinó: inventó un método que suena plausible' },
            { id: 'b', label: 'Tu versión de Mongoose está desactualizada, seguro' },
            { id: 'c', label: 'Escribiste mal el código' },
            { id: 'd', label: 'Falta instalar una librería' },
          ]}
          answer="a"
          explanation="Los nombres de métodos son texto, y el modelo los construye igual que cualquier frase. Ante la duda, la documentación oficial manda."
        />

        <Quiz
          id="peor-riesgo"
          index={7}
          title="El riesgo más traicionero"
          prompt="¿Cuál código generado es más peligroso?"
          options={[
            { id: 'a', label: 'El que falla al ejecutarse' },
            { id: 'b', label: 'El que funciona pero hace algo distinto de lo que crees' },
            { id: 'c', label: 'El que tiene comentarios en inglés' },
            { id: 'd', label: 'El que es muy largo' },
          ]}
          answer="b"
          explanation="El que falla lo arreglas de una. El que funciona mal —devuelve datos de más, no valida un permiso— se queda meses hasta que alguien lo descubre."
        />

        <MatchPairs
          id="empareja-revision"
          index={8}
          title="Empareja el chequeo con su pregunta"
          pairs={[
            { id: 'entiendo', izquierda: '¿Lo entiendo?', derecha: 'Puedo explicar cada línea' },
            { id: 'existe', izquierda: '¿Existe?', derecha: 'Los métodos están en la documentación' },
            { id: 'raros', izquierda: '¿Casos raros?', derecha: 'Lista vacía, red caída, sin permiso' },
            { id: 'seguro', izquierda: '¿Es seguro?', derecha: 'Valida lo que llega del cliente' },
            { id: 'encaja', izquierda: '¿Encaja?', derecha: 'Usa las mismas convenciones del proyecto' },
          ]}
          explanation="Cinco chequeos rápidos. Aplicarlos toma dos minutos y evita días de depuración."
        />

        <TrueFalse
          id="contexto-proyecto"
          index={9}
          title="El contexto que le falta"
          statement="La IA conoce tu proyecto completo aunque solo le muestres una función."
          answer={false}
          explanation="Falso. Solo sabe lo que le pegaste. Por eso propone soluciones que chocan con el resto de tu código: no lo ha visto."
        />

        <Quiz
          id="pedir-de-a-poco"
          index={10}
          title="Pedir de a poco"
          prompt="¿Por qué es mejor pedir una función a la vez y no un módulo completo?"
          options={[
            { id: 'a', label: 'Porque lo pequeño se revisa y se prueba; lo grande se acepta sin leer' },
            { id: 'b', label: 'Porque la IA se cansa' },
            { id: 'c', label: 'Porque cuesta más caro' },
            { id: 'd', label: 'Porque los archivos grandes no se pueden pegar' },
          ]}
          answer="a"
          explanation="Trescientas líneas de golpe nadie las lee con atención. Y si algo falla, no sabes cuál de los diez cambios fue."
        />

        <OrderSteps
          id="orden-usar-ia"
          index={11}
          title="Ordena el flujo de trabajo"
          steps={[
            { id: 'entiendo', text: 'Entender bien el problema antes de preguntar' },
            { id: 'pido', text: 'Pedir una pieza concreta, con contexto' },
            { id: 'reviso', text: 'Leer y revisar lo que llegó' },
            { id: 'pruebo', text: 'Probarlo en el proyecto' },
            { id: 'commit', text: 'Hacer commit de lo que funciona' },
          ]}
          explanation="Ojo con el primer paso: preguntar sin entender el problema es cómo se termina con una solución elegante para el problema equivocado."
        />

        <Quiz
          id="copilot-vs-chat"
          index={12}
          title="Copilot y el chat"
          prompt="¿Cuál es la diferencia práctica entre un autocompletado como Copilot y un chat?"
          options={[
            { id: 'a', label: 'Copilot sugiere mientras escribes y ve tu archivo; el chat es una conversación con más contexto que tú le das' },
            { id: 'b', label: 'Copilot es más inteligente' },
            { id: 'c', label: 'El chat no sirve para código' },
            { id: 'd', label: 'Son exactamente lo mismo' },
          ]}
          answer="a"
          explanation="El autocompletado es rápido para lo repetitivo; el chat sirve para entender, discutir alternativas y depurar. Se usan para cosas distintas."
        />

        <Quiz
          id="aceptar-tab"
          index={13}
          title="Aceptar sugerencias sin leer"
          prompt="Copilot sugiere tres líneas y presionas Tab sin leerlas. ¿Cuál es el riesgo?"
          options={[
            { id: 'a', label: 'Meter código que no hace lo que crees y no darte cuenta hasta mucho después' },
            { id: 'b', label: 'Que el editor se ponga lento' },
            { id: 'c', label: 'Ninguno, Copilot no se equivoca' },
            { id: 'd', label: 'Que se borre el archivo' },
          ]}
          answer="a"
          explanation="El autocompletado acierta a menudo, y ese es justo el problema: bajas la guardia. La sugerencia número veinte es la que te cambia una comparación sin que lo notes."
        />

        <FillBlank
          id="prompt-explicacion"
          index={14}
          title="Pide la explicación"
          prompt="Completa el final del prompt para no quedarte solo con la solución."
          code={'Este código falla con «Cannot read properties of null».\nAquí está la función: [código]\n___'}
          options={[
            '¿Qué está mal y por qué pasa?',
            'Arréglalo.',
            'Dame el código corregido y ya.',
            'Gracias.',
          ]}
          answer="¿Qué está mal y por qué pasa?"
          explanation="Pedir el porqué convierte una respuesta que copias en algo que aprendes. La próxima vez lo reconoces sin ayuda."
        />

        <MultiSelect
          id="ia-en-defensa"
          index={15}
          title="En la defensa del proyecto"
          prompt="¿Qué te pueden preguntar sobre tu código?"
          options={[
            { id: 'porque', label: 'Por qué elegiste esa estructura' },
            { id: 'hace', label: 'Qué hace exactamente esta función' },
            { id: 'falla', label: 'Qué pasaría si la API no responde' },
            { id: 'cambiar', label: 'Cómo cambiarías esto para agregar una funcionalidad' },
            { id: 'ia', label: 'Si usaste IA' },
          ]}
          answers={['porque', 'hace', 'falla', 'cambiar']}
          explanation="Las preguntas son sobre el código, no sobre las herramientas. Usar IA está bien; no entender lo que entregaste, no."
        />

        <TrueFalse
          id="ia-reemplaza"
          index={16}
          title="La pregunta de la sesión 1"
          statement="Con lo que sabes ahora: la IA hace innecesario aprender a programar."
          answer={false}
          explanation="Falso, y ahora lo puedes argumentar desde la experiencia: para aprovecharla hay que saber qué pedir, detectar cuándo se equivoca, y responder por el resultado."
        />

        <Quiz
          id="deuda-entendimiento"
          index={17}
          title="La deuda de entendimiento"
          prompt="Integraste código que funciona pero no entiendes del todo. ¿Qué haces?"
          options={[
            { id: 'a', label: 'Anotarlo y volver sobre eso con calma o con el mentor' },
            { id: 'b', label: 'Olvidarlo, funciona' },
            { id: 'c', label: 'Borrarlo y escribirlo desde cero siempre' },
            { id: 'd', label: 'Comentarlo para que no se ejecute' },
          ]}
          answer="a"
          explanation="No hace falta entenderlo todo en el momento, pero sí llevar la cuenta. Esa deuda se cobra sola el día que algo falle ahí."
        />

        <Quiz
          id="datos-prueba"
          index={18}
          title="Datos de prueba"
          prompt="Necesitas 20 productos de ejemplo para probar tu catálogo."
          options={[
            { id: 'a', label: 'Pedirle a la IA que los invente: es exactamente para lo que sirve' },
            { id: 'b', label: 'Copiar los datos reales de un negocio conocido' },
            { id: 'c', label: 'Escribirlos uno por uno a mano' },
            { id: 'd', label: 'Dejar el catálogo vacío' },
          ]}
          answer="a"
          explanation="Generar datos ficticios es una de las cosas donde más rinde: es repetitivo, no es delicado, y así pruebas cómo se ve tu interfaz con contenido real."
        />

        <MultiSelect
          id="checklist-ia"
          index={19}
          title="Checklist antes de integrar código generado"
          options={[
            { id: 'leo', label: 'Lo leí completo' },
            { id: 'entiendo', label: 'Puedo explicar cada línea' },
            { id: 'existe', label: 'Verifiqué que los métodos existen' },
            { id: 'pruebo', label: 'Lo probé, incluidos los casos que fallan' },
            { id: 'estilo', label: 'Sigue las convenciones de mi proyecto' },
            { id: 'rapido', label: 'Lo pegué rápido para avanzar' },
          ]}
          answers={['leo', 'entiendo', 'existe', 'pruebo', 'estilo']}
          explanation="Los cinco primeros. El sexto es cómo se acumulan los problemas que aparecen la semana de la entrega."
        />

        <Quiz
          id="copiloto-piloto"
          index={20}
          title="Copiloto, no piloto"
          prompt="Ya con el curso avanzado, ¿qué significa esa frase para tu proyecto?"
          options={[
            {
              id: 'a',
              label: 'La IA acelera el trabajo, pero las decisiones, la revisión y la responsabilidad siguen siendo tuyas',
            },
            { id: 'b', label: 'Que solo se puede usar al final' },
            { id: 'c', label: 'Que hay que usarla para todo' },
            { id: 'd', label: 'Que no sirve para programar' },
          ]}
          answer="a"
          explanation="Es la misma frase de la sesión 1, pero ahora la entiendes desde adentro: sabes lo suficiente para dirigir la herramienta en vez de seguirla."
        />
      </Exercises>
    </TopicPage>
  );
}
