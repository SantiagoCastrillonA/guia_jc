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

const SLUG = 'git-y-trabajo-en-equipo';

/** Sesión 4 del cronograma — Git, GitHub y trabajo en equipo. */
export default function GitYTrabajoEnEquipo() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. El problema que Git resuelve">
        <p>
          Cuatro personas editan el mismo archivo. Aparecen{' '}
          <code>tarea_final.docx</code>, <code>tarea_final_v2.docx</code> y el clásico{' '}
          <code>tarea_final_ESTA_SI.docx</code>. El lunes nadie sabe cuál vale ni qué cambió cada
          quien.
        </p>
        <p>
          Git es un historial: guarda puntos en el tiempo, con la firma de quién los hizo y una nota
          de qué cambió. Puedes volver a cualquiera de esos puntos, y puedes trabajar en paralelo
          sin pisarle el trabajo a nadie.
        </p>
        <Callout>
          <strong>Git</strong> vive en tu computador y lleva el historial.{' '}
          <strong>GitHub</strong> es la nube donde subes ese historial para compartirlo. Git
          funciona sin internet; GitHub no. Son dos cosas distintas y se confunden todo el tiempo.
        </Callout>
      </Lesson>

      <Lesson title="2. Las tres zonas: el modelo mental que lo explica todo">
        <p>
          Casi todos los enredos con Git se aclaran cuando ves que tu proyecto vive en cuatro
          lugares a la vez. Un archivo va pasando de uno al siguiente, y cada comando mueve cosas de
          una zona a otra.
        </p>

        <Figure
          label="Diagrama: carpeta de trabajo, zona de preparación, repositorio local y GitHub"
          caption="add prepara, commit guarda, push publica. Los tres comandos que vas a escribir el resto del curso mueven un archivo de una caja a la siguiente."
        >
          <svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg">
            {[
              { t: 'Tu carpeta', s: 'los archivos que editas', x: 0 },
              { t: 'Preparación', s: 'lo que va en el próximo commit', x: 165 },
              { t: 'Repo local', s: 'el historial en tu máquina', x: 330 },
              { t: 'GitHub', s: 'el historial en la nube', x: 495 },
            ].map(({ t, s, x }) => (
              <g key={t}>
                <rect
                  x={x}
                  y="40"
                  width="145"
                  height="76"
                  rx="8"
                  fill="var(--color-text)"
                  opacity="0.06"
                />
                <rect x={x} y="40" width="145" height="2" rx="1" fill="var(--color-accent)" opacity="0.8" />
                <text x={x + 14} y="70" fill="var(--color-text)" fontSize="14">
                  {t}
                </text>
                <text x={x + 14} y="90" fill="var(--color-text)" fontSize="11" opacity="0.55">
                  {s}
                </text>
              </g>
            ))}
            {[
              { label: 'git add', x: 148 },
              { label: 'git commit', x: 313 },
              { label: 'git push', x: 478 },
            ].map(({ label, x }) => (
              <g key={label}>
                <line x1={x} y1="78" x2={x + 16} y2="78" stroke="var(--color-accent)" strokeWidth="1.2" />
                <path d={`M${x + 17} 78 l-6 -3.5 l0 7 z`} fill="var(--color-accent)" />
                <text
                  x={x + 8}
                  y="140"
                  fill="var(--color-accent-text)"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="ui-monospace, monospace"
                >
                  {label}
                </text>
              </g>
            ))}
            <line
              x1="567"
              y1="160"
              x2="72"
              y2="160"
              stroke="var(--color-text)"
              strokeWidth="1"
              opacity="0.3"
              strokeDasharray="4 4"
            />
            <path d="M72 160 l6 -3.5 l0 7 z" fill="var(--color-text)" opacity="0.4" />
            <text
              x="320"
              y="180"
              fill="var(--color-text)"
              fontSize="11"
              opacity="0.5"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
            >
              git pull — traer lo que hicieron los demás
            </text>
          </svg>
        </Figure>

        <RefTable
          cabeceras={['Comando', 'Qué hace']}
          filas={[
            [<code key="a">git status</code>, 'Qué cambió y en qué zona está cada archivo'],
            [<code key="b">git add .</code>, 'Prepara todos los cambios para el próximo commit'],
            [<code key="c">git commit -m "…"</code>, 'Guarda un punto en el historial local, con mensaje'],
            [<code key="d">git push</code>, 'Sube tus commits a GitHub'],
            [<code key="e">git pull</code>, 'Baja lo que subieron los demás'],
            [<code key="f">git log --oneline</code>, 'Ver el historial, un commit por línea'],
          ]}
        />
      </Lesson>

      <Lesson title="3. Tu primer repositorio, paso a paso">
        <Steps>
          <Step title="Crea la carpeta y entra">
            <Terminal lineas={['$ mkdir mi-emprendimiento', '$ cd mi-emprendimiento']} />
          </Step>
          <Step title="Inicializa el historial">
            <Terminal
              lineas={['$ git init', '# Initialized empty Git repository in .../mi-emprendimiento/.git/']}
            />
            Ese mensaje es la señal de que la carpeta ya tiene historial. Se creó una carpeta oculta{' '}
            <code>.git</code>: ahí vive todo.
          </Step>
          <Step title="Crea el README y míralo sin preparar">
            <Terminal lineas={['$ git status', '# Untracked files: README.md']} />
            En rojo significa que Git ve el archivo pero todavía no lo está siguiendo.
          </Step>
          <Step title="Prepara y guarda el primer punto">
            <Terminal
              lineas={['$ git add .', '$ git commit -m "docs: agrego el README con la idea del negocio"']}
            />
          </Step>
          <Step title="Conecta con GitHub y sube">
            <Terminal
              lineas={[
                '# crea el repositorio vacío en github.com y copia su URL',
                '$ git remote add origin https://github.com/tu-usuario/mi-emprendimiento.git',
                '$ git push -u origin main',
              ]}
            />
          </Step>
          <Step title="Comprueba el historial">
            <Terminal lineas={['$ git log --oneline', '# a1b2c3d docs: agrego el README con la idea del negocio']} />
          </Step>
        </Steps>
      </Lesson>

      <Lesson title="4. Mensajes de commit: escribe para tu yo del futuro">
        <p>
          El mensaje es lo único que vas a tener dentro de tres meses para entender qué pasó. La
          convención del curso es un prefijo, dos puntos y una frase concreta en presente.
        </p>
        <Compare
          bien={{
            titulo: 'Mensajes que sirven',
            items: [
              <code key="1">feat: agrego el catálogo de productos</code>,
              <code key="2">fix: corrijo el enlace roto del menú</code>,
              <code key="3">docs: describo el negocio en el README</code>,
              <code key="4">style: ajusto los colores de la marca</code>,
            ],
          }}
          mal={{
            titulo: 'Mensajes que no dicen nada',
            items: [
              <code key="5">cambios</code>,
              <code key="6">asdasd</code>,
              <code key="7">ya quedó</code>,
              <code key="8">final_final_v2</code>,
            ],
          }}
        />
        <RefTable
          cabeceras={['Prefijo', 'Cuándo se usa']}
          filas={[
            [<code key="a">feat</code>, 'Algo nuevo que antes no existía'],
            [<code key="b">fix</code>, 'Arreglar algo que estaba mal'],
            [<code key="c">docs</code>, 'Documentación: README, comentarios, guías'],
            [<code key="d">style</code>, 'Cambios visuales o de formato, sin cambiar la lógica'],
            [<code key="e">refactor</code>, 'Reorganizar el código sin cambiar lo que hace'],
          ]}
        />
        <Callout>
          ¿Cada cuánto commit? Cada vez que termines <em>una cosa</em>. No cada cuatro horas — si
          algo se rompe, un commit gigante no te deja saber qué lo rompió.
        </Callout>
      </Lesson>

      <Lesson title="5. Ramas: probar sin romper">
        <p>
          Una rama es una línea paralela de trabajo. Sales de <code>main</code>, haces tus cambios
          tranquilo, y cuando funciona lo unes de vuelta. Si el experimento sale mal, borras la rama
          y no pasó nada.
        </p>

        <Figure
          label="Diagrama: una rama sale de main, avanza y se fusiona de vuelta"
          caption="Cada punto es un commit. La rama vive aparte hasta que el merge la trae de vuelta a main."
        >
          <svg viewBox="0 0 640 150" xmlns="http://www.w3.org/2000/svg">
            <line x1="20" y1="105" x2="620" y2="105" stroke="var(--color-text)" strokeWidth="1.5" opacity="0.35" />
            <text x="20" y="132" fill="var(--color-text)" fontSize="11" opacity="0.55">
              main
            </text>
            <path
              d="M180 105 C 220 105, 220 45, 260 45"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
            />
            <line x1="260" y1="45" x2="440" y2="45" stroke="var(--color-accent)" strokeWidth="1.5" />
            <path
              d="M440 45 C 480 45, 480 105, 520 105"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
            />
            <text x="262" y="30" fill="var(--color-accent-text)" fontSize="11">
              rama santiago-catalogo
            </text>
            {[100, 180, 520, 600].map((x) => (
              <circle key={x} cx={x} cy="105" r="6" fill="var(--color-text)" opacity="0.5" />
            ))}
            {[300, 380, 440].map((x) => (
              <circle key={x} cx={x} cy="45" r="6" fill="var(--color-accent)" />
            ))}
            <text x="486" y="132" fill="var(--color-text)" fontSize="11" opacity="0.55">
              merge
            </text>
          </svg>
        </Figure>

        <Terminal
          titulo="Flujo de trabajo en equipo"
          lineas={[
            '$ git clone https://github.com/equipo/frases-del-equipo.git',
            '$ cd frases-del-equipo',
            '# crear tu propia rama',
            '$ git checkout -b nombre-apellido',
            '# ...trabajas, guardas...',
            '$ git add .',
            '$ git commit -m "feat: agrego mi frase"',
            '$ git push origin nombre-apellido',
            '# cuando el profe haga el merge:',
            '$ git pull origin main',
          ]}
        />

        <Callout tipo="ojo">
          Un <strong>conflicto de merge</strong> no es un error tuyo: pasa cuando dos personas
          tocaron las mismas líneas. Git marca las dos versiones con{' '}
          <code>{'<<<<<<<'}</code>, tú eliges qué queda, borras las marcas y haces un commit nuevo.
          Es trabajo normal de equipo, no una falla.
        </Callout>
      </Lesson>

      <Exercises>
        <Quiz
          id="git-vs-github"
          index={1}
          title="Git y GitHub no son lo mismo"
          prompt="¿Cuál afirmación es correcta?"
          options={[
            { id: 'a', label: 'Git es la página web y GitHub el programa de tu computador' },
            { id: 'b', label: 'Git lleva el historial en tu computador; GitHub lo guarda y comparte en internet' },
            { id: 'c', label: 'Son dos nombres para la misma herramienta' },
            { id: 'd', label: 'Git solo funciona si tienes cuenta en GitHub' },
          ]}
          answer="b"
          explanation="Git es local y funciona sin internet. GitHub es un servicio en la nube donde publicas ese historial. Puedes usar Git sin GitHub perfectamente."
        />

        <MatchPairs
          id="empareja-comandos"
          index={2}
          title="Empareja el comando con lo que hace"
          pairs={[
            { id: 'status', izquierda: <code>git status</code>, derecha: 'Ver qué cambió y qué está preparado' },
            { id: 'add', izquierda: <code>git add .</code>, derecha: 'Preparar los cambios para el commit' },
            { id: 'commit', izquierda: <code>git commit -m</code>, derecha: 'Guardar un punto en el historial' },
            { id: 'push', izquierda: <code>git push</code>, derecha: 'Subir tus commits a GitHub' },
            { id: 'log', izquierda: <code>git log --oneline</code>, derecha: 'Ver los puntos guardados' },
          ]}
          explanation="Ese es el 90% del Git que vas a usar en el curso. Los demás comandos aparecen cuando algo se complica."
        />

        <OrderSteps
          id="orden-primer-repo"
          index={3}
          title="Ordena tu primer repositorio"
          prompt="Desde la carpeta vacía hasta verlo en GitHub."
          steps={[
            { id: 'init', text: 'git init' },
            { id: 'add', text: 'git add .' },
            { id: 'commit', text: 'git commit -m "docs: README inicial"' },
            { id: 'remote', text: 'git remote add origin <url-del-repo>' },
            { id: 'push', text: 'git push -u origin main' },
          ]}
          explanation="Inicializar, preparar, guardar, conectar y subir. Si intentas hacer push antes del commit no hay nada que subir: el push solo publica commits."
        />

        <TrueFalse
          id="add-guarda"
          index={4}
          title="¿git add guarda?"
          statement="Con git add ya quedaron guardados los cambios en el historial."
          answer={false}
          explanation="Falso. add solo prepara: pone los archivos en la zona de preparación. El que guarda el punto en el historial es commit."
          hint="Vuelve al diagrama de las cuatro cajas: ¿a cuál caja llega add?"
        />

        <Quiz
          id="mensaje-commit"
          index={5}
          title="Elige el mejor mensaje"
          prompt="Agregaste la sección de productos a tu página. ¿Cuál mensaje escribes?"
          options={[
            { id: 'a', label: 'cambios' },
            { id: 'b', label: 'ya quedó el catálogo por fin' },
            { id: 'c', label: 'feat: agrego la sección de productos' },
            { id: 'd', label: 'productos.html' },
          ]}
          answer="c"
          explanation="Prefijo, dos puntos, y qué se hizo en presente. Dentro de tres meses ese mensaje te dice exactamente qué pasó sin abrir el código."
        />

        <MultiSelect
          id="cuando-commit"
          index={6}
          title="¿Cuándo hacer commit?"
          prompt="Marca los momentos en que conviene guardar un punto."
          options={[
            { id: 'termine', label: 'Terminaste la sección de productos' },
            { id: 'funciona', label: 'Arreglaste un error y ya funciona' },
            { id: 'antes', label: 'Antes de empezar algo arriesgado que podría romper todo' },
            { id: 'roto', label: 'El código está a medias y ni siquiera abre' },
            { id: 'horas', label: 'Llevas cuatro horas sin guardar nada' },
          ]}
          answers={['termine', 'funciona', 'antes', 'horas']}
          explanation="Commit cuando algo esté completo, o antes de arriesgarte, o simplemente porque llevas mucho sin guardar. Lo que no conviene es subir a main código que ni siquiera arranca."
        />

        <FillBlank
          id="crear-rama"
          index={7}
          title="Crea tu rama"
          prompt="Vas a trabajar sin tocar main."
          code={'$ git ___ mi-nombre'}
          options={['checkout -b', 'clone', 'push', 'status']}
          answer="checkout -b"
          explanation="checkout -b crea la rama y te cambia a ella en un solo paso. Sin el -b intentaría cambiarse a una rama que todavía no existe."
        />

        <Quiz
          id="para-que-rama"
          index={8}
          title="¿Para qué sirve una rama?"
          options={[
            { id: 'a', label: 'Para trabajar en algo nuevo sin romper lo que ya funciona en main' },
            { id: 'b', label: 'Para hacer una copia de seguridad del computador' },
            { id: 'c', label: 'Para borrar el historial viejo' },
            { id: 'd', label: 'Para que el proyecto pese menos' },
          ]}
          answer="a"
          explanation="Es un camino paralelo. Si el experimento funciona, se fusiona; si no, se borra la rama y main nunca se enteró."
        />

        <TrueFalse
          id="conflicto-error"
          index={9}
          title="Conflictos de merge"
          statement="Un conflicto de merge significa que hiciste algo mal."
          answer={false}
          explanation="Falso. Significa que dos personas cambiaron las mismas líneas y Git no quiere decidir por ustedes. Se abre el archivo, se elige qué queda, se borran las marcas y se hace un commit."
        />

        <Quiz
          id="not-a-git-repository"
          index={10}
          title="fatal: not a git repository"
          prompt="Escribes git status y sale ese error. ¿Qué pasó?"
          options={[
            { id: 'a', label: 'No estás dentro de la carpeta del proyecto, o falta el git init' },
            { id: 'b', label: 'Se te venció la cuenta de GitHub' },
            { id: 'c', label: 'Hay que reinstalar Git' },
            { id: 'd', label: 'El repositorio es privado' },
          ]}
          answer="a"
          explanation="Git busca la carpeta oculta .git en el directorio actual. O te falta un cd a la carpeta correcta, o nunca corriste git init ahí."
        />

        <FillBlank
          id="traer-cambios"
          index={11}
          title="Traer el trabajo de los demás"
          prompt="El profe hizo el merge de todas las ramas. Quieres el resultado en tu computador."
          code={'$ git ___ origin main'}
          options={['pull', 'push', 'add', 'commit']}
          answer="pull"
          explanation="pull baja y aplica lo que hay en GitHub. push es al revés: sube lo tuyo. Confundirlos es normal la primera semana."
        />

        <OrderSteps
          id="orden-colaborar"
          index={12}
          title="Ordena el flujo de colaboración"
          prompt="Trabajando en el repositorio compartido del equipo."
          steps={[
            { id: 'clone', text: 'git clone <url del repo del equipo>' },
            { id: 'branch', text: 'git checkout -b nombre-apellido' },
            { id: 'work', text: 'Crear tu archivo y editarlo' },
            { id: 'commit', text: 'git add . && git commit -m "feat: agrego mi frase"' },
            { id: 'push', text: 'git push origin nombre-apellido' },
            { id: 'pull', text: 'git pull origin main después del merge' },
          ]}
          explanation="Clonar, ramificar, trabajar, guardar, subir tu rama y bajar el resultado. Este ciclo es el mismo en cualquier empresa."
        />

        <TrueFalse
          id="readme-nombre"
          index={13}
          title="El README no aparece"
          statement="Da igual si el archivo se llama readme.md o Readme.MD: GitHub lo muestra igual."
          answer={false}
          explanation="Falso. GitHub muestra automáticamente el archivo llamado exactamente README.md. Con otro nombre queda ahí, pero no se muestra en la portada del repositorio."
        />

        <MultiSelect
          id="que-va-readme"
          index={14}
          title="Qué lleva tu README"
          prompt="El README de tu emprendimiento. Marca lo que debe tener."
          options={[
            { id: 'nombre', label: 'El nombre del negocio' },
            { id: 'problema', label: 'Qué problema resuelve' },
            { id: 'publico', label: 'A quién va dirigido' },
            { id: 'productos', label: 'Los productos o servicios' },
            { id: 'equipo', label: 'Los integrantes del equipo' },
            { id: 'clave', label: 'La contraseña de la base de datos' },
          ]}
          answers={['nombre', 'problema', 'publico', 'productos', 'equipo']}
          explanation="Todo menos la contraseña. Nunca subas claves ni tokens a un repositorio: si es público las ve cualquiera, y aunque lo borres queda en el historial."
        />

        <Quiz
          id="secreto-en-repo"
          index={15}
          title="Subiste una contraseña sin querer"
          prompt="Hiciste commit y push de un archivo con la clave de tu base de datos. ¿Qué haces?"
          options={[
            { id: 'a', label: 'Borrar el archivo, hacer commit y ya: queda solucionado' },
            { id: 'b', label: 'Cambiar esa contraseña de inmediato, porque sigue en el historial' },
            { id: 'c', label: 'No pasa nada si nadie mira el repo' },
            { id: 'd', label: 'Poner el repositorio en privado y dejarla igual' },
          ]}
          answer="b"
          explanation="Borrarla en un commit nuevo no la quita del historial: cualquiera puede ver el commit anterior. La única solución real es cambiar la contraseña. Por eso las claves van en archivos ignorados, nunca en el repo."
        />

        <Quiz
          id="git-log"
          index={16}
          title="Ver el historial"
          prompt="Quieres ver todos los puntos guardados, uno por línea."
          options={[
            { id: 'a', label: 'git status' },
            { id: 'b', label: 'git log --oneline' },
            { id: 'c', label: 'git push --all' },
            { id: 'd', label: 'git branch' },
          ]}
          answer="b"
          explanation="git log --oneline muestra el hash corto y el mensaje de cada commit. status es el presente; log es el pasado."
        />

        <TrueFalse
          id="git-sin-internet"
          index={17}
          title="Git sin conexión"
          statement="Puedes hacer commits sin internet."
          answer={true}
          explanation="Verdadero. commit escribe en tu computador. Lo que necesita internet es push y pull, que hablan con GitHub."
        />

        <Quiz
          id="portafolio"
          index={18}
          title="Por qué esto importa fuera de clase"
          prompt="¿Por qué insisten tanto en el repositorio y en los mensajes de commit?"
          options={[
            { id: 'a', label: 'Porque es un requisito de la nota y ya' },
            {
              id: 'b',
              label: 'Porque tu GitHub es el portafolio que revisan los empleadores antes de una entrevista',
            },
            { id: 'c', label: 'Porque GitHub paga por tener repositorios' },
            { id: 'd', label: 'Porque sin eso el código no funciona' },
          ]}
          answer="b"
          explanation="Un historial limpio muestra cómo trabajas: si avanzas por partes, si documentas, si te entiendes con un equipo. Es lo primero que mira alguien que va a contratarte."
        />

        <MultiSelect
          id="errores-git"
          index={19}
          title="Errores del primer día"
          prompt="Marca los problemas que se resuelven revisando en qué carpeta estás parado."
          options={[
            { id: 'notrepo', label: 'fatal: not a git repository' },
            { id: 'nada', label: 'git status no muestra los archivos que acabas de crear' },
            { id: 'perm', label: 'Permission denied al hacer push' },
            { id: 'nocmd', label: 'git no se reconoce como comando' },
          ]}
          answers={['notrepo', 'nada']}
          explanation="Los dos primeros son de ubicación: estás fuera de la carpeta del proyecto. «Permission denied» es de credenciales y «no se reconoce» es que Git no está instalado o falta reiniciar la terminal."
        />
      </Exercises>
    </TopicPage>
  );
}
