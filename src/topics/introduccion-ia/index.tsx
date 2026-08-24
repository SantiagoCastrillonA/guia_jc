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

const SLUG = 'introduccion-ia';

/** Sesión 1 del cronograma — Introducción a la IA. */
export default function IntroduccionIA() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Qué es, en una frase">
        <p>
          La inteligencia artificial es un programa que <strong>aprende patrones</strong> a partir
          de una montaña de ejemplos, y después usa esos patrones para predecir algo nuevo. No
          entiende el mundo: reconoce regularidades.
        </p>
        <p>
          Cuando Spotify te recomienda una canción, cuando Netflix acomoda su portada, cuando el
          teclado del celular adivina la palabra que ibas a escribir — es lo mismo: alguien le
          mostró millones de ejemplos, y el programa aprendió qué suele venir después de qué.
        </p>
      </Lesson>

      <Lesson title="2. Cómo funciona un modelo de lenguaje">
        <p>
          ChatGPT, Claude y Gemini son <strong>modelos de lenguaje</strong> (LLM, por{' '}
          <em>large language model</em>). Su único truco es este: dada una secuencia de palabras,
          calcular qué palabra tiene más probabilidad de seguir. Luego repite, palabra por palabra,
          hasta terminar la respuesta.
        </p>

        <Figure
          label="Diagrama: el modelo calcula la probabilidad de la siguiente palabra"
          caption="El modelo no busca la respuesta en ningún lado: la va armando, una palabra a la vez, escogiendo entre las más probables."
        >
          <svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg">
            <text
              x="0"
              y="34"
              fill="var(--color-text)"
              fontSize="19"
              fontFamily="var(--font-heading)"
            >
              El café de mi barrio abre a las…
            </text>
            <line
              x1="0"
              y1="52"
              x2="340"
              y2="52"
              stroke="var(--color-accent)"
              strokeWidth="1"
              opacity="0.5"
            />
            {[
              { palabra: '"siete"', p: 0.52, y: 86 },
              { palabra: '"ocho"', p: 0.27, y: 126 },
              { palabra: '"seis"', p: 0.14, y: 166 },
              { palabra: '"jueves"', p: 0.02, y: 206 },
            ].map(({ palabra, p, y }) => (
              <g key={palabra}>
                <text x="0" y={y + 5} fill="var(--color-text)" fontSize="14" opacity="0.85">
                  {palabra}
                </text>
                <rect
                  x="110"
                  y={y - 11}
                  width="420"
                  height="16"
                  rx="3"
                  fill="var(--color-text)"
                  opacity="0.07"
                />
                <rect
                  x="110"
                  y={y - 11}
                  width={420 * p}
                  height="16"
                  rx="3"
                  fill="var(--color-accent)"
                  opacity={0.35 + p}
                />
                <text
                  x="546"
                  y={y + 2}
                  fill="var(--color-text-2)"
                  fontSize="12"
                  fontFamily="ui-monospace, monospace"
                >
                  {Math.round(p * 100)}%
                </text>
              </g>
            ))}
          </svg>
        </Figure>

        <Callout>
          De ahí sale todo lo bueno y todo lo malo de estas herramientas. Escriben bien porque
          aprendieron a sonar como los textos que leyeron. Y <strong>se inventan cosas</strong> por
          exactamente la misma razón: una respuesta falsa puede sonar igual de probable que una
          verdadera. A eso se le llama <em>alucinación</em>.
        </Callout>
      </Lesson>

      <Lesson title="3. El prompt: lo que tú escribes">
        <p>
          El <strong>prompt</strong> es el mensaje que le mandas. Es la única palanca que controlas,
          y cambia por completo el resultado. Compáralo tú mismo: escribe{' '}
          <code>búscame algo azul y muéstralo</code> y mira qué sale. Ahora pídele lo mismo con
          contexto y verás otra cosa.
        </p>

        <Figure
          label="Diagrama: las cuatro partes de un buen prompt"
          caption="No hace falta que estén las cuatro siempre. Pero entre más de estas incluyas, menos tiene que adivinar el modelo."
        >
          <svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
            {[
              { t: 'ROL', d: 'Actúa como un experto en branding', y: 10 },
              { t: 'TAREA', d: 'Propón 5 nombres para mi cafetería', y: 72 },
              { t: 'CONTEXTO', d: 'Queda en Medellín, va para estudiantes', y: 134 },
              { t: 'FORMATO', d: 'En una tabla, con una frase por nombre', y: 196 },
            ].map(({ t, d, y }) => (
              <g key={t}>
                <rect
                  x="0"
                  y={y}
                  width="640"
                  height="50"
                  rx="8"
                  fill="var(--color-text)"
                  opacity="0.05"
                />
                <rect x="0" y={y} width="3" height="50" rx="1.5" fill="var(--color-accent)" />
                <text
                  x="20"
                  y={y + 21}
                  fill="var(--color-accent-text)"
                  fontSize="11"
                  letterSpacing="1.4"
                >
                  {t}
                </text>
                <text x="20" y={y + 39} fill="var(--color-text)" fontSize="14" opacity="0.9">
                  {d}
                </text>
              </g>
            ))}
          </svg>
        </Figure>

        <Compare
          bien={{
            titulo: 'Prompt que sirve',
            items: [
              'Le da un rol: «actúa como…»',
              'Dice exactamente qué quieres y cuántas cosas',
              'Da contexto real: ciudad, público, producto',
              'Pide un formato: tabla, lista, 2 oraciones',
              'Fija el tono: fresco, serio, para alguien de 15 años',
            ],
          }}
          mal={{
            titulo: 'Prompt que no sirve',
            items: [
              '«hazme algo bonito»',
              'Sin decir para quién ni para qué',
              'Sin límite: te devuelve tres páginas',
              'Escribir en MAYÚSCULAS no mejora nada',
              'Decir «por favor» tampoco cambia la calidad',
            ],
          }}
        />
      </Lesson>

      <Lesson title="4. Cómo mejorar un prompt, paso a paso">
        <Steps>
          <Step title="Escribe la primera versión sin pensarla mucho">
            Sirve para ver por dónde arranca el modelo. Casi siempre la respuesta va a ser genérica:
            eso es información, no fracaso.
          </Step>
          <Step title="Agrega contexto: quién eres y para quién es">
            «Tengo una cafetería en Medellín, mis clientes son estudiantes universitarios». El
            modelo no sabe nada de ti hasta que se lo dices.
          </Step>
          <Step title="Pide un formato y una cantidad">
            «Dame 5 opciones en una tabla, con una frase de por qué funciona cada una». Así puedes
            comparar en vez de leer un texto largo.
          </Step>
          <Step title="Dale un rol y un tono">
            «Actúa como un experto en branding, tono fresco y juvenil». Cambia el vocabulario que
            usa y el tipo de ideas que propone.
          </Step>
          <Step title="Itera sobre lo que te gustó">
            «La opción 3 me gustó, dame 5 variaciones de esa». Conversar con el modelo funciona
            mejor que buscar el prompt perfecto de una.
          </Step>
          <Step title="Verifica antes de usarlo">
            Datos, nombres, precios, fuentes: revísalos. El modelo puede inventarlos con toda
            seguridad y sin avisarte.
          </Step>
        </Steps>
      </Lesson>

      <Lesson title="5. Lo que no debes hacer">
        <RefTable
          cabeceras={['Situación', 'Por qué es un problema']}
          filas={[
            [
              'Pegar datos personales de clientes',
              'Sale de tu computador y queda en un servidor ajeno. Nunca pegues cédulas, teléfonos ni datos de otras personas.',
            ],
            [
              'Copiar y pegar código sin entenderlo',
              'Cuando falle no vas a saber por dónde empezar, y en la defensa del proyecto te van a preguntar cómo funciona.',
            ],
            [
              'Aceptar un dato sin verificarlo',
              'El modelo puede inventar una cifra, una ley o un enlace que no existe, con total seguridad.',
            ],
            [
              'Pedir que te haga la tarea completa',
              'Te ahorra 10 minutos hoy y te cuesta el semestre. Úsala para entender, no para reemplazarte.',
            ],
          ]}
        />
        <Callout tipo="ojo">
          Regla de la clase: <strong>la IA es tu copiloto, no tu piloto.</strong> Tú decides a dónde
          va el proyecto y respondes por lo que entregas.
        </Callout>
      </Lesson>

      <Exercises>
        <TrueFalse
          id="ia-entiende"
          index={1}
          title="¿La IA entiende lo que dice?"
          statement="Un modelo de lenguaje entiende el significado de las palabras igual que una persona."
          answer={false}
          explanation="Falso. Calcula qué palabra es más probable que siga, a partir de los patrones que aprendió. Escribe como si entendiera, pero no comprende: por eso puede sonar seguro y estar equivocado."
          hint="Piensa en cómo el teclado del celular adivina la siguiente palabra."
        />

        <Quiz
          id="que-tienen-en-comun"
          index={2}
          title="Spotify, Netflix y el teclado"
          prompt="Spotify te recomienda música, Netflix acomoda su portada y el teclado predice tu próxima palabra. ¿Qué tienen en común?"
          options={[
            { id: 'internet', label: 'Los tres necesitan internet' },
            { id: 'patrones', label: 'Los tres aprenden patrones de muchos datos y predicen algo' },
            { id: 'personas', label: 'Detrás de los tres hay personas decidiendo en tiempo real' },
            { id: 'pagos', label: 'Los tres son servicios de pago' },
          ]}
          answer="patrones"
          explanation="Eso es. Los tres son el mismo mecanismo: montones de ejemplos, patrones aprendidos, y una predicción. Cambia el dato que predicen, no la idea."
          hint="No pienses en la tecnología, piensa en qué hacen los tres con tu historial."
        />

        <Quiz
          id="que-es-llm"
          index={3}
          title="¿Qué es un LLM?"
          prompt="Un compañero te pregunta qué es un LLM. ¿Cuál explicación es correcta?"
          options={[
            { id: 'busca', label: 'Un buscador que encuentra la respuesta en internet y te la copia' },
            { id: 'predice', label: 'Un modelo que predice la siguiente palabra, una por una, hasta armar la respuesta' },
            { id: 'base', label: 'Una base de datos gigante con todas las respuestas ya escritas' },
            { id: 'persona', label: 'Un grupo de personas que responde rápido desde otro país' },
          ]}
          answer="predice"
          explanation="Correcto. LLM significa modelo grande de lenguaje: su trabajo es predecir la continuación más probable. La respuesta se arma en el momento, no estaba guardada en ninguna parte."
          hint="Fíjate en el diagrama de las barras de probabilidad."
        />

        <TrueFalse
          id="alucinaciones"
          index={4}
          title="Respuestas inventadas"
          statement="Si la IA responde con seguridad y buena redacción, el dato es confiable."
          answer={false}
          explanation="Falso. La seguridad con la que escribe no tiene relación con si el dato es cierto: una respuesta falsa puede sonar igual de natural que una verdadera. Eso se llama alucinación, y por eso todo dato se verifica."
          hint="¿De dónde saca el modelo la forma de escribir? ¿Y de dónde saca la verdad?"
        />

        <MultiSelect
          id="partes-del-prompt"
          index={5}
          title="Qué hace bueno a un prompt"
          prompt="Marca todo lo que de verdad mejora la respuesta."
          options={[
            { id: 'rol', label: 'Darle un rol: «actúa como experto en branding»' },
            { id: 'contexto', label: 'Dar contexto: ciudad, público, tipo de negocio' },
            { id: 'formato', label: 'Pedir un formato y una cantidad: «5 opciones en una tabla»' },
            { id: 'mayus', label: 'Escribir todo en MAYÚSCULAS para que quede claro' },
            { id: 'porfa', label: 'Decir «por favor» varias veces' },
            { id: 'tono', label: 'Fijar el tono y la audiencia' },
          ]}
          answers={['rol', 'contexto', 'formato', 'tono']}
          explanation="Rol, contexto, formato y tono. Las mayúsculas y la cortesía no cambian la calidad: lo que la cambia es cuánta información le das para que no tenga que adivinar."
          hint="Pregúntate cuáles le quitan trabajo de adivinación al modelo."
        />

        <MatchPairs
          id="partes-ejemplo"
          index={6}
          title="Empareja cada parte con su ejemplo"
          prompt="Cada pieza de un prompt cumple una función distinta."
          pairs={[
            { id: 'rol', izquierda: 'Rol', derecha: '«Actúa como un experto en branding»' },
            { id: 'tarea', izquierda: 'Tarea', derecha: '«Propón 5 nombres para mi cafetería»' },
            { id: 'contexto', izquierda: 'Contexto', derecha: '«Queda en Medellín, va para estudiantes»' },
            { id: 'formato', izquierda: 'Formato', derecha: '«En una tabla, una frase por nombre»' },
            { id: 'tono', izquierda: 'Tono', derecha: '«Fresco y juvenil, sin tecnicismos»' },
          ]}
          explanation="Así queda un prompt completo: rol, tarea, contexto, formato y tono. Puedes escribirlos en cualquier orden, con tal de que estén."
        />

        <Quiz
          id="mejor-prompt"
          index={7}
          title="¿Cuál prompt va a funcionar mejor?"
          prompt="Quieres el nombre de tu emprendimiento de comida saludable."
          options={[
            { id: 'a', label: 'ponme un nombre bacano' },
            { id: 'b', label: 'nombres para negocio de comida' },
            {
              id: 'c',
              label:
                'Actúa como experto en branding. Propón 5 nombres para un negocio de comida saludable en Bogotá dirigido a oficinistas. Tono fresco. Formato: tabla con el nombre y una frase de por qué funciona.',
            },
            { id: 'd', label: 'NECESITO UN NOMBRE URGENTE POR FAVOR' },
          ]}
          answer="c"
          explanation="Esa. Trae rol, tarea con cantidad, contexto (qué vende, dónde, a quién), tono y formato. Las otras obligan al modelo a adivinar todo, y adivinando saca lo más genérico posible."
          hint="Cuenta cuántas de las cuatro partes del diagrama tiene cada uno."
        />

        <FillBlank
          id="completa-rol"
          index={8}
          title="Completa el prompt"
          prompt="Le quieres dar un rol al modelo para que responda como especialista."
          code={'___ un experto en branding para pequeños negocios.\nPropón 5 nombres para mi cafetería en Medellín.'}
          options={['Actúa como', 'Dime si', 'Ojalá', 'Busca en']}
          answer="Actúa como"
          explanation="«Actúa como…» le fija un rol, y con el rol cambia el vocabulario, los criterios y el tipo de ideas que propone."
          hint="Buscas la fórmula que le asigna un papel, no una que le haga una pregunta."
        />

        <OrderSteps
          id="orden-iterar"
          index={9}
          title="Ordena el proceso de mejorar un prompt"
          prompt="Así se trabaja con IA: por versiones, no de un solo tiro."
          steps={[
            { id: 'v1', text: 'Escribir una primera versión simple y ver qué responde' },
            { id: 'ctx', text: 'Agregar contexto: qué vendes, dónde y a quién' },
            { id: 'fmt', text: 'Pedir formato y cantidad: «5 opciones en una tabla»' },
            { id: 'iter', text: 'Pedir variaciones de la opción que más gustó' },
            { id: 'ver', text: 'Verificar los datos antes de usarlos' },
          ]}
          explanation="Primero exploras, después acotas, y al final verificas. Buscar el prompt perfecto de entrada casi nunca funciona: conversar sí."
        />

        <TrueFalse
          id="datos-personales"
          index={10}
          title="Datos de otras personas"
          statement="Puedo pegar la lista de clientes con sus cédulas y teléfonos para que la IA me la organice."
          answer={false}
          explanation="Falso. Esos datos son de otras personas y salen de tu computador hacia un servidor ajeno. Si necesitas practicar con una tabla, invéntate los datos o cámbialos."
          hint="Piensa en de quién son esos datos y a dónde viajan."
        />

        <Quiz
          id="reemplaza-programadores"
          index={11}
          title="¿La IA reemplaza a los programadores?"
          prompt="Después de toda la sesión, ¿cuál respuesta es la más honesta?"
          options={[
            { id: 'si', label: 'Sí: en un año ya no van a existir los programadores' },
            { id: 'no', label: 'No: es un juguete que no sirve para trabajar de verdad' },
            {
              id: 'cambia',
              label:
                'Cambia el trabajo: acelera lo repetitivo, pero alguien tiene que decidir qué construir, revisarlo y responder por ello',
            },
            { id: 'depende', label: 'Solo reemplaza a los que programan en JavaScript' },
          ]}
          answer="cambia"
          explanation="Esa es la respuesta con la que vas a trabajar todo el curso: la IA acelera, tú decides y respondes. Quien no entiende el código que entrega no puede sostenerlo cuando falla."
          hint="Ni el extremo optimista ni el extremo negador."
        />

        <MultiSelect
          id="cuando-verificar"
          index={12}
          title="¿Cuándo hay que verificar?"
          prompt="Marca los casos en los que NO puedes confiar en la respuesta sin revisarla."
          options={[
            { id: 'cifras', label: 'Cuando te da cifras, fechas o precios' },
            { id: 'enlaces', label: 'Cuando te da enlaces o nombres de fuentes' },
            { id: 'codigo', label: 'Cuando te entrega código que vas a publicar' },
            { id: 'ideas', label: 'Cuando te propone ideas de nombres para tu marca' },
            { id: 'leyes', label: 'Cuando te explica una norma o un requisito legal' },
          ]}
          answers={['cifras', 'enlaces', 'codigo', 'leyes']}
          explanation="Todo lo que sea un hecho comprobable se verifica: cifras, fuentes, código y normas. Una lluvia de ideas de nombres no tiene nada que verificar — ahí lo que decides es si te gusta."
          hint="¿Cuáles de estas respuestas podrían ser falsas sin que se note?"
        />

        <TrueFalse
          id="misma-respuesta"
          index={13}
          title="El mismo prompt dos veces"
          statement="Si le mandas exactamente el mismo prompt dos veces, siempre responde lo mismo."
          answer={false}
          explanation="Falso. Estos modelos eligen entre varias palabras probables, así que la respuesta cambia entre intentos. Por eso vale la pena pedir de nuevo cuando algo no te convenció."
          hint="Vuelve al diagrama: si hay varias opciones con probabilidad, ¿siempre gana la misma?"
        />

        <FillBlank
          id="completa-formato"
          index={14}
          title="Pide el formato"
          prompt="Quieres poder comparar las opciones de un vistazo, no leer un texto largo."
          code={'Propón 5 nombres para mi negocio.\nEntrégalo ___ con el nombre y una frase por cada uno.'}
          options={['en una tabla', 'rápido', 'bien bonito', 'como quieras']}
          answer="en una tabla"
          explanation="Pedir el formato es de los cambios que más rinden: una tabla se compara en segundos, tres párrafos hay que leerlos completos."
        />

        <Quiz
          id="contexto-negocio"
          index={15}
          title="Contexto de tu emprendimiento"
          prompt="¿Cuál de estos datos le sirve MÁS al modelo para proponer buenos nombres?"
          options={[
            { id: 'color', label: 'Que tu color favorito es el azul' },
            { id: 'publico', label: 'A quién le vendes y en qué ciudad operas' },
            { id: 'hoy', label: 'Que hoy es martes' },
            { id: 'largo', label: 'Que quieres el nombre lo más largo posible' },
          ]}
          answer="publico"
          explanation="Público y lugar. Un nombre para estudiantes en Medellín no se parece a uno para oficinistas en Bogotá: esa diferencia solo la puede hacer si se la cuentas."
        />

        <OrderSteps
          id="orden-entregable"
          index={16}
          title="Ordena el entregable de la sesión"
          prompt="Lo que tienes que tener listo al final de la clase, en el orden en que se hace."
          steps={[
            { id: 'idea', text: 'Definir qué vendes, a quién y con qué tono' },
            { id: 'prompt', text: 'Escribir el prompt con rol, contexto y formato' },
            { id: 'nombres', text: 'Generar y comparar las opciones de nombre' },
            { id: 'elegir', text: 'Elegir el nombre favorito' },
            { id: 'desc', text: 'Pedir la descripción del negocio en máximo 3 oraciones' },
          ]}
          explanation="Fíjate en el orden: primero decides tú, después le pides a la IA. Si abres el chat sin saber qué vendes, lo que salga va a ser genérico."
        />

        <TrueFalse
          id="inventa-fuentes"
          index={17}
          title="Fuentes y enlaces"
          statement="Si la IA te da un enlace o cita un estudio, ese enlace siempre existe."
          answer={false}
          explanation="Falso. Los enlaces y las citas son texto, y el modelo los puede construir igual que construye cualquier otra frase. Ábrelo antes de usarlo: es uno de los errores más comunes."
        />

        <Quiz
          id="copiloto"
          index={18}
          title="La regla de la clase"
          prompt="¿Qué significa «la IA es tu copiloto, no tu piloto»?"
          options={[
            { id: 'nada', label: 'Que no se puede usar IA en el curso' },
            {
              id: 'decides',
              label: 'Que te ayuda a avanzar, pero tú decides el rumbo, revisas y respondes por lo que entregas',
            },
            { id: 'siempre', label: 'Que hay que usarla para absolutamente todo' },
            { id: 'final', label: 'Que solo se puede usar al final del proyecto' },
          ]}
          answer="decides"
          explanation="Exacto. Puedes usarla todo lo que quieras — de hecho el curso te va a enseñar a usarla bien — con una condición: entender lo que entregas y poder defenderlo."
        />
      </Exercises>
    </TopicPage>
  );
}
