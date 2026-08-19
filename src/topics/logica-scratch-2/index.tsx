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

const SLUG = 'logica-scratch-2';

/** Sesión 3 del cronograma — Scratch parte 2: física, clones y colisiones. */
export default function LogicaScratch2() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Qué vas a construir">
        <p>
          Un clon de Geometry Dash: un cubo que cae por gravedad, salta con la barra espaciadora,
          esquiva obstáculos que aparecen solos, y pierde si choca. Suena a mucho — son cuatro ideas
          y ya conoces tres.
        </p>
        <RefTable
          cabeceras={['Pieza', 'Qué concepto usa']}
          filas={[
            ['Gravedad', 'Una variable que se suma a la posición en cada vuelta de un bucle'],
            ['Salto', 'Un evento de teclado + un condicional'],
            ['Obstáculos', 'Clones: copias del mismo sprite que se mueven solas'],
            ['Game over', 'Un condicional con «¿tocando?»'],
          ]}
        />
      </Lesson>

      <Lesson title="2. La gravedad no es magia: es una resta que se repite">
        <p>
          En Scratch, la posición vertical es <code>y</code>: más grande es más arriba. Caer es que{' '}
          <code>y</code> baje. Pero un objeto real no cae a velocidad constante: cae{' '}
          <strong>cada vez más rápido</strong>. Por eso no restamos a la posición directamente, sino
          que guardamos una <em>velocidad</em> y esa velocidad es la que empeora en cada vuelta.
        </p>

        <Figure
          label="Diagrama: la velocidad crece y la caída se acelera"
          caption="Cada vuelta del bucle resta 1 a la velocidad, y la velocidad se le suma a la posición. Por eso los saltos separados abajo son más grandes: eso es la aceleración."
        >
          <svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="14" fill="var(--color-accent)" fontSize="11" letterSpacing="1.4">
              VUELTA DEL BUCLE
            </text>
            {[
              { v: -1, y: 40 },
              { v: -2, y: 62 },
              { v: -3, y: 96 },
              { v: -4, y: 142 },
              { v: -5, y: 200 },
            ].map(({ v, y }, i) => (
              <g key={v}>
                <rect x="120" y={y - 12} width="22" height="22" rx="4" fill="var(--color-accent)" opacity="0.75" />
                <text x="0" y={y + 4} fill="var(--color-text)" fontSize="12" opacity="0.7">
                  vuelta {i + 1}
                </text>
                <text
                  x="164"
                  y={y + 4}
                  fill="var(--color-text)"
                  fontSize="12"
                  opacity="0.6"
                  fontFamily="ui-monospace, monospace"
                >
                  velocidadY = {v}
                </text>
              </g>
            ))}
            <line
              x1="0"
              y1="222"
              x2="640"
              y2="222"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              opacity="0.8"
            />
            <text x="0" y="238" fill="var(--color-text)" fontSize="11" opacity="0.5">
              suelo
            </text>
          </svg>
        </Figure>

        <Callout>
          El truco entero cabe en dos líneas dentro de un «por siempre»:{' '}
          <code>cambiar velocidadY por -1</code> y <code>cambiar y por velocidadY</code>. La primera
          acelera la caída; la segunda la aplica.
        </Callout>

        <p>
          Experimenta con el número: con <code>-3</code> la caída es pesada, casi de piedra; con{' '}
          <code>-0.5</code> el cubo flota como en la luna. Ese único número define el «carácter» de
          tu juego.
        </p>
      </Lesson>

      <Lesson title="3. El salto: un empujón contra la gravedad">
        <p>
          Saltar es poner la velocidad en positivo de golpe: <code>fijar velocidadY a 15</code>. La
          gravedad sigue restando en cada vuelta, así que el cubo sube, se frena, y vuelve a caer —
          la parábola sale sola, no hay que programarla.
        </p>
        <Compare
          bien={{
            titulo: 'Con la condición «si toca el suelo»',
            items: [
              'Solo puedes saltar cuando estás apoyado',
              'Un salto por vez, como en el juego real',
              'La dificultad se siente justa',
            ],
          }}
          mal={{
            titulo: 'Sin esa condición',
            items: [
              'Puedes saltar en el aire, otra vez y otra vez',
              'El cubo vuela: se acabó el reto',
              'Es el bug más común de la sesión',
            ],
          }}
        />
      </Lesson>

      <Lesson title="4. Clones: un molde que fabrica copias">
        <p>
          No vas a crear 50 obstáculos a mano. Creas <strong>uno</strong> y le pides al programa que
          saque copias. Un sprite es el molde de la fábrica; cada clon sale con el mismo diseño y a
          partir de ahí vive su propia vida.
        </p>

        <Figure
          label="Diagrama: un sprite molde genera clones que cruzan la pantalla"
          caption="El molde está escondido y solo fabrica. Cada clon aparece a la derecha, cruza, y se elimina al salir: sin eso, el juego acumularía miles de clones y se congelaría."
        >
          <svg viewBox="0 0 640 180" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="0"
              y="30"
              width="120"
              height="70"
              rx="8"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.2"
              strokeDasharray="5 4"
            />
            <text x="16" y="60" fill="var(--color-accent)" fontSize="12">
              molde
            </text>
            <text x="16" y="80" fill="var(--color-text)" fontSize="11" opacity="0.6">
              (escondido)
            </text>
            {[210, 330, 450].map((x, i) => (
              <g key={x} opacity={1 - i * 0.22}>
                <rect x={x} y="48" width="34" height="34" rx="5" fill="var(--color-accent)" opacity="0.7" />
                <text x={x + 2} y="100" fill="var(--color-text)" fontSize="10" opacity="0.55">
                  clon {i + 1}
                </text>
              </g>
            ))}
            <line
              x1="140"
              y1="65"
              x2="196"
              y2="65"
              stroke="var(--color-accent)"
              strokeWidth="1"
              markerEnd=""
            />
            <path d="M196 65 l-8 -4 l0 8 z" fill="var(--color-accent)" />
            <text x="500" y="70" fill="var(--color-text)" fontSize="12" opacity="0.6">
              ← se mueven
            </text>
            <line
              x1="0"
              y1="130"
              x2="640"
              y2="130"
              stroke="var(--color-text)"
              strokeWidth="1"
              opacity="0.2"
            />
            <text x="0" y="152" fill="var(--color-text)" fontSize="11" opacity="0.5">
              x = -240 · aquí se elimina el clon
            </text>
            <text x="540" y="152" fill="var(--color-text)" fontSize="11" opacity="0.5">
              x = 240 · aparece
            </text>
          </svg>
        </Figure>

        <Callout tipo="ojo">
          Cada clon necesita su <strong>propio</strong> script, y ese empieza con «al comenzar como
          clon». Si pones el movimiento en el script del molde, los clones aparecen y se quedan
          quietos: es el segundo bug más común de la sesión.
        </Callout>
      </Lesson>

      <Lesson title="5. Arma el juego, paso a paso">
        <Steps>
          <Step title="Gravedad">
            Variable <code>velocidadY</code>. En bandera verde: fijarla en 0 y abrir un «por
            siempre» que haga <code>cambiar velocidadY por -1</code> y{' '}
            <code>cambiar y por velocidadY</code>.
          </Step>
          <Step title="Suelo">
            Dentro del mismo bucle: si <code>¿tocando suelo?</code> entonces{' '}
            <code>fijar velocidadY a 0</code>. Sin esto el cubo cae para siempre y desaparece.
          </Step>
          <Step title="Salto">
            Script aparte: al presionar espacio, si <code>¿tocando suelo?</code> entonces{' '}
            <code>fijar velocidadY a 15</code>.
          </Step>
          <Step title="Fábrica de obstáculos">
            En el sprite del obstáculo: en bandera verde, «por siempre → esperar 2 segundos → crear
            clon de mí mismo». Y esconde el molde.
          </Step>
          <Step title="Vida del clon">
            «Al comenzar como clon»: ir a x 240, mostrar, y un «por siempre» que haga{' '}
            <code>cambiar x por -5</code> y elimine el clon cuando <code>x &lt; -240</code>.
          </Step>
          <Step title="Game over">
            En el bucle del cubo: si <code>¿tocando obstáculo?</code> entonces «detener todos» y
            decir «¡Game Over!». El nombre tiene que coincidir <em>exacto</em> con el del sprite.
          </Step>
        </Steps>
      </Lesson>

      <Lesson title="6. Esto no se queda en Scratch">
        <RefTable
          cabeceras={['Hoy en Scratch', 'Más adelante en JavaScript']}
          filas={[
            [<code key="a">crear clon de mí mismo</code>, <code key="b">document.createElement()</code>],
            [<code key="c">variable velocidadY</code>, 'una variable de JavaScript, exactamente igual'],
            [<code key="d">si ¿tocando? entonces</code>, <code key="e">if</code>],
            [<code key="f">por siempre</code>, 'el bucle de animación del navegador'],
          ]}
        />
      </Lesson>

      <Exercises>
        <Quiz
          id="que-es-gravedad"
          index={1}
          title="¿Qué es la gravedad en el juego?"
          options={[
            { id: 'bloque', label: 'Un bloque especial de Scratch llamado «gravedad»' },
            { id: 'resta', label: 'Un número negativo que se le suma a la posición en cada vuelta del bucle' },
            { id: 'sprite', label: 'Un sprite invisible que empuja al cubo' },
            { id: 'auto', label: 'Algo que Scratch hace solo con todos los sprites' },
          ]}
          answer="resta"
          explanation="Eso. No hay física incluida: la gravedad es aritmética repetida. Un número que baja la posición un poquito en cada vuelta."
        />

        <TrueFalse
          id="y-arriba"
          index={2}
          title="El eje Y"
          statement="En Scratch, para que un sprite baje hay que aumentar su valor de y."
          answer={false}
          explanation="Falso. Más y es más arriba, así que caer es reducir y. Por eso la velocidad de caída es un número negativo."
        />

        <PredictOutput
          id="posicion-tras-vueltas"
          index={3}
          title="¿En qué y queda?"
          prompt="El cubo arranca en y = 100 y velocidadY = 0. Escribe el valor de y después de 3 vueltas."
          code={
            'fijar y a 100\nfijar velocidadY a 0\nrepetir 3:\n  cambiar velocidadY por -1\n  cambiar y por velocidadY'
          }
          numbered
          answers={['94']}
          explanation="94. Las velocidades son -1, -2 y -3, que suman -6 sobre los 100 iniciales. Fíjate en que cada vuelta cae más que la anterior: eso es acelerar."
          hint="Calcula la velocidad de cada vuelta y ve restándola."
        />

        <Quiz
          id="valor-gravedad"
          index={4}
          title="Cambiar el número de la gravedad"
          prompt="Cambias «cambiar velocidadY por -1» a «cambiar velocidadY por -0.5». ¿Qué pasa?"
          options={[
            { id: 'rapido', label: 'El cubo cae más rápido' },
            { id: 'flota', label: 'El cubo cae más lento, como flotando' },
            { id: 'igual', label: 'No cambia nada' },
            { id: 'sube', label: 'El cubo sube en vez de caer' },
          ]}
          answer="flota"
          explanation="Cae más lento. Con -0.5 la velocidad crece a la mitad de rápido: se siente como la luna. Con -3, como una piedra."
        />

        <FillBlank
          id="salto-impulso"
          index={5}
          title="El salto"
          prompt="Para saltar hay que darle un impulso hacia arriba de golpe."
          code={'al presionar tecla espacio:\n  si ¿tocando suelo? entonces:\n    ___'}
          options={['fijar velocidadY a 15', 'cambiar y por 15', 'fijar velocidadY a -15', 'esperar 15 segundos']}
          answer="fijar velocidadY a 15"
          explanation="Se fija la velocidad en positivo y la gravedad se encarga del resto: sube, se frena y cae. Si movieras y directamente, el cubo teletransportaría hacia arriba sin curva."
          hint="No muevas la posición: mueve la velocidad."
        />

        <TrueFalse
          id="salto-en-aire"
          index={6}
          title="La condición del salto"
          statement="Si quitas el «si ¿tocando suelo?» del salto, el jugador puede saltar en el aire tantas veces como quiera."
          answer={true}
          explanation="Verdadero. Sin esa condición cada tecla reinicia la velocidad hacia arriba, y el cubo vuela. Esa condición es la que hace que el juego tenga reto."
        />

        <Quiz
          id="por-que-velocidad-cero"
          index={7}
          title="Al tocar el suelo"
          prompt="¿Para qué sirve «si ¿tocando suelo? entonces fijar velocidadY a 0»?"
          options={[
            { id: 'parar', label: 'Para que el cubo deje de acelerar hacia abajo y se quede apoyado' },
            { id: 'saltar', label: 'Para que salte automáticamente' },
            { id: 'puntos', label: 'Para contar los puntos' },
            { id: 'nada', label: 'No sirve para nada, es opcional' },
          ]}
          answer="parar"
          explanation="Sin eso la velocidad sigue creciendo hacia abajo mientras está en el suelo, y en cuanto se despegue saldrá disparado hacia el fondo."
        />

        <Quiz
          id="que-es-clon"
          index={8}
          title="¿Qué es un clon?"
          options={[
            { id: 'copia', label: 'Una copia del sprite que se crea mientras el juego corre y tiene su propia vida' },
            { id: 'sprite', label: 'Otro sprite que dibujas tú a mano' },
            { id: 'foto', label: 'Una foto del sprite pegada al fondo' },
            { id: 'backup', label: 'Una copia de seguridad del proyecto' },
          ]}
          answer="copia"
          explanation="Eso. Un molde y muchas copias: cada clon corre su propio script desde «al comenzar como clon»."
        />

        <TrueFalse
          id="script-del-clon"
          index={9}
          title="Los clones no se mueven"
          statement="Si el movimiento está en el script de la bandera verde del molde, los clones también se mueven."
          answer={false}
          explanation="Falso, y es un bug clásico. El script de la bandera verde corre en el molde. Para que el clon haga algo, ese algo tiene que estar bajo «al comenzar como clon»."
        />

        <Quiz
          id="eliminar-clones"
          index={10}
          title="¿Por qué eliminar el clon?"
          prompt="El clon se elimina cuando su x baja de -240. ¿Qué pasaría si no lo hicieras?"
          options={[
            { id: 'nada', label: 'Nada, salen de la pantalla y ya' },
            { id: 'lento', label: 'Se van acumulando fuera de pantalla y el juego se pone lento' },
            { id: 'vuelven', label: 'Vuelven a entrar por el otro lado' },
            { id: 'error', label: 'Scratch muestra un mensaje de error' },
          ]}
          answer="lento"
          explanation="Se acumulan. Cada clon sigue corriendo su bucle aunque no se vea, así que el juego se arrastra. Limpiar lo que ya no se usa es parte de programar."
        />

        <MatchPairs
          id="empareja-bloques-juego"
          index={11}
          title="Empareja cada bloque con su papel"
          pairs={[
            { id: 'ev', izquierda: 'al presionar tecla espacio', derecha: 'Dispara el salto' },
            { id: 'clon', izquierda: 'al comenzar como clon', derecha: 'Le da vida propia a cada obstáculo' },
            { id: 'toca', izquierda: 'si ¿tocando obstáculo?', derecha: 'Detecta el choque y termina el juego' },
            { id: 'siempre', izquierda: 'por siempre', derecha: 'Mantiene la física corriendo todo el tiempo' },
          ]}
          explanation="Cuatro bloques, cuatro papeles: evento, creación, detección y repetición. Con eso ya tienes un juego."
        />

        <MultiSelect
          id="bugs-comunes"
          index={12}
          title="El cubo no cae"
          prompt="Tu cubo se queda quieto en el aire. Marca las causas posibles."
          options={[
            { id: 'nobucle', label: 'La física no está dentro de un «por siempre»' },
            { id: 'positivo', label: 'Estás sumando un número positivo a velocidadY' },
            { id: 'nosuma', label: 'Nunca sumas velocidadY a la posición y' },
            { id: 'color', label: 'El cubo es del color equivocado' },
            { id: 'nombre', label: 'El sprite se llama distinto' },
          ]}
          answers={['nobucle', 'positivo', 'nosuma']}
          explanation="Las tres primeras. Sin bucle la física corre una sola vez; con signo positivo sube; y si nunca aplicas la velocidad a la posición, el cubo no se entera de nada."
        />

        <OrderSteps
          id="orden-clon"
          index={13}
          title="Ordena la vida de un clon"
          prompt="Desde que nace hasta que desaparece."
          steps={[
            { id: 'nace', text: 'Al comenzar como clon' },
            { id: 'pos', text: 'Ir a x: 240, y: -100' },
            { id: 'mostrar', text: 'Mostrar' },
            { id: 'mover', text: 'Por siempre: cambiar x por -5' },
            { id: 'elim', text: 'Si x < -240: eliminar este clon' },
          ]}
          explanation="Nacer, colocarse, aparecer, moverse y morir. Fíjate en que se posiciona antes de mostrarse: al revés, el jugador vería el clon parpadear en el centro."
        />

        <PredictOutput
          id="cuantos-clones"
          index={14}
          title="¿Cuántos obstáculos en 10 segundos?"
          prompt="Con este script, escribe cuántos clones se crean en 10 segundos (solo el número)."
          code={'por siempre:\n  esperar 2 segundos\n  crear clon de mí mismo'}
          answers={['5']}
          explanation="5 clones: uno cada 2 segundos. Si quisieras un juego más difícil, bajarías esa espera — y así se ajusta la dificultad."
        />

        <TrueFalse
          id="nombre-exacto"
          index={15}
          title="El bloque «¿tocando?»"
          statement="En «¿tocando obstáculo?» da igual cómo se llame el sprite: Scratch lo encuentra igual."
          answer={false}
          explanation="Falso. Ese bloque es una lista de los sprites reales: si escogiste el equivocado o renombraste el sprite después, la colisión nunca se detecta y el juego no termina nunca."
        />

        <Quiz
          id="contador-puntos"
          index={16}
          title="Bonus: contador de puntos"
          prompt="Quieres sumar 1 punto por cada segundo que el jugador sobreviva. ¿Cuál script sirve?"
          options={[
            { id: 'a', label: 'por siempre: fijar puntos a 1 · esperar 1 segundo' },
            { id: 'b', label: 'por siempre: cambiar puntos por 1 · esperar 1 segundo' },
            { id: 'c', label: 'al presionar espacio: cambiar puntos por 1' },
            { id: 'd', label: 'repetir 10: cambiar puntos por 1' },
          ]}
          answer="b"
          explanation="«Cambiar por 1» suma y el bucle no termina, así que el contador crece mientras el jugador siga vivo. La opción A siempre deja el marcador en 1 — el error de fijar contra cambiar, otra vez."
        />

        <FillBlank
          id="game-over"
          index={17}
          title="Termina el juego"
          prompt="Al chocar, el juego debe detenerse por completo."
          code={'si ¿tocando obstáculo? entonces:\n  decir "¡Game Over!" por 2 segundos\n  ___'}
          options={['detener todos', 'esconder', 'ir a x: 0 y: 0', 'crear clon de mí mismo']}
          answer="detener todos"
          explanation="«Detener todos» corta todos los scripts, incluidos la fábrica de obstáculos y la física. Solo esconder el cubo dejaría el juego corriendo por debajo."
        />

        <Quiz
          id="dificultad-progresiva"
          index={18}
          title="Bonus: que se ponga más difícil"
          prompt="Quieres que los obstáculos vayan más rápido con el tiempo. ¿Cuál es la idea?"
          options={[
            {
              id: 'var',
              label: 'Guardar la velocidad en una variable y aumentarla cada cierto tiempo, y que el clon la use',
            },
            { id: 'mas', label: 'Crear más sprites de obstáculo a mano' },
            { id: 'nada', label: 'No se puede hacer en Scratch' },
            { id: 'reset', label: 'Reiniciar el juego cada 30 segundos' },
          ]}
          answer="var"
          explanation="Una variable compartida que los clones leen al moverse. Es el mismo patrón de siempre: guardar el estado en una variable y que el resto del programa lo consulte."
        />

        <TrueFalse
          id="scratch-a-js"
          index={19}
          title="Del bloque al código"
          statement="Crear clones en Scratch se parece a crear elementos en la página con JavaScript."
          answer={true}
          explanation="Verdadero: «crear clon de mí mismo» es primo de document.createElement(). Un molde, copias generadas mientras el programa corre, y cada copia con su propio comportamiento. Lo vas a reconocer en la sesión 10."
        />
      </Exercises>
    </TopicPage>
  );
}
