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
import { Callout, Compare, Figure, RefTable, Step, Steps, Terminal } from '../../components/visuals';

const SLUG = 'js-variables-tipos-operadores';

/** Sesión 9 del cronograma — JavaScript: variables, tipos y operadores. */
export default function JsVariablesTiposOperadores() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Tus primeras líneas de código de verdad">
        <p>
          Hasta ahora arrastraste bloques en Scratch y escribiste estructura en HTML. Hoy empiezas a
          escribir <strong>instrucciones</strong>: el mismo pensamiento de la sesión 2, pero en
          texto.
        </p>
        <p>
          Para probar no necesitas instalar nada: abre el navegador, presiona <kbd>F12</kbd> y ve a
          la pestaña <strong>Console</strong>. Escribe algo y presiona Enter.
        </p>
        <Terminal
          titulo="Consola del navegador"
          lineas={['2 + 2', '"hola" + " mundo"', '2 + "2"']}
        />
        <Callout>
          Ese último te va a sorprender: no da 4. Guárdalo, porque es la idea central de la sesión.
        </Callout>
      </Lesson>

      <Lesson title="2. Variables: let y const">
        <p>
          Una variable es una caja con etiqueta, igual que en Scratch. La diferencia es que ahora
          decides si la caja se puede volver a llenar.
        </p>
        <Compare
          bien={{
            titulo: 'const — el valor no cambia',
            items: [
              <code key="1">const negocio = "Café del Barrio";</code>,
              'El nombre del negocio, el IVA, la URL de tu API',
              'Si intentas reasignarla, el programa se detiene con un error',
              'Empieza siempre por const: es la opción segura',
            ],
          }}
          mal={{
            titulo: 'let — el valor va a cambiar',
            items: [
              <code key="2">let stock = 10;</code>,
              'El stock, el contador de clics, el total del carrito',
              'Se puede reasignar todas las veces que quieras',
              'Úsala solo cuando de verdad necesites cambiarla',
            ],
          }}
        />
        <Callout tipo="ojo">
          Vas a ver <code>var</code> en tutoriales viejos. No la uses: tiene reglas de alcance
          confusas que causan errores difíciles de encontrar. En este curso, <code>const</code> y{' '}
          <code>let</code>.
        </Callout>
      </Lesson>

      <Lesson title="3. Los cinco tipos que vas a usar hoy">
        <Figure
          label="Diagrama: los tipos de dato básicos de JavaScript"
          caption="El tipo lo deduce JavaScript del valor que escribes. typeof te lo dice en cualquier momento."
        >
          <svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg">
            {[
              { t: 'string', v: '"Café del Barrio"', d: 'texto, siempre entre comillas', y: 0 },
              { t: 'number', v: '15000    ·    4.5', d: 'números, con o sin decimales', y: 46 },
              { t: 'boolean', v: 'true    ·    false', d: 'verdadero o falso, sin comillas', y: 92 },
              { t: 'null', v: 'null', d: 'vacío a propósito', y: 138 },
              { t: 'undefined', v: 'undefined', d: 'declarada, pero sin valor todavía', y: 184 },
            ].map(({ t, v, d, y }) => (
              <g key={t}>
                <rect x="0" y={y} width="640" height="38" rx="6" fill="var(--color-text)" opacity="0.05" />
                <text
                  x="14"
                  y={y + 24}
                  fontSize="13"
                  fontFamily="ui-monospace, monospace"
                  fill="var(--color-accent-text)"
                >
                  {t}
                </text>
                <text
                  x="110"
                  y={y + 24}
                  fontSize="13"
                  fontFamily="ui-monospace, monospace"
                  fill="var(--color-text)"
                  opacity="0.9"
                >
                  {v}
                </text>
                <text x="330" y={y + 24} fontSize="12.5" fill="var(--color-text-2)">
                  {d}
                </text>
              </g>
            ))}
          </svg>
        </Figure>

        <Terminal
          lineas={[
            'let nombre = "Mi Negocio";     // string',
            'let precio = 15000;            // number',
            'let disponible = true;         // boolean',
            'let descuento = null;          // vacío intencional',
            'let categoria;                 // undefined',
            '',
            'console.log(typeof nombre);    // "string"',
          ]}
        />

        <Callout tipo="ojo">
          Las comillas cambian el tipo. <code>15000</code> es un número con el que puedes hacer
          cuentas; <code>"15000"</code> es texto que <em>parece</em> número. De ahí salen la mitad
          de los errores de esta sesión.
        </Callout>
      </Lesson>

      <Lesson title="4. Operadores">
        <RefTable
          cabeceras={['Tipo', 'Operadores', 'Para qué']}
          filas={[
            ['Aritméticos', <code key="a">+ - * / %</code>, 'Cuentas. El % es el residuo de la división'],
            ['Comparación', <code key="b">{'> < >= <= === !=='}</code>, 'Preguntan algo y devuelven true o false'],
            ['Lógicos', <code key="c">&amp;&amp; || !</code>, 'Combinan condiciones: y, o, no'],
            ['Asignación', <code key="d">= += -= ++</code>, 'Guardan o actualizan un valor'],
          ]}
        />
        <Callout tipo="ojo">
          Usa siempre <code>===</code> y <code>!==</code>, nunca <code>==</code>. El doble igual
          convierte los tipos por debajo: <code>{'"10" == 10'}</code> da <code>true</code> y eso
          esconde errores. El triple igual compara valor <em>y</em> tipo.
        </Callout>
      </Lesson>

      <Lesson title="5. El + que a veces suma y a veces pega">
        <p>
          Es el único operador con doble personalidad. Si los dos lados son números, suma. Si
          alguno es texto, convierte el otro a texto y los <strong>concatena</strong>.
        </p>
        <Figure
          label="Diagrama: el operador + con números y con texto"
          caption="El menos, el por y el dividido no tienen esa ambigüedad: siempre convierten a número. Por eso «5» - 2 da 3."
        >
          <svg viewBox="0 0 640 150" xmlns="http://www.w3.org/2000/svg">
            {[
              { a: '2', b: '2', r: '4', tipo: 'number + number → suma', y: 16 },
              { a: '2', b: '"2"', r: '"22"', tipo: 'number + string → concatena', y: 74 },
            ].map(({ a, b, r, tipo, y }) => (
              <g key={tipo}>
                <text x="0" y={y + 20} fontSize="20" fontFamily="ui-monospace, monospace" fill="var(--color-text)">
                  {a} + {b}
                </text>
                <line x1="110" y1={y + 14} x2="160" y2={y + 14} stroke="var(--color-accent)" strokeWidth="1" />
                <path d={`M162 ${y + 14} l-7 -4 l0 8 z`} fill="var(--color-accent)" />
                <text
                  x="176"
                  y={y + 20}
                  fontSize="20"
                  fontFamily="ui-monospace, monospace"
                  fill="var(--color-accent-text)"
                >
                  {r}
                </text>
                <text x="300" y={y + 20} fontSize="13" fill="var(--color-text-2)">
                  {tipo}
                </text>
              </g>
            ))}
          </svg>
        </Figure>
        <p>
          Para unir texto con números sin sorpresas, en el curso vas a usar{' '}
          <strong>plantillas</strong> con acentos graves:
        </p>
        <Terminal
          lineas={[
            'const nombre = "Ana";',
            'const edad = 17;',
            '',
            '// concatenando (funciona, pero se enreda)',
            'console.log(nombre + " tiene " + edad + " años");',
            '',
            '// plantilla (más fácil de leer)',
            'console.log(`${nombre} tiene ${edad} años`);',
          ]}
        />
      </Lesson>

      <Lesson title="6. Tu librería de cálculo, paso a paso">
        <Steps>
          <Step title="Crea el archivo">
            <code>calculadora.js</code> dentro de tu proyecto. Para probarlo rápido, pégalo también
            en la consola del navegador.
          </Step>
          <Step title="Escribe una función que devuelva">
            <Terminal lineas={['function sumar(a, b) {', '  return a + b;', '}']} />
            Sin <code>return</code> la función hace el cálculo y lo bota: quien la llama recibe{' '}
            <code>undefined</code>.
          </Step>
          <Step title="Prueba con console.log">
            <Terminal lineas={['console.log(sumar(10, 5));   // 15']} />
            Una función que no imprimes no te dice nada. Prueba cada una apenas la escribas.
          </Step>
          <Step title="Recorre una lista con un bucle">
            <Terminal
              lineas={[
                'function promedio(lista) {',
                '  let total = 0;',
                '  for (let i = 0; i < lista.length; i++) {',
                '    total = total + lista[i];',
                '  }',
                '  return total / lista.length;',
                '}',
              ]}
            />
            El acumulador va <em>antes</em> del bucle; si lo pones adentro se reinicia en cada
            vuelta.
          </Step>
          <Step title="Valida antes de operar">
            En <code>dividir</code>, revisa que el divisor no sea cero y devuelve un mensaje claro.
            Anticipar el caso raro es lo que separa un ejercicio de un programa.
          </Step>
        </Steps>
      </Lesson>

      <Exercises>
        <Quiz
          id="suma-con-texto"
          index={1}
          title="El caso que sorprende a todo el mundo"
          prompt="Lo escribiste en la consola. ¿Qué imprime la última línea?"
          code={'console.log(2 + 2);\nconsole.log("hola" + " mundo");\nconsole.log(2 + "2");'}
          numbered
          options={[
            { id: 'cuatro', label: '4' },
            { id: 'veintidos', label: '"22"' },
            { id: 'nan', label: 'NaN' },
            { id: 'error', label: 'Un error: no se puede sumar texto con número' },
          ]}
          answer="veintidos"
          explanation="Cuando uno de los lados del + es texto, JavaScript convierte el otro a texto y los une: 2 + «2» da la cadena «22», no el número 4."
          hint="El + hace dos cosas distintas según los tipos. Fíjate en las comillas."
        />

        <PredictOutput
          id="resta-con-texto"
          index={2}
          title="Predice la salida"
          prompt="El signo menos no tiene doble función. ¿Qué imprime?"
          code={'console.log("5" - 2);'}
          answers={['3']}
          explanation="3. Como el menos solo sirve para restar, JavaScript convierte «5» a número. Por eso 5 + «5» da «55» pero «5» - 2 da 3."
          hint="¿Qué puede hacer el signo menos con un texto? Solo le queda una opción."
        />

        <PredictOutput
          id="true-mas-uno"
          index={3}
          title="Un booleano en una suma"
          prompt="Otro caso raro de conversión. ¿Qué imprime?"
          code={'console.log(true + 1);'}
          answers={['2']}
          explanation="2. En una operación aritmética, true vale 1 y false vale 0. No es algo que debas usar a propósito: es una muestra de por qué conviene no mezclar tipos."
        />

        <Quiz
          id="const-reasignada"
          index={4}
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
          explanation="TypeError: Assignment to constant variable. Una const no se reasigna, y el error corta la ejecución. Si el valor va a cambiar, usa let."
          hint="JavaScript no ignora este error en silencio."
        />

        <Quiz
          id="let-o-const"
          index={5}
          title="¿let o const?"
          prompt="Vas a guardar el total del carrito de compras, que cambia cada vez que agregan un producto."
          options={[
            { id: 'const', label: 'const, porque es más seguro' },
            { id: 'let', label: 'let, porque el valor va a cambiar' },
            { id: 'var', label: 'var, que sirve para las dos cosas' },
            { id: 'nada', label: 'Sin declararla, para que sea más rápido' },
          ]}
          answer="let"
          explanation="let, porque se reasigna. La regla práctica: arranca con const y cámbiala a let solo cuando el compilador te reclame."
        />

        <MatchPairs
          id="empareja-tipos"
          index={6}
          title="Empareja el valor con su tipo"
          pairs={[
            { id: 'str', izquierda: <code>"25"</code>, derecha: 'string' },
            { id: 'num', izquierda: <code>25</code>, derecha: 'number' },
            { id: 'bool', izquierda: <code>true</code>, derecha: 'boolean' },
            { id: 'null', izquierda: <code>null</code>, derecha: 'null — vacío a propósito' },
            { id: 'undef', izquierda: <code>let x;</code>, derecha: 'undefined — sin valor todavía' },
          ]}
          explanation="Las comillas son la frontera entre string y number. Y null es un vacío que tú decidiste; undefined es un vacío que pasó solo."
        />

        <PredictOutput
          id="typeof-comillas"
          index={7}
          title="¿Qué tipo es?"
          prompt="Escribe exactamente lo que imprime, incluidas las comillas."
          code={'const edad = "17";\nconsole.log(typeof edad);'}
          numbered
          answers={['string', '"string"']}
          explanation="«string». Las comillas convierten al 17 en texto. Para operar con él tendrías que convertirlo con Number(edad)."
        />

        <Quiz
          id="comparacion-estricta"
          index={8}
          title="Comparación estricta"
          prompt="El stock es el número 10. ¿Qué imprimen estas dos líneas, en orden?"
          code={'let stock = 10;\n\nconsole.log(stock === "10");\nconsole.log(stock > 0 && stock < 100);'}
          numbered
          options={[
            { id: 'tt', label: 'true y true' },
            { id: 'ft', label: 'false y true' },
            { id: 'tf', label: 'true y false' },
            { id: 'ff', label: 'false y false' },
          ]}
          answer="ft"
          explanation="=== compara valor y tipo: el número 10 no es la cadena «10», así que false. La segunda es true porque 10 cumple las dos condiciones y && exige ambas."
        />

        <TrueFalse
          id="doble-igual"
          index={9}
          title="El doble igual"
          statement='"10" == 10 devuelve true.'
          answer={true}
          explanation="Verdadero, y justo por eso no se usa: == convierte los tipos antes de comparar, así que esconde errores. Con === el resultado sería false, que es lo que querías saber."
        />

        <FillBlank
          id="plantilla"
          index={10}
          title="Arma el mensaje"
          prompt="Con plantillas se lee mejor que concatenando."
          code={'const nombre = "Ana";\nconst edad = 17;\nconsole.log(`${nombre} tiene ___ años`);'}
          options={['${edad}', 'edad', '" + edad + "', '{edad}']}
          answer="${edad}"
          explanation="Dentro de acentos graves, ${'{'}variable{'}'} inserta el valor. Sin el signo de dólar es texto literal."
        />

        <PredictOutput
          id="concatenar"
          index={11}
          title="Predice la salida"
          prompt="Lee línea por línea y escribe exactamente lo que aparece."
          code={'const nombre = "Ana";\nconst edad = 17;\nconsole.log(nombre + " tiene " + edad + " años");'}
          numbered
          answers={['Ana tiene 17 años']}
          explanation="Al concatenar, el número se convierte a texto solo. Con plantillas el resultado es el mismo y se lee mejor."
        />

        <MultiSelect
          id="cuales-son-validos"
          index={12}
          title="Nombres de variable"
          prompt="Marca los nombres válidos y razonables en JavaScript."
          options={[
            { id: 'camel', label: 'precioTotal' },
            { id: 'guion', label: 'precio_total' },
            { id: 'numero', label: '2precios' },
            { id: 'espacio', label: 'precio total' },
            { id: 'descriptivo', label: 'stockDisponible' },
          ]}
          answers={['camel', 'guion', 'descriptivo']}
          explanation="No pueden empezar por número ni llevar espacios. En JavaScript la convención es camelCase: precioTotal, stockDisponible."
        />

        <PredictOutput
          id="residuo"
          index={13}
          title="El operador módulo"
          prompt="El % devuelve el residuo de la división. ¿Qué imprime?"
          code={'console.log(7 % 2);'}
          answers={['1']}
          explanation="1, el residuo de dividir 7 entre 2. Se usa muchísimo para saber si un número es par: n % 2 === 0."
        />

        <Quiz
          id="operador-logico"
          index={14}
          title="Y contra O"
          prompt="Quieres mostrar el botón de compra solo si hay stock Y el usuario inició sesión."
          options={[
            { id: 'and', label: 'if (hayStock && sesionIniciada)' },
            { id: 'or', label: 'if (hayStock || sesionIniciada)' },
            { id: 'not', label: 'if (!hayStock)' },
            { id: 'coma', label: 'if (hayStock, sesionIniciada)' },
          ]}
          answer="and"
          explanation="&& exige que las dos sean verdaderas; || se conforma con una. El ! niega."
        />

        <Quiz
          id="sin-return"
          index={15}
          title="La función que no devuelve nada"
          prompt="¿Qué imprime este código?"
          code={'function sumar(a, b) {\n  a + b;\n}\nconsole.log(sumar(10, 5));'}
          numbered
          options={[
            { id: '15', label: '15' },
            { id: 'undefined', label: 'undefined' },
            { id: 'error', label: 'Un error de sintaxis' },
            { id: 'nada', label: 'No imprime nada' },
          ]}
          answer="undefined"
          explanation="Le falta el return. La función hace la suma y la bota, así que devuelve undefined. Es el error más común al escribir tus primeras funciones."
          hint="Fíjate bien en la línea de adentro: ¿entrega el resultado?"
        />

        <OrderSteps
          id="funcion-promedio"
          index={16}
          title="Arma la función promedio"
          prompt="Ordena el cuerpo de promedio(lista)."
          steps={[
            { id: 'total', text: 'let total = 0;' },
            { id: 'for', text: 'for (let i = 0; i < lista.length; i++) {' },
            { id: 'suma', text: '  total = total + lista[i];' },
            { id: 'cierre', text: '}' },
            { id: 'return', text: 'return total / lista.length;' },
          ]}
          explanation="El acumulador antes del bucle, la suma adentro, y el return al final. Si el acumulador quedara dentro del bucle, se reiniciaría en cada vuelta."
        />

        <PredictOutput
          id="promedio-resultado"
          index={17}
          title="¿Cuánto devuelve?"
          prompt="Con la función promedio ya escrita, ¿qué imprime esta llamada?"
          code={'console.log(promedio([10, 20, 30]));'}
          answers={['20']}
          explanation="20. Suma 60 y divide entre 3 elementos. Fíjate en que lista.length da la cantidad: no hay que contarla a mano."
        />

        <Quiz
          id="dividir-entre-cero"
          index={18}
          title="Validar antes de dividir"
          prompt="En tu función dividir, ¿qué conviene hacer si el segundo número es 0?"
          options={[
            { id: 'a', label: 'Nada: JavaScript ya lanza un error automáticamente' },
            { id: 'b', label: 'Devolver un mensaje claro antes de intentar la división' },
            { id: 'c', label: 'Devolver 0' },
            { id: 'd', label: 'Dividir igual, total el resultado no importa' },
          ]}
          answer="b"
          explanation="JavaScript no lanza error: devuelve Infinity, que se cuela silenciosamente por el resto del programa. Validar y avisar es lo correcto."
        />

        <TrueFalse
          id="scratch-js"
          index={19}
          title="De Scratch a JavaScript"
          statement="«fijar puntos a 0» en Scratch equivale a puntos = 0 en JavaScript, y «cambiar puntos por 1» equivale a puntos = puntos + 1."
          answer={true}
          explanation="Verdadero. Es exactamente la misma lógica de la sesión 2, escrita como texto. Si entendiste los bloques, ya entiendes esto: solo cambió la forma de escribirlo."
        />
      </Exercises>
    </TopicPage>
  );
}
