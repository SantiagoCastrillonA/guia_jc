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
import { Callout, Compare, Figure, RefTable, Step, Steps } from '../../components/visuals';

const SLUG = 'logica-scratch-1';

/** Sesión 2 del cronograma — Lógica de programación con Scratch. */
export default function LogicaScratch1() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. La computadora no tiene sentido común">
        <p>
          Una computadora hace exactamente lo que le dices, en el orden exacto en que se lo dices.
          Si le pides «sécate las manos» antes de «abre la llave», se seca las manos primero — y no
          te va a avisar de que eso no tiene sentido.
        </p>
        <p>
          Programar es partir una tarea en pasos tan pequeños y tan ordenados que no quede nada por
          adivinar. Eso es todo. El lenguaje cambia; esa idea no.
        </p>
        <Callout>
          Hoy no vas a escribir texto: vas a armar bloques en Scratch. Los cuatro conceptos que
          practiques aquí — <strong>secuencia, variable, condicional y bucle</strong> — son el 90%
          de cualquier programa que escribas después en JavaScript.
        </Callout>
      </Lesson>

      <Lesson title="2. Los cuatro bloques de todo programa">
        <Figure
          label="Diagrama: secuencia, variable, condicional y bucle"
          caption="Cuatro piezas. Todo lo demás que vas a aprender en el curso son combinaciones de estas."
        >
          <svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg">
            {/* Secuencia */}
            <text x="0" y="16" fill="var(--color-accent-text)" fontSize="11" letterSpacing="1.4">
              SECUENCIA
            </text>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect
                  x={0}
                  y={30 + i * 26}
                  width="120"
                  height="18"
                  rx="4"
                  fill="var(--color-text)"
                  opacity="0.12"
                />
                {i < 2 && (
                  <line
                    x1="12"
                    y1={48 + i * 26}
                    x2="12"
                    y2={56 + i * 26}
                    stroke="var(--color-accent)"
                    strokeWidth="1"
                  />
                )}
              </g>
            ))}
            <text x="0" y="128" fill="var(--color-text)" fontSize="12" opacity="0.6">
              un paso tras otro
            </text>

            {/* Variable */}
            <text x="170" y="16" fill="var(--color-accent-text)" fontSize="11" letterSpacing="1.4">
              VARIABLE
            </text>
            <rect
              x="170"
              y="30"
              width="130"
              height="62"
              rx="6"
              fill="var(--color-text)"
              opacity="0.08"
            />
            <rect x="170" y="30" width="130" height="18" rx="6" fill="var(--color-accent)" opacity="0.35" />
            <text x="180" y="43" fill="var(--color-text)" fontSize="11">
              color
            </text>
            <text
              x="180"
              y="73"
              fill="var(--color-text)"
              fontSize="16"
              fontFamily="ui-monospace, monospace"
            >
              "rojo"
            </text>
            <text x="170" y="128" fill="var(--color-text)" fontSize="12" opacity="0.6">
              una caja con etiqueta
            </text>

            {/* Condicional */}
            <text x="360" y="16" fill="var(--color-accent-text)" fontSize="11" letterSpacing="1.4">
              CONDICIONAL
            </text>
            <path
              d="M410 30 L450 55 L410 80 L370 55 Z"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.2"
            />
            <text x="393" y="59" fill="var(--color-text)" fontSize="11">
              ¿?
            </text>
            <line x1="450" y1="55" x2="490" y2="55" stroke="var(--color-text)" strokeWidth="1" opacity="0.3" />
            <text x="496" y="59" fill="var(--color-text)" fontSize="11" opacity="0.75">
              sí
            </text>
            <line x1="410" y1="80" x2="410" y2="104" stroke="var(--color-text)" strokeWidth="1" opacity="0.3" />
            <text x="418" y="104" fill="var(--color-text)" fontSize="11" opacity="0.75">
              si no
            </text>
            <text x="360" y="128" fill="var(--color-text)" fontSize="12" opacity="0.6">
              el camino se parte en dos
            </text>

            {/* Bucle */}
            <text x="0" y="180" fill="var(--color-accent-text)" fontSize="11" letterSpacing="1.4">
              BUCLE
            </text>
            <rect
              x="0"
              y="196"
              width="200"
              height="60"
              rx="8"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <rect x="16" y="212" width="140" height="18" rx="4" fill="var(--color-text)" opacity="0.12" />
            <path
              d="M172 222 a14 14 0 1 1 -6 -11"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.4"
            />
            <path d="M166 205 l2 8 l-8 -1 z" fill="var(--color-accent)" />
            <text x="0" y="278" fill="var(--color-text)" fontSize="12" opacity="0.6">
              lo mismo, muchas veces
            </text>
          </svg>
        </Figure>

        <RefTable
          cabeceras={['Concepto', 'En palabras', 'En Scratch']}
          filas={[
            ['Secuencia', 'Pasos en orden, uno tras otro', 'Bloques apilados de arriba abajo'],
            ['Variable', 'Una caja con etiqueta que guarda un valor que puede cambiar', '«fijar color a…»'],
            ['Condicional', 'Si pasa esto, haz aquello; si no, haz esto otro', '«si… entonces / si no»'],
            ['Bucle', 'Repite un grupo de pasos', '«repetir 10» o «por siempre»'],
          ]}
        />
      </Lesson>

      <Lesson title="3. Variables: fijar no es lo mismo que cambiar">
        <p>
          Una variable guarda un valor y ese valor se puede reemplazar. En Scratch hay dos bloques
          parecidos que confunden a todo el mundo:
        </p>
        <Compare
          bien={{
            titulo: 'fijar puntos a 0',
            items: [
              'Reemplaza lo que hubiera: queda exactamente 0',
              'Se usa al empezar el juego, para arrancar en limpio',
              'En JavaScript: puntos = 0',
            ],
          }}
          mal={{
            titulo: 'cambiar puntos por 1 (¡es otra cosa!)',
            items: [
              'Suma 1 a lo que ya había',
              'Se usa cada vez que el jugador anota',
              'En JavaScript: puntos = puntos + 1',
            ],
          }}
        />
        <Callout tipo="ojo">
          Si tu contador siempre marca 1, casi seguro usaste <strong>fijar</strong> donde iba{' '}
          <strong>cambiar</strong>: en cada vuelta lo estás reiniciando.
        </Callout>
      </Lesson>

      <Lesson title="4. El semáforo, paso a paso">
        <Steps>
          <Step title="Crea la variable">
            En la categoría Variables, «Crear una variable» y llámala <code>color</code>. Va a
            guardar el color en el que está el semáforo ahora mismo.
          </Step>
          <Step title="Define el estado inicial">
            Con el bloque «al presionar bandera verde», fija <code>color</code> a{' '}
            <code>"rojo"</code>. Todo programa necesita un punto de partida conocido.
          </Step>
          <Step title="Detecta el clic">
            Agrega el bloque «al hacer clic en este sprite». Todo lo que pongas debajo pasa cada vez
            que alguien lo toca.
          </Step>
          <Step title="Parte el camino en dos">
            Dentro del clic, un «si… entonces / si no»: si <code>color</code> es{' '}
            <code>"rojo"</code>, fíjalo en <code>"verde"</code>; si no, fíjalo en{' '}
            <code>"rojo"</code>.
          </Step>
          <Step title="Muestra el resultado">
            Al final del clic, «decir color por 1 segundo». Sin esto el programa funciona, pero no
            puedes verlo: mostrar el estado es parte de depurar.
          </Step>
        </Steps>

        <Callout>
          <strong>Reto:</strong> ¿cómo meterías un amarillo entre el rojo y el verde? Con un{' '}
          <em>si / si no</em> anidado se puede, pero fíjate en lo incómodo que se vuelve. Ese
          incomodidad es la razón por la que existen otras estructuras que verás más adelante.
        </Callout>
      </Lesson>

      <Lesson title="5. El dado: azar y bucles">
        <p>
          El dado necesita dos cosas nuevas: un número al azar (categoría Operadores, «número
          aleatorio entre 1 y 6») y un bucle que lo haga «girar» antes de mostrar el resultado.
        </p>
        <RefTable
          cabeceras={['Bucle', 'Cuándo se usa']}
          filas={[
            ['repetir 10', 'Sabes cuántas veces: la animación del dado girando'],
            ['por siempre', 'Nunca para: la música de fondo, un enemigo que patrulla'],
            ['repetir hasta que…', 'Hasta que se cumpla algo: hasta que el jugador toque la meta'],
          ]}
        />
        <Callout tipo="ojo">
          «Por siempre» es literal: los bloques que pongas <em>debajo</em> de ese bucle no se
          ejecutan nunca, porque el programa jamás sale de ahí.
        </Callout>
      </Lesson>

      <Exercises>
        <OrderSteps
          id="lavarse-manos"
          index={1}
          title="Ordena la secuencia"
          prompt="La computadora sigue el orden exacto. Ordena los pasos para lavarse las manos."
          steps={[
            { id: 'abre', text: 'Abre la llave' },
            { id: 'jabon', text: 'Enjabónate las manos' },
            { id: 'cierra', text: 'Cierra la llave' },
            { id: 'seca', text: 'Sécate las manos' },
          ]}
          explanation="Ese es el orden. Parece obvio para una persona, pero la máquina no lo sabe: si lo pones al revés, se seca las manos con la llave abierta y sin jabón, tan tranquila."
        />

        <Quiz
          id="que-es-variable"
          index={2}
          title="¿Qué es una variable?"
          options={[
            { id: 'caja', label: 'Una caja con etiqueta que guarda un valor que puede cambiar' },
            { id: 'bloque', label: 'Un bloque de color que mueve al personaje' },
            { id: 'error', label: 'Un error del programa' },
            { id: 'fijo', label: 'Un número que nunca cambia' },
          ]}
          answer="caja"
          explanation="Eso. Tiene un nombre (la etiqueta) y un valor adentro que se puede reemplazar cuando quieras."
        />

        <TrueFalse
          id="fijar-vs-cambiar"
          index={3}
          title="fijar y cambiar"
          statement="«fijar puntos a 1» y «cambiar puntos por 1» hacen lo mismo."
          answer={false}
          explanation="Falso. «Fijar» reemplaza el valor: siempre queda 1. «Cambiar por» suma: si había 7, queda 8. Es el error número uno en los contadores."
          hint="Uno reemplaza, el otro suma."
        />

        <PredictOutput
          id="contador-final"
          index={4}
          title="¿Con cuánto termina?"
          prompt="Sigue el programa paso a paso y escribe el valor final de puntos."
          code={
            'fijar puntos a 0\nrepetir 3:\n  cambiar puntos por 2\ndecir puntos'
          }
          numbered
          answers={['6']}
          explanation="6. Arranca en 0 y suma 2 tres veces. Si el bloque de adentro hubiera sido «fijar puntos a 2», habría dicho 2: la repetición no habría servido de nada."
          hint="Suma 2 en cada vuelta y cuenta cuántas vueltas hay."
        />

        <PredictOutput
          id="contador-fijar"
          index={5}
          title="El mismo bucle, con fijar"
          prompt="Ahora el bloque de adentro cambió. ¿Qué dice al final?"
          code={'fijar puntos a 0\nrepetir 3:\n  fijar puntos por 2\ndecir puntos'}
          numbered
          answers={['2']}
          explanation="2. Cada vuelta reemplaza el valor por 2, así que las tres vueltas dan el mismo resultado que una. Este es exactamente el bug del contador que siempre marca lo mismo."
        />

        <Quiz
          id="condicional-semaforo"
          index={6}
          title="El semáforo al hacer clic"
          prompt="El semáforo está en rojo. ¿Qué pasa al hacer clic con este script?"
          code={
            'si color = "rojo" entonces:\n  fijar color a "verde"\nsi no:\n  fijar color a "rojo"'
          }
          numbered
          options={[
            { id: 'verde', label: 'Queda en verde' },
            { id: 'rojo', label: 'Se queda en rojo' },
            { id: 'ambos', label: 'Ejecuta las dos ramas y termina en rojo' },
            { id: 'nada', label: 'No pasa nada porque falta el amarillo' },
          ]}
          answer="verde"
          explanation="Queda en verde. Un condicional ejecuta una rama o la otra, nunca las dos: la condición se cumple, entra por el «entonces» y se salta el «si no»."
          hint="¿Cuántas ramas de un si/si no se ejecutan en un mismo paso?"
        />

        <FillBlank
          id="bloque-azar"
          index={7}
          title="El dado necesita azar"
          prompt="Quieres un número del 1 al 6 cada vez que se hace clic."
          code={'al hacer clic en este sprite:\n  fijar resultado a ___\n  decir resultado por 2 segundos'}
          options={['número aleatorio entre 1 y 6', '6', 'color', 'repetir 6']}
          answer="número aleatorio entre 1 y 6"
          explanation="Ese bloque vive en la categoría Operadores. Si pusieras 6 fijo, tendrías un dado muy afortunado pero poco útil."
        />

        <MatchPairs
          id="empareja-bucles"
          index={8}
          title="Empareja el bucle con su uso"
          pairs={[
            { id: 'rep', izquierda: 'repetir 10', derecha: 'La animación del dado girando' },
            { id: 'siempre', izquierda: 'por siempre', derecha: 'La música de fondo del juego' },
            { id: 'hasta', izquierda: 'repetir hasta que…', derecha: 'Avanzar hasta tocar la meta' },
            { id: 'si', izquierda: 'si… entonces', derecha: 'Decir «¡Ganaste!» solo cuando sale 6' },
          ]}
          explanation="Fíjate en la última: «si» no es un bucle, es una decisión. Se ejecuta una vez y sigue; el bucle vuelve al principio."
        />

        <TrueFalse
          id="por-siempre"
          index={9}
          title="Después de «por siempre»"
          statement="Los bloques que van debajo de un «por siempre» se ejecutan cuando el bucle termina."
          answer={false}
          explanation="Falso. «Por siempre» no termina nunca, así que lo que esté debajo no corre jamás. Si necesitas que algo pase después, usa «repetir hasta que…»."
        />

        <MultiSelect
          id="que-necesita-dado"
          index={10}
          title="El mínimo del dado"
          prompt="Marca todo lo que tu dado necesita para cumplir el mínimo de la sesión."
          options={[
            { id: 'var', label: 'Una variable llamada resultado' },
            { id: 'clic', label: 'Reaccionar al hacer clic en el sprite' },
            { id: 'azar', label: 'Un número al azar entre 1 y 6' },
            { id: 'bucle', label: 'Un bucle que anime el dado girando' },
            { id: 'sonido', label: 'Una canción de fondo obligatoria' },
            { id: 'tres', label: 'Tres sprites distintos' },
          ]}
          answers={['var', 'clic', 'azar', 'bucle']}
          explanation="Variable, clic, azar y bucle. El sonido y los sprites extra son bonus: primero que funcione lo mínimo, después se adorna."
        />

        <Quiz
          id="donde-inicializar"
          index={11}
          title="¿Dónde va el valor inicial?"
          prompt="Quieres que el contador de tiradas arranque en 0 cada vez que empieza el juego. ¿Dónde pones «fijar tiradas a 0»?"
          options={[
            { id: 'bandera', label: 'Bajo «al presionar bandera verde»' },
            { id: 'clic', label: 'Bajo «al hacer clic en este sprite»' },
            { id: 'bucle', label: 'Dentro del bucle que anima el dado' },
            { id: 'nada', label: 'No hace falta ponerlo en ningún lado' },
          ]}
          answer="bandera"
          explanation="En la bandera verde: ese es el arranque del programa. Si lo pones en el clic, el contador se reinicia en cada tirada y nunca pasa de 1."
        />

        <PredictOutput
          id="dado-ganaste"
          index={12}
          title="¿Qué dice si sale 4?"
          prompt="El dado cayó en 4. Escribe exactamente lo que dice el sprite."
          code={
            'fijar resultado a 4\nsi resultado = 6 entonces:\n  decir "¡Ganaste!"\nsi no:\n  decir "Sigue intentando"'
          }
          numbered
          answers={['Sigue intentando', '"Sigue intentando"']}
          explanation="«Sigue intentando». La condición pide exactamente 6, y 4 no lo es, así que entra por la rama del «si no»."
        />

        <TrueFalse
          id="orden-importa"
          index={13}
          title="El orden de los bloques"
          statement="Si cambias el orden de dos bloques dentro de una secuencia, el programa hace lo mismo."
          answer={false}
          explanation="Falso. La secuencia es el orden: «decir resultado» antes de «fijar resultado» muestra el valor viejo. El mismo conjunto de bloques en otro orden es otro programa."
        />

        <Quiz
          id="condicional-vida-real"
          index={14}
          title="Un condicional de la vida diaria"
          prompt="¿Cuál de estas frases es un condicional?"
          options={[
            { id: 'a', label: 'Me levanto, me baño y desayuno' },
            { id: 'b', label: 'Si está lloviendo llevo sombrilla, si no llevo gafas de sol' },
            { id: 'c', label: 'Doy diez vueltas a la cancha' },
            { id: 'd', label: 'Mi nombre es Ana' },
          ]}
          answer="b"
          explanation="Esa. Hay una pregunta con dos caminos. La primera es una secuencia, la tercera un bucle y la cuarta una variable — las cuatro piezas de hoy, dichas en español."
        />

        <FillBlank
          id="bucle-animacion"
          index={15}
          title="Anima el dado"
          prompt="Quieres que el dado muestre 10 números rápidos antes de detenerse en el resultado."
          code={'___:\n  fijar resultado a número aleatorio entre 1 y 6\n  esperar 0.1 segundos'}
          options={['repetir 10', 'por siempre', 'si resultado = 6 entonces', 'esperar 10 segundos']}
          answer="repetir 10"
          explanation="«Repetir 10» sirve porque sabes cuántas vueltas quieres. Con «por siempre» el dado no pararía nunca de girar."
        />

        <OrderSteps
          id="orden-semaforo"
          index={16}
          title="Arma el semáforo"
          prompt="Ordena los pasos para construirlo en Scratch."
          steps={[
            { id: 'crear', text: 'Crear la variable color' },
            { id: 'inicial', text: 'Al presionar bandera verde: fijar color a "rojo"' },
            { id: 'clic', text: 'Agregar el bloque «al hacer clic en este sprite»' },
            { id: 'cond', text: 'Dentro del clic: si color = "rojo" entonces fijar a "verde", si no fijar a "rojo"' },
            { id: 'decir', text: 'Al final del clic: decir color por 1 segundo' },
          ]}
          explanation="Primero existe la variable, después el estado inicial, después la reacción. Ese orden — crear, inicializar, reaccionar — te va a servir en todos los lenguajes."
        />

        <MultiSelect
          id="errores-comunes"
          index={17}
          title="Mi dado no funciona"
          prompt="El dado siempre muestra el mismo número. Marca las causas posibles."
          options={[
            { id: 'fijo', label: 'Usaste un número fijo en vez del bloque de azar' },
            { id: 'fuera', label: 'El bloque de azar quedó fuera del «al hacer clic»' },
            { id: 'decir', label: 'Pusiste «decir resultado» antes de fijarlo' },
            { id: 'color', label: 'El sprite tiene el color equivocado' },
            { id: 'nombre', label: 'El proyecto no tiene nombre' },
          ]}
          answers={['fijo', 'fuera', 'decir']}
          explanation="Las tres primeras son bugs de lógica: valor fijo, bloque desconectado, u orden invertido. El color del sprite y el nombre del proyecto no afectan lo que hace el programa."
        />

        <TrueFalse
          id="scratch-sirve"
          index={18}
          title="¿Esto sirve para el curso?"
          statement="Lo que aprendiste hoy en bloques es distinto de lo que vas a escribir después en JavaScript."
          answer={false}
          explanation="Falso, y es la idea central de la sesión. Secuencia, variable, condicional y bucle son los mismos en Scratch, en JavaScript y en cualquier lenguaje. Lo único que cambia es que dejas de arrastrar bloques y empiezas a escribirlos."
        />
      </Exercises>
    </TopicPage>
  );
}
