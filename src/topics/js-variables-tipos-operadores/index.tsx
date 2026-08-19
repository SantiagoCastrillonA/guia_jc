import { Exercises, Lesson, TopicPage } from '../../components/TopicPage';
import { OrderSteps, PredictOutput, Quiz } from '../../components/exercises';

const SLUG = 'js-variables-tipos-operadores';

/** Sesión 9 del cronograma — JavaScript: variables, tipos y operadores. */
export default function JsVariablesTiposOperadores() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="Variables: let y const">
        <p>
          Una variable es una caja con etiqueta. Con <code>let</code> puedes vaciarla y volver a
          llenarla; con <code>const</code> la sellas una vez y no la vuelves a abrir.
        </p>
        <ul>
          <li>
            <code>let stock = 10;</code> — el stock cambia, va en <code>let</code>.
          </li>
          <li>
            <code>const negocio = "Mi Negocio";</code> — el nombre del negocio no cambia, va en{' '}
            <code>const</code>.
          </li>
        </ul>
      </Lesson>

      <Lesson title="Los tipos de dato">
        <p>
          JavaScript deduce el tipo del valor. Los cinco que vas a ver hoy: <code>string</code>{' '}
          (texto entre comillas), <code>number</code> (números, con o sin decimales),{' '}
          <code>boolean</code> (<code>true</code> o <code>false</code>), <code>null</code> (vacío a
          propósito) y <code>undefined</code> (una variable declarada sin valor). Para preguntarle
          el tipo a un valor: <code>typeof valor</code>.
        </p>
      </Lesson>

      <Lesson title="Operadores">
        <p>
          Aritméticos (<code>+ - * /</code>), de comparación (<code>&gt; &lt; === !==</code>) y
          lógicos (<code>&amp;&amp; ||</code>). Compara siempre con <code>===</code> y{' '}
          <code>!==</code>: <code>==</code> convierte los tipos por debajo y produce sorpresas.
        </p>
        <p>
          Ojo con el <code>+</code>: si uno de los dos lados es texto, JavaScript une en vez de
          sumar. El <code>-</code> no tiene esa doble función, así que convierte a número.
        </p>
      </Lesson>

      <Exercises>
        <Quiz
          id="suma-con-texto"
          index={1}
          title="El caso que sorprende a todo el mundo"
          prompt="Lo escribiste en la consola en el bloque 1. ¿Qué imprime la última línea?"
          code={'console.log(2 + 2);\nconsole.log("hola" + " mundo");\nconsole.log(2 + "2");'}
          numbered
          options={[
            { id: 'cuatro', label: '4' },
            { id: 'veintidos', label: '"22"' },
            { id: 'nan', label: 'NaN' },
            { id: 'error', label: 'Un error: no se puede sumar texto con número' },
          ]}
          answer="veintidos"
          explanation={
            <>
              Eso es. Cuando uno de los lados del <code>+</code> es texto, JavaScript convierte el
              otro a texto y los une: <code>2 + "2"</code> da la cadena <code>"22"</code>, no el
              número 4.
            </>
          }
          hint={
            <>
              El <code>+</code> hace dos cosas distintas según los tipos. Fíjate en las comillas del
              segundo valor.
            </>
          }
        />

        <PredictOutput
          id="resta-con-texto"
          index={2}
          title="Predice la salida"
          prompt="El signo menos no tiene doble función. ¿Qué imprime?"
          code={'console.log("5" - 2);'}
          answers={['3']}
          explanation={
            <>
              Correcto: <code>3</code>. Como <code>-</code> solo sirve para restar, JavaScript
              convierte <code>"5"</code> a número. Por eso <code>5 + "5"</code> da <code>"55"</code>{' '}
              pero <code>"5" - 2</code> da <code>3</code>.
            </>
          }
          hint="Piensa qué puede hacer el signo menos con un texto: solo le queda una opción."
        />

        <Quiz
          id="const-reasignada"
          index={3}
          title="¿Qué pasa si reasignas una const?"
          code={'const negocio = "Mi Negocio";\nnegocio = "Otro Nombre";\nconsole.log(negocio);'}
          numbered
          options={[
            { id: 'cambia', label: 'Imprime "Otro Nombre": la variable cambió' },
            { id: 'viejo', label: 'Imprime "Mi Negocio": el cambio se ignora en silencio' },
            { id: 'error', label: 'Lanza un TypeError y el programa se detiene' },
            { id: 'undefined', label: 'Imprime undefined' },
          ]}
          answer="error"
          explanation={
            <>
              Exacto: <code>TypeError: Assignment to constant variable</code>. Una <code>const</code>{' '}
              no se puede reasignar, y el error corta la ejecución. Si el valor va a cambiar, usa{' '}
              <code>let</code>.
            </>
          }
          hint="JavaScript no ignora este error en silencio. Pruébalo en la consola del navegador."
        />

        <Quiz
          id="comparacion-estricta"
          index={4}
          title="Comparación estricta"
          prompt="El stock es el número 10. ¿Qué imprimen estas dos comparaciones, en orden?"
          code={'let stock = 10;\n\nconsole.log(stock === "10");\nconsole.log(stock > 0 && stock < 100);'}
          numbered
          options={[
            { id: 'tt', label: 'true y true' },
            { id: 'ft', label: 'false y true' },
            { id: 'tf', label: 'true y false' },
            { id: 'ff', label: 'false y false' },
          ]}
          answer="ft"
          explanation={
            <>
              Correcto. <code>===</code> compara valor <em>y</em> tipo: el número <code>10</code> no
              es la cadena <code>"10"</code>, así que da <code>false</code>. La segunda es{' '}
              <code>true</code> porque 10 cumple las dos condiciones y <code>&amp;&amp;</code> exige
              ambas.
            </>
          }
          hint={
            <>
              <code>===</code> también mira el tipo, no solo el contenido.
            </>
          }
        />

        <OrderSteps
          id="funcion-promedio"
          index={5}
          title="Arma la función promedio"
          prompt="Estas son las líneas del cuerpo de promedio(lista). Ordénalas para que la función devuelva el promedio correcto."
          steps={[
            { id: 'total', text: 'let total = 0;' },
            { id: 'for', text: 'for (let i = 0; i < lista.length; i++) {' },
            { id: 'suma', text: '  total = total + lista[i];' },
            { id: 'cierre', text: '}' },
            { id: 'return', text: 'return total / lista.length;' },
          ]}
          explanation={
            <>
              Ese es el orden. El acumulador tiene que existir <em>antes</em> del bucle, el bucle
              suma cada elemento, y el <code>return</code> va al final: sin <code>return</code> la
              función no entrega ningún valor.
            </>
          }
          hint="¿Dónde tiene que estar el acumulador para no reiniciarse en cada vuelta? ¿Y el return?"
        />
      </Exercises>
    </TopicPage>
  );
}
