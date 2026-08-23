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

const SLUG = 'proyecto-inicio';

/** Sesión 22 del cronograma — arranque del proyecto integrador. */
export default function ProyectoInicio() {
  return (
    <TopicPage slug={SLUG}>
      <Lesson title="1. Qué se entrega al final">
        <p>
          «Mi emprendimiento digital»: una aplicación full stack funcionando y publicada en
          internet. Estas son las piezas que se evalúan:
        </p>
        <RefTable
          cabeceras={['Pieza', 'Qué significa']}
          filas={[
            ['Página de inicio con marca propia', 'Nombre, colores y tipografía de tu negocio'],
            ['Catálogo de productos o servicios', 'Datos que vienen de tu base de datos, no escritos a mano'],
            ['Formulario de contacto real', 'Que guarda o envía de verdad'],
            ['Panel de administrador con login', 'Solo tú puedes gestionar el contenido'],
            ['Una funcionalidad con IA', 'El asistente de la sesión 21 o algo equivalente'],
            ['Código limpio y organizado', 'Carpetas claras, nombres con sentido, sin código muerto'],
            ['UX profesional en móvil y escritorio', 'Se usa cómodo en el teléfono, no solo se ve'],
          ]}
        />
      </Lesson>

      <Lesson title="2. Alcance: la decisión que salva el proyecto">
        <p>
          El error más común no es técnico: es prometer demasiado. Tres semanas se van rápido, y una
          app pequeña terminada vale mucho más que una grande a medias.
        </p>
        <Compare
          bien={{
            titulo: 'Alcance sano',
            items: [
              'Una funcionalidad principal, bien hecha',
              'Todo lo mínimo funciona de punta a punta',
              'Las ideas extra quedan anotadas como «después»',
              'Se puede demostrar en cinco minutos',
            ],
          }}
          mal={{
            titulo: 'Alcance que hunde',
            items: [
              'Pasarela de pagos, chat en vivo y app móvil',
              'Cinco pantallas a medio hacer',
              'Nada se puede mostrar completo',
              'La demo se cae en la presentación',
            ],
          }}
        />
        <Callout>
          Criterio para decidir: <strong>si lo quitas, ¿el proyecto deja de tener sentido?</strong>{' '}
          Si la respuesta es no, va a la lista de después.
        </Callout>
      </Lesson>

      <Lesson title="3. Planear en cuatro pasos">
        <Steps>
          <Step title="Escribe qué hace tu app en una frase">
            «Una tienda donde mis clientes ven el catálogo de café y me piden un domicilio.» Si
            necesitas un párrafo, el alcance todavía está difuso.
          </Step>
          <Step title="Lista las pantallas">
            Inicio, catálogo, detalle de producto, contacto, login, panel. Cinco o seis: cada
            pantalla es trabajo de frontend, de backend y de pruebas.
          </Step>
          <Step title="Define los datos">
            Qué colecciones necesitas y qué campos tiene cada una. Este paso ahorra días: cambiar el
            modelo cuando ya hay diez pantallas hechas es carísimo.
          </Step>
          <Step title="Lista los endpoints">
            Por cada pantalla, qué le pide a la API. Ahí sale sola la lista de rutas del backend.
          </Step>
        </Steps>

        <Figure
          label="Diagrama: de las pantallas a los datos y a los endpoints"
          caption="Planear es traducir: pantallas → datos → endpoints. Cuando eso está claro, programar es la parte mecánica."
        >
          <svg viewBox="0 0 640 180" xmlns="http://www.w3.org/2000/svg">
            {[
              { t: 'PANTALLAS', items: ['Catálogo', 'Detalle', 'Panel'], x: 0 },
              { t: 'DATOS', items: ['productos', 'pedidos', 'usuarios'], x: 220 },
              { t: 'ENDPOINTS', items: ['GET /productos', 'POST /pedidos', 'POST /auth/login'], x: 430 },
            ].map(({ t, items, x }) => (
              <g key={t}>
                <text x={x} y="14" fontSize="11" letterSpacing="1.2" fill="var(--color-accent-text)">
                  {t}
                </text>
                {items.map((it, i) => (
                  <g key={it}>
                    <rect
                      x={x}
                      y={30 + i * 38}
                      width={x === 430 ? 200 : 170}
                      height="28"
                      rx="5"
                      fill="var(--color-text)"
                      opacity="0.07"
                    />
                    <text
                      x={x + 12}
                      y={48 + i * 38}
                      fontSize="12"
                      fill="var(--color-text)"
                      opacity="0.8"
                      fontFamily={x === 430 ? 'ui-monospace, monospace' : undefined}
                    >
                      {it}
                    </text>
                  </g>
                ))}
              </g>
            ))}
            {[190, 400].map((x) => (
              <g key={x}>
                <line x1={x} y1="82" x2={x + 20} y2="82" stroke="var(--color-accent)" strokeWidth="1.2" />
                <path d={`M${x + 26} 82 l-7 -4 l0 8 z`} fill="var(--color-accent)" />
              </g>
            ))}
          </svg>
        </Figure>
      </Lesson>

      <Lesson title="4. Organiza el repositorio">
        <Terminal
          lineas={[
            'mi-emprendimiento/',
            '├── frontend/          # React',
            '│   ├── src/componentes/',
            '│   ├── src/paginas/',
            '│   └── src/api.js     # todas las llamadas al backend',
            '├── backend/',
            '│   ├── modelos/',
            '│   ├── rutas/',
            '│   ├── middleware/',
            '│   └── servidor.js',
            '├── docs/              # capturas, notas, diagramas',
            '├── .gitignore         # node_modules, .env, dist',
            '└── README.md          # qué es, cómo se corre, URL del demo',
          ]}
        />
        <Callout tipo="ojo">
          Antes del primer commit de esta etapa, verifica el <code>.gitignore</code>. Una clave
          subida por accidente queda en el historial para siempre, aunque borres el archivo después.
        </Callout>
      </Lesson>

      <Lesson title="5. Trabajar en equipo sin chocar">
        <RefTable
          cabeceras={['Práctica', 'Por qué']}
          filas={[
            ['Una rama por funcionalidad', 'Nadie rompe main mientras trabaja'],
            ['Ponerse de acuerdo en los endpoints primero', 'Frontend y backend pueden avanzar en paralelo'],
            ['Commits pequeños y frecuentes', 'Los conflictos son diminutos en vez de gigantes'],
            ['Pull antes de empezar el día', 'Trabajas sobre lo último, no sobre lo de ayer'],
            ['Repartir por pantalla completa', 'Cada quien hace su pantalla entera, del botón a la base'],
          ]}
        />
      </Lesson>

      <Exercises>
        <MultiSelect
          id="que-se-entrega"
          index={1}
          title="El entregable final"
          prompt="Marca lo que debe tener tu proyecto."
          options={[
            { id: 'inicio', label: 'Página de inicio con la marca del negocio' },
            { id: 'catalogo', label: 'Catálogo que viene de la base de datos' },
            { id: 'contacto', label: 'Formulario de contacto que funciona' },
            { id: 'panel', label: 'Panel de administrador con login' },
            { id: 'ia', label: 'Una funcionalidad con IA' },
            { id: 'app', label: 'Una aplicación móvil nativa' },
          ]}
          answers={['inicio', 'catalogo', 'contacto', 'panel', 'ia']}
          explanation="Los cinco primeros. La app nativa no está en el alcance: la web responsive es lo que se entrega."
        />

        <Quiz
          id="alcance"
          index={2}
          title="El error más común"
          prompt="¿Cuál es el mayor riesgo del proyecto final?"
          options={[
            { id: 'a', label: 'Prometer demasiado y llegar con todo a medias' },
            { id: 'b', label: 'Usar una librería equivocada' },
            { id: 'c', label: 'No usar suficiente CSS' },
            { id: 'd', label: 'Hacer pocos commits' },
          ]}
          answer="a"
          explanation="Es un problema de alcance, no de técnica. Una app pequeña terminada se presenta; una grande a medias no se puede ni demostrar."
        />

        <Quiz
          id="criterio-alcance"
          index={3}
          title="¿Entra o no entra?"
          prompt="Dudas si incluir un sistema de cupones de descuento. ¿Cómo decides?"
          options={[
            { id: 'a', label: 'Si lo quitas y el proyecto sigue teniendo sentido, va a la lista de después' },
            { id: 'b', label: 'Si te parece divertido, va' },
            { id: 'c', label: 'Si la IA sabe hacerlo, va' },
            { id: 'd', label: 'Todo lo que se te ocurra debe entrar' },
          ]}
          answer="a"
          explanation="Ese es el filtro. Lo esencial primero; lo demás queda anotado, y si sobra tiempo se agrega — que casi nunca sobra."
        />

        <OrderSteps
          id="orden-planear"
          index={4}
          title="Ordena la planeación"
          steps={[
            { id: 'frase', text: 'Escribir en una frase qué hace la app' },
            { id: 'pantallas', text: 'Listar las pantallas' },
            { id: 'datos', text: 'Definir las colecciones y sus campos' },
            { id: 'endpoints', text: 'Listar los endpoints que necesita cada pantalla' },
            { id: 'repartir', text: 'Repartir el trabajo y crear las ramas' },
          ]}
          explanation="Los datos antes que el código: cambiar el modelo cuando ya hay pantallas hechas obliga a tocar frontend, backend y base."
        />

        <Quiz
          id="modelo-primero"
          index={5}
          title="¿Por qué definir los datos temprano?"
          options={[
            { id: 'a', label: 'Porque cambiar el modelo después obliga a rehacer rutas y pantallas' },
            { id: 'b', label: 'Porque Mongo lo exige' },
            { id: 'c', label: 'Porque así la app carga más rápido' },
            { id: 'd', label: 'No importa, se puede cambiar cuando sea' },
          ]}
          answer="a"
          explanation="Mongo te deja cambiarlo, pero tu código no: cada campo que cambia arrastra rutas, componentes y datos ya guardados."
        />

        <MatchPairs
          id="empareja-pantalla-endpoint"
          index={6}
          title="Empareja la pantalla con lo que necesita"
          pairs={[
            { id: 'catalogo', izquierda: 'Catálogo', derecha: 'GET /productos' },
            { id: 'detalle', izquierda: 'Detalle de producto', derecha: 'GET /productos/:id' },
            { id: 'login', izquierda: 'Inicio de sesión', derecha: 'POST /auth/login' },
            { id: 'panel', izquierda: 'Panel: crear producto', derecha: 'POST /productos' },
            { id: 'contacto', izquierda: 'Formulario de contacto', derecha: 'POST /mensajes' },
          ]}
          explanation="Cada pantalla se traduce en endpoints. Cuando la lista está clara, el backend se programa casi sin pensar."
        />

        <MultiSelect
          id="gitignore-proyecto"
          index={7}
          title="¿Qué va en el .gitignore?"
          options={[
            { id: 'node', label: 'node_modules' },
            { id: 'env', label: '.env' },
            { id: 'dist', label: 'dist / build' },
            { id: 'pem', label: 'Archivos .pem y llaves' },
            { id: 'src', label: 'La carpeta src' },
          ]}
          answers={['node', 'env', 'dist', 'pem']}
          explanation="Lo reconstruible y lo secreto. src es tu código: eso es justo lo que sí debe estar en el repositorio."
        />

        <TrueFalse
          id="secreto-historial"
          index={8}
          title="Un secreto subido"
          statement="Si subes el .env por error, basta con borrarlo en el siguiente commit."
          answer={false}
          explanation="Falso. Queda en el historial y cualquiera puede ver ese commit. Hay que rotar la credencial: cambiarla por una nueva."
        />

        <Quiz
          id="rama-por-funcionalidad"
          index={9}
          title="Trabajo en equipo"
          prompt="Son tres personas trabajando el mismo repo. ¿Cómo evitan pisarse?"
          options={[
            { id: 'a', label: 'Una rama por funcionalidad y merge cuando esté probada' },
            { id: 'b', label: 'Todos en main, avisando por WhatsApp' },
            { id: 'c', label: 'Un repositorio por persona' },
            { id: 'd', label: 'Pasarse los archivos por correo' },
          ]}
          answer="a"
          explanation="Ramas cortas y merges frecuentes. Es lo que practicaste en la sesión 4, ahora en un proyecto de verdad."
        />

        <Quiz
          id="acordar-endpoints"
          index={10}
          title="Frontend y backend en paralelo"
          prompt="¿Qué hay que acordar para que ambos avancen sin esperarse?"
          options={[
            { id: 'a', label: 'La forma exacta de los endpoints: ruta, método y forma del JSON' },
            { id: 'b', label: 'Los colores de la marca' },
            { id: 'c', label: 'Quién usa qué editor' },
            { id: 'd', label: 'El nombre del repositorio' },
          ]}
          answer="a"
          explanation="Con el contrato acordado, el frontend puede trabajar con datos falsos mientras el backend se construye, y al conectarlos encaja."
        />

        <FillBlank
          id="readme-proyecto"
          index={11}
          title="El README del proyecto"
          prompt="Además de qué es y cómo se corre, no puede faltar…"
          code={'# Mi Emprendimiento\n\n## Demo en vivo\n___'}
          options={['La URL pública del proyecto', 'La contraseña del admin', 'La cadena de Mongo', 'El JWT_SECRET']}
          answer="La URL pública del proyecto"
          explanation="La URL es lo primero que busca quien abre tu repositorio. Las credenciales no van ahí nunca."
        />

        <MultiSelect
          id="estructura-repo"
          index={12}
          title="La estructura del repositorio"
          prompt="Marca lo que corresponde."
          options={[
            { id: 'front', label: 'frontend/ con el código de React' },
            { id: 'back', label: 'backend/ con modelos, rutas y middleware' },
            { id: 'docs', label: 'docs/ con capturas y notas' },
            { id: 'readme', label: 'README con la descripción y la URL' },
            { id: 'todo', label: 'Todos los archivos sueltos en la raíz' },
          ]}
          answers={['front', 'back', 'docs', 'readme']}
          explanation="La organización es parte de lo que se evalúa, y sobre todo es lo que te permite encontrar las cosas en la semana tres."
        />

        <Quiz
          id="datos-prueba-proyecto"
          index={13}
          title="Datos de prueba"
          prompt="Todavía no tienes productos reales cargados. ¿Qué haces para avanzar?"
          options={[
            { id: 'a', label: 'Cargar datos ficticios en la base para ver cómo se comporta la interfaz' },
            { id: 'b', label: 'Esperar a tener los reales' },
            { id: 'c', label: 'Escribirlos fijos en el HTML' },
            { id: 'd', label: 'Dejar todo vacío' },
          ]}
          answer="a"
          explanation="Datos ficticios en la base, no en el HTML. Así pruebas el camino completo y de paso descubres cómo se ve con nombres largos o precios raros."
        />

        <TrueFalse
          id="mvp"
          index={14}
          title="Lo mínimo primero"
          statement="Conviene terminar el camino completo con lo mínimo antes de pulir cualquier pantalla."
          answer={true}
          explanation="Verdadero. Un camino completo que funciona se puede mostrar y mejorar. Una pantalla perfecta con el resto sin hacer, no."
        />

        <Quiz
          id="tiempo-realista"
          index={15}
          title="Calcular el tiempo"
          prompt="Crees que una pantalla te toma dos horas. ¿Cuánto conviene reservar?"
          options={[
            { id: 'a', label: 'El doble o más: siempre aparecen imprevistos, pruebas y ajustes' },
            { id: 'b', label: 'Exactamente dos horas' },
            { id: 'c', label: 'Una hora, para exigirse' },
            { id: 'd', label: 'No vale la pena estimar' },
          ]}
          answer="a"
          explanation="Casi todo el mundo subestima. Contar el doble no es pesimismo: es dejar espacio para probar, arreglar y las cosas que no se ven al planear."
        />

        <MultiSelect
          id="riesgos-proyecto"
          index={16}
          title="Riesgos que conviene anticipar"
          options={[
            { id: 'alcance', label: 'Alcance demasiado grande' },
            { id: 'deploy', label: 'Dejar el despliegue para el último día' },
            { id: 'datos', label: 'Cambiar el modelo de datos a mitad de camino' },
            { id: 'equipo', label: 'Que nadie sepa qué está haciendo el otro' },
            { id: 'color', label: 'Elegir un color de marca poco común' },
          ]}
          answers={['alcance', 'deploy', 'datos', 'equipo']}
          explanation="Los cuatro primeros hunden proyectos. El color no: eso se cambia en una variable de CSS."
        />

        <Quiz
          id="desplegar-temprano"
          index={17}
          title="¿Cuándo desplegar?"
          prompt="¿En qué momento conviene publicar por primera vez?"
          options={[
            { id: 'a', label: 'Apenas haya algo mínimo funcionando, para descubrir los problemas temprano' },
            { id: 'b', label: 'El último día, cuando todo esté listo' },
            { id: 'c', label: 'Nunca, con mostrarlo en local basta' },
            { id: 'd', label: 'Solo si sobra tiempo' },
          ]}
          answer="a"
          explanation="Desplegar siempre saca problemas nuevos: rutas, variables de entorno, CORS. Descubrirlos con tiempo es muy distinto a descubrirlos la noche antes."
        />

        <Quiz
          id="una-frase"
          index={18}
          title="La frase del proyecto"
          prompt="¿Cuál describe mejor un alcance claro?"
          options={[
            { id: 'a', label: '«Una tienda donde mis clientes ven el catálogo de café y piden un domicilio»' },
            { id: 'b', label: '«Una plataforma integral de comercio con IA, pagos y logística»' },
            { id: 'c', label: '«Una app de emprendimiento»' },
            { id: 'd', label: '«Un sitio bonito»' },
          ]}
          answer="a"
          explanation="Concreta: se sabe quién la usa, qué ve y qué hace. Las otras tres no permiten saber si el proyecto está terminado o no."
        />

        <OrderSteps
          id="orden-arranque"
          index={19}
          title="Ordena el arranque"
          steps={[
            { id: 'plan', text: 'Definir alcance, pantallas, datos y endpoints' },
            { id: 'repo', text: 'Organizar el repositorio y revisar el .gitignore' },
            { id: 'modelos', text: 'Crear los modelos y las rutas básicas del backend' },
            { id: 'datos', text: 'Cargar datos de prueba' },
            { id: 'front', text: 'Conectar la primera pantalla del frontend' },
            { id: 'deploy', text: 'Desplegar esa versión mínima' },
          ]}
          explanation="Un camino completo, aunque sea flaco, antes de ensanchar cualquier parte."
        />

        <MultiSelect
          id="checklist-semana1"
          index={20}
          title="Al terminar esta sesión deberías tener…"
          options={[
            { id: 'frase', label: 'La frase que describe tu app' },
            { id: 'pantallas', label: 'La lista de pantallas' },
            { id: 'modelo', label: 'Las colecciones con sus campos' },
            { id: 'endpoints', label: 'La lista de endpoints' },
            { id: 'repo', label: 'El repositorio organizado' },
            { id: 'terminado', label: 'El proyecto terminado' },
          ]}
          answers={['frase', 'pantallas', 'modelo', 'endpoints', 'repo']}
          explanation="Hoy es planear y montar el esqueleto. El código pesado viene en las dos sesiones siguientes."
        />
      </Exercises>
    </TopicPage>
  );
}
