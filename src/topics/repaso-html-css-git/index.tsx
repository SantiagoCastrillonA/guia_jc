import { Exercises, Lesson, TopicPage } from '../../components/TopicPage';
import {
  FillBlank,
  MatchPairs,
  MultiSelect,
  OrderSteps,
  Quiz,
  TrueFalse,
} from '../../components/exercises';
import { Callout, Figure, RefTable } from '../../components/visuals';

const SLUG = 'repaso-html-css-git';

/** Sesión 8 del cronograma — repaso de los módulos 1 y 2. */
export default function RepasoHtmlCssGit() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Dónde estás parado">
        <p>
          Cierras el segundo módulo. Tienes un sitio publicado en internet, con estructura
          semántica, estilos propios e historial en GitHub. Antes de entrar a JavaScript, vale la
          pena mirar el mapa completo: cada pieza va a volver, y en la próxima sesión el sitio
          empieza a moverse.
        </p>

        <Figure
          label="Diagrama: el camino recorrido en las siete sesiones"
          caption="Siete sesiones, cuatro capas. JavaScript llega la próxima clase y hace que todo esto responda al usuario."
        >
          <svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg">
            {[
              { t: 'IA', s: 'Prompts con rol, contexto y formato', n: 'S1', y: 0 },
              { t: 'Lógica', s: 'Secuencia, variable, condicional, bucle', n: 'S2 · S3', y: 58 },
              { t: 'Git', s: 'add, commit, push, ramas', n: 'S4', y: 116 },
              { t: 'Web', s: 'HTML semántico, CSS, deploy', n: 'S5 · S6 · S7', y: 174 },
            ].map(({ t, s, n, y }) => (
              <g key={t}>
                <rect x="0" y={y} width="640" height="46" rx="8" fill="var(--color-text)" opacity="0.05" />
                <rect x="0" y={y} width="3" height="46" rx="1.5" fill="var(--color-accent)" />
                <text x="20" y={y + 28} fontSize="16" fill="var(--color-text)">
                  {t}
                </text>
                <text x="120" y={y + 28} fontSize="13" fill="var(--color-text)" opacity="0.65">
                  {s}
                </text>
                <text
                  x="620"
                  y={y + 28}
                  fontSize="12"
                  fill="var(--color-accent)"
                  textAnchor="end"
                  fontFamily="ui-monospace, monospace"
                >
                  {n}
                </text>
              </g>
            ))}
            <text x="0" y="242" fontSize="12" fill="var(--color-text)" opacity="0.5">
              próxima capa → JavaScript: la página empieza a responder
            </text>
          </svg>
        </Figure>
      </Lesson>

      <Lesson title="2. Las ideas que más se olvidan">
        <RefTable
          cabeceras={['Idea', 'La confusión típica', 'La verdad']}
          filas={[
            [
              'HTML contra CSS',
              'Elegir h1 o h3 por el tamaño de letra',
              'La etiqueta dice qué es; CSS dice cómo se ve',
            ],
            [
              'Box model',
              'width: 200px y la caja mide 250',
              'El padding y el borde se suman, salvo con box-sizing: border-box',
            ],
            [
              'Flexbox',
              'justify-content no centra verticalmente',
              'justify-content es el eje principal; align-items el cruzado',
            ],
            [
              'Git',
              'Creer que git add ya guardó',
              'add prepara, commit guarda, push publica',
            ],
            [
              'Deploy',
              'Se ve en local y roto en internet',
              'Rutas relativas y nombres exactos en minúscula',
            ],
            [
              'IA',
              'Copiar la respuesta sin leerla',
              'Copiloto: acelera, pero tú revisas y respondes',
            ],
          ]}
        />
        <Callout>
          Si un tema de esta tabla te suena nuevo, vuelve a su sesión antes de seguir. JavaScript se
          apoya en todo esto: el DOM que vas a manipular es el HTML que escribiste, y los cambios
          que vas a programar son las clases de CSS que ya definiste.
        </Callout>
      </Lesson>

      <Exercises>
        <Quiz
          id="repaso-etiqueta"
          index={1}
          title="Repaso · La etiqueta correcta"
          prompt="Una tarjeta de producto con su imagen, su nombre y su precio, dentro de la sección de catálogo."
          options={[
            { id: 'div', label: '<div>' },
            { id: 'article', label: '<article>' },
            { id: 'section', label: 'Otra <section> anidada' },
            { id: 'p', label: '<p>' },
          ]}
          answer="article"
          explanation="Un article es contenido que se entiende solo, aunque lo saques de la página. Una tarjeta de producto cumple exactamente esa prueba."
        />

        <TrueFalse
          id="repaso-h1"
          index={2}
          title="Repaso · Los títulos"
          statement="Puedes usar tres <h1> si tu página tiene tres secciones importantes."
          answer={false}
          explanation="Falso. Una h1 por página; las secciones van en h2. Los títulos son el índice de la página, y un índice con tres títulos principales no es un índice."
        />

        <FillBlank
          id="repaso-box-sizing"
          index={3}
          title="Repaso · El reset de CSS"
          code={'*, *::before, *::after {\n  box-sizing: ___;\n}'}
          options={['border-box', 'content-box', 'flex', 'inherit']}
          answer="border-box"
          explanation="Con border-box, el padding y el borde caben dentro del width que declaraste. Sin eso, todo cálculo de ancho se vuelve una suma sorpresa."
        />

        <Quiz
          id="repaso-flex-eje"
          index={4}
          title="Repaso · Los ejes de Flexbox"
          prompt="display: flex con flex-direction: row. Quieres los elementos pegados al fondo del contenedor."
          options={[
            { id: 'justify', label: 'justify-content: flex-end' },
            { id: 'align', label: 'align-items: flex-end' },
            { id: 'text', label: 'vertical-align: bottom' },
            { id: 'margin', label: 'margin-top: 100%' },
          ]}
          answer="align"
          explanation="En fila, «abajo» es el eje cruzado: align-items. justify-content los mandaría a la derecha."
        />

        <MatchPairs
          id="repaso-comandos"
          index={5}
          title="Repaso · Git de memoria"
          pairs={[
            { id: 'add', izquierda: <code>git add .</code>, derecha: 'Preparar los cambios' },
            { id: 'commit', izquierda: <code>git commit -m</code>, derecha: 'Guardar un punto con mensaje' },
            { id: 'push', izquierda: <code>git push</code>, derecha: 'Publicar en GitHub' },
            { id: 'pull', izquierda: <code>git pull</code>, derecha: 'Traer lo que hicieron los demás' },
            { id: 'branch', izquierda: <code>git checkout -b</code>, derecha: 'Crear una rama y cambiarse a ella' },
          ]}
          explanation="Cinco comandos que vas a escribir todas las semanas hasta el final del curso."
        />

        <Quiz
          id="repaso-deploy-roto"
          index={6}
          title="Repaso · Se rompió al publicar"
          prompt="La imagen se veía en local y en internet no aparece. ¿Cuáles son las dos causas más probables?"
          options={[
            { id: 'a', label: 'La ruta empieza con / o el nombre tiene mayúsculas distintas' },
            { id: 'b', label: 'La imagen pesa mucho' },
            { id: 'c', label: 'El navegador del visitante es viejo' },
            { id: 'd', label: 'Falta una media query' },
          ]}
          answer="a"
          explanation="Barra inicial y mayúsculas. Windows te perdona las dos cosas; el servidor Linux no perdona ninguna."
        />

        <TrueFalse
          id="repaso-prompt"
          index={7}
          title="Repaso · Prompts"
          statement="Un prompt con rol, contexto y formato da mejores resultados que uno vago."
          answer={true}
          explanation="Verdadero. Entre más contexto le des, menos tiene que adivinar, y menos genérica sale la respuesta."
        />

        <Quiz
          id="repaso-variable"
          index={8}
          title="Repaso · Lógica"
          prompt="Un contador de puntos que siempre marca 1. ¿Qué pasó?"
          options={[
            { id: 'a', label: 'Se usó «fijar puntos a 1» donde iba «cambiar puntos por 1»' },
            { id: 'b', label: 'La variable no existe' },
            { id: 'c', label: 'Falta un bucle' },
            { id: 'd', label: 'El sprite es muy pequeño' },
          ]}
          answer="a"
          explanation="Fijar reemplaza, cambiar suma. En JavaScript es la misma diferencia entre puntos = 1 y puntos = puntos + 1."
        />

        <MultiSelect
          id="repaso-head"
          index={9}
          title="Repaso · El head"
          prompt="Marca lo que debe estar en el head de tu index.html."
          options={[
            { id: 'charset', label: '<meta charset="UTF-8">' },
            { id: 'viewport', label: '<meta name="viewport" content="width=device-width, initial-scale=1.0">' },
            { id: 'title', label: '<title> con el nombre del negocio' },
            { id: 'css', label: '<link rel="stylesheet" href="styles.css">' },
            { id: 'footer', label: 'El <footer> con el copyright' },
          ]}
          answers={['charset', 'viewport', 'title', 'css']}
          explanation="El footer se ve, así que va en el body. Los otros cuatro son la base de cualquier página: sin el viewport el responsive no funciona en el celular."
        />

        <Quiz
          id="repaso-especificidad"
          index={10}
          title="Repaso · ¿Cuál regla gana?"
          code={'.boton { color: azul; }\n#enviar { color: verde; }\nbutton { color: gris; }'}
          numbered
          prompt="El botón tiene id='enviar' y class='boton'. ¿De qué color queda?"
          options={[
            { id: 'azul', label: 'Azul' },
            { id: 'verde', label: 'Verde' },
            { id: 'gris', label: 'Gris' },
            { id: 'ultimo', label: 'Gris, porque está de último' },
          ]}
          answer="verde"
          explanation="El id gana: es el selector más específico. El orden solo decide entre selectores de la misma especificidad."
        />

        <OrderSteps
          id="repaso-flujo-completo"
          index={11}
          title="Repaso · De la idea al sitio publicado"
          prompt="El recorrido de las siete sesiones, en orden."
          steps={[
            { id: 'idea', text: 'Definir el negocio y generar la marca con IA' },
            { id: 'repo', text: 'Crear el repositorio y el README' },
            { id: 'html', text: 'Escribir el index.html con estructura semántica' },
            { id: 'css', text: 'Darle identidad con styles.css' },
            { id: 'audit', text: 'Auditar rutas y consola antes de publicar' },
            { id: 'deploy', text: 'Publicar y documentar la URL en el README' },
          ]}
          explanation="Ese es el camino completo del módulo. De aquí en adelante todo se construye encima: JavaScript, backend y React entran sobre esta misma base."
        />

        <TrueFalse
          id="repaso-css-html"
          index={12}
          title="Repaso · Separación de responsabilidades"
          statement="Los colores y los tamaños pueden ir directamente en el HTML si es más rápido."
          answer={false}
          explanation="Falso. Mezclarlos funciona hoy y estorba mañana: cambiar el color de marca te obligaría a editar cada archivo. HTML dice qué es; CSS dice cómo se ve."
        />

        <FillBlank
          id="repaso-grid"
          index={13}
          title="Repaso · El catálogo"
          prompt="Tantas columnas como quepan, mínimo 280px cada una."
          code={'.catalogo {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, ___(280px, 1fr));\n}'}
          options={['minmax', 'clamp', 'calc', 'range']}
          answer="minmax"
          explanation="minmax(mínimo, máximo) le pone piso y techo a cada columna. Con 1fr como máximo, se reparten el espacio sobrante por igual."
        />

        <Quiz
          id="repaso-conflicto"
          index={14}
          title="Repaso · Conflicto de merge"
          prompt="Al hacer git pull aparecen unas líneas con <<<<<<< en tu archivo. ¿Qué significa?"
          options={[
            { id: 'a', label: 'Se dañó el archivo y hay que borrarlo' },
            { id: 'b', label: 'Dos personas cambiaron las mismas líneas y tienes que elegir qué queda' },
            { id: 'c', label: 'Se perdió tu trabajo' },
            { id: 'd', label: 'Hay que reinstalar Git' },
          ]}
          answer="b"
          explanation="Git te muestra las dos versiones y te deja decidir. Eliges, borras las marcas y haces un commit. No se perdió nada."
        />

        <MultiSelect
          id="repaso-accesibilidad"
          index={15}
          title="Repaso · Accesibilidad"
          prompt="Marca lo que hace tu página más accesible."
          options={[
            { id: 'alt', label: 'alt descriptivo en cada imagen' },
            { id: 'lang', label: 'lang="es" en la etiqueta html' },
            { id: 'jerarquia', label: 'Jerarquía de títulos sin saltos' },
            { id: 'semantica', label: 'Etiquetas semánticas en vez de divs para todo' },
            { id: 'colores', label: 'Usar muchos colores distintos' },
          ]}
          answers={['alt', 'lang', 'jerarquia', 'semantica']}
          explanation="Los cuatro primeros. Y de paso son lo mismo que ayuda al buscador: accesibilidad y SEO se pagan con la misma moneda."
        />

        <Quiz
          id="repaso-mobile-first"
          index={16}
          title="Repaso · Responsive"
          prompt="Escribes CSS mobile-first. ¿Qué media query usas para pantallas grandes?"
          options={[
            { id: 'min', label: '@media (min-width: 768px)' },
            { id: 'max', label: '@media (max-width: 768px)' },
            { id: 'device', label: '@media (device: desktop)' },
            { id: 'screen', label: '@media screen' },
          ]}
          answer="min"
          explanation="Mobile-first suma reglas hacia arriba con min-width. El estilo base sirve para el celular y las pantallas grandes reciben los ajustes."
        />

        <TrueFalse
          id="repaso-ia-verificar"
          index={17}
          title="Repaso · IA responsable"
          statement="Si la IA te da código y funciona, no hace falta entenderlo."
          answer={false}
          explanation="Falso. Cuando falle vas a tener que arreglarlo, y en la defensa del proyecto te van a preguntar cómo funciona. Usa la IA para entender más rápido, no para saltarte el entender."
        />

        <Quiz
          id="repaso-consola"
          index={18}
          title="Repaso · La consola"
          prompt="¿Qué tecla abre las herramientas de desarrollo del navegador?"
          options={[
            { id: 'f12', label: 'F12' },
            { id: 'f5', label: 'F5' },
            { id: 'esc', label: 'Esc' },
            { id: 'ctrls', label: 'Ctrl + S' },
          ]}
          answer="f12"
          explanation="F12 abre DevTools: consola, red, elementos y modo dispositivo. Es la herramienta que más vas a usar de aquí en adelante."
        />

        <Quiz
          id="repaso-que-sigue"
          index={19}
          title="Lo que viene"
          prompt="En la próxima sesión empieza JavaScript. ¿Qué va a cambiar en tu sitio?"
          options={[
            { id: 'a', label: 'Va a poder responder al usuario: reaccionar a clics, cambiar contenido y validar formularios' },
            { id: 'b', label: 'Va a verse más bonito' },
            { id: 'c', label: 'Va a cargar más rápido' },
            { id: 'd', label: 'Va a dejar de necesitar HTML' },
          ]}
          answer="a"
          explanation="HTML es la estructura, CSS la apariencia y JavaScript el comportamiento. La página deja de ser un afiche y se convierte en algo con lo que se interactúa."
        />

        <MultiSelect
          id="repaso-listo-modulo"
          index={20}
          title="¿Estás listo para el módulo 3?"
          prompt="Marca lo que ya deberías tener hecho."
          options={[
            { id: 'repo', label: 'Repositorio en GitHub con README' },
            { id: 'html', label: 'index.html con estructura semántica' },
            { id: 'css', label: 'styles.css con los colores de tu marca' },
            { id: 'url', label: 'El sitio publicado en una URL pública' },
            { id: 'commits', label: 'Varios commits con mensajes descriptivos' },
            { id: 'bd', label: 'Una base de datos configurada' },
          ]}
          answers={['repo', 'html', 'css', 'url', 'commits']}
          explanation="Todo menos la base de datos: eso llega en el módulo 4. Si te falta alguno de los otros cinco, esta semana es el momento de ponerse al día."
        />
      </Exercises>
    </TopicPage>
  );
}
