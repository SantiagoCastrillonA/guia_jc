# Guía Jóvenes creaTIvos

Ejercicios interactivos para el curso de Desarrollo Web de Jóvenes creaTIvos
(25 sesiones). React + TypeScript + Vite, con el sistema de diseño **Nocturne**
(proyecto de Claude Design) como base visual.

**En producción: https://3-141-72-146.nip.io** — cada push a `main` se despliega
solo (ver [deploy/README.md](deploy/README.md)). Se trabaja en la rama `dev`:
ver [CONTRIBUTING.md](CONTRIBUTING.md).

Las **25 sesiones** del cronograma están publicadas, con explicación paso a paso,
diagramas y demos interactivas, y entre 18 y 20 ejercicios cada una (491 en
total). El registro vive en `src/data/topics.ts`: una sesión sin página
aparecería en la home como "Próximamente" y no generaría ruta.

```bash
npm run dev      # servidor de desarrollo
npm run build    # typecheck + build de producción
npm run lint     # oxlint
```

## Cómo se organiza

```
src/
  data/topics.ts          registro central de temas (única fuente de verdad)
  router.tsx              rutas derivadas del registro
  pages/Home.tsx          bienvenida + banda de cifras + grilla de temas
  topics/<slug>/index.tsx una subpágina por tema
  components/
    TopicPage.tsx         marco común de un tema: hero, progreso, contexto
    TopicCard.tsx         tarjeta del tema en la home
    exercises/            primitivas de ejercicio reutilizables
    visuals/              figuras, pasos, notas, comparaciones y terminales
  lib/progress.tsx        progreso por ejercicio (servidor con sesión, localStorage sin ella)
  lib/auth.tsx            sesión del usuario
server/                   API de Express: cuentas, progreso y panel de admin
  styles/nocturne.css     tokens y componentes del sistema de diseño
  styles/layout.css       ritmo de página, fondo iluminado, tokens de motion
```

## Publicar un tema

1. Crear `src/topics/<slug>/index.tsx`:

```tsx
import { Exercises, Lesson, TopicPage } from '../../components/TopicPage';
import { Quiz } from '../../components/exercises';

export default function MiTema() {
  return (
    <TopicPage slug="mi-tema">
      <Lesson title="Qué vamos a ver">
        <p>Explicación corta.</p>
      </Lesson>

      <Exercises>
        <Quiz
          id="ej-1"
          index={1}
          title="Título del ejercicio"
          code={'print("hola")'}
          options={[{ id: 'a', label: 'hola' }, { id: 'b', label: 'error' }]}
          answer="a"
          explanation="Por qué es esa."
        />
      </Exercises>
    </TopicPage>
  );
}
```

2. Actualizar su entrada en `src/data/topics.ts`:

```ts
{
  slug: 'mi-tema',
  session: 10,                  // número de sesión del cronograma
  module: 'JavaScript',         // uno de los módulos de src/types.ts
  title: 'Mi tema',
  summary: 'Una o dos frases.',
  level: 'inicial',
  exercises: 5,                 // debe coincidir con la cantidad real
  published: true,              // false = tarjeta "Próximamente", sin ruta
  Page: lazy(() => import('../topics/mi-tema')),
}
```

La ruta (`/tema/mi-tema`), la tarjeta en su módulo, el contador de ejercicios y
las barras de progreso salen de ese registro. No hay nada más que tocar.

## Primitivas de ejercicio

| Componente | Para qué sirve |
| --- | --- |
| `Quiz` | Opción múltiple con explicación y pista. Corrige al instante. |
| `PredictOutput` | "¿Qué imprime este código?" — respuesta escrita, comparada sin distinguir mayúsculas ni espacios de más. |
| `OrderSteps` | Ordenar líneas o pasos. Las filas se mueven con transición de layout. |
| `TrueFalse` | Una afirmación y dos botones. El más rápido de responder. |
| `MultiSelect` | "Marca todas las que apliquen": corrige al comprobar. |
| `FillBlank` | Un hueco en el código y fichas para llenarlo. |
| `MatchPairs` | Emparejar término y definición tocando cada columna. |
| `CodeBlock` | Bloque de código, con numeración opcional. |
| `ExerciseShell` / `Feedback` | Base para armar un tipo de ejercicio nuevo. |

## Material gráfico (`components/visuals`)

| Componente | Para qué sirve |
| --- | --- |
| `Figure` | Marco de una ilustración SVG con su descripción. Entra al hacer scroll. |
| `Steps` / `Step` | Procedimiento paso a paso, numerado y unido por una línea de acento. |
| `Callout` | Una idea para recordar (`idea`) o una advertencia (`ojo`). |
| `Compare` | Dos columnas: lo que se hace y lo que no. |
| `RefTable` | Tabla de referencia rápida. |
| `Terminal` | Bloque de comandos o de archivo, con prompt y comentarios resaltados. |

Las demos interactivas propias de un tema viven en su carpeta —por ejemplo
`topics/css-box-model-flexbox/Demos.tsx` (box model y Flexbox manipulables) y
`topics/react-componentes-props-state/Demos.tsx` (props y estado en vivo).

Cada ejercicio necesita un `id` único **dentro de su tema**: es la clave con la
que se guarda el progreso.

## Reglas de diseño y movimiento

- Todo color, tipografía, radio y sombra sale de las variables de
  `styles/nocturne.css`. No se escriben hex ni px sueltos.
- El acento (`#9184d9`) se usa como línea y como brillo, nunca como relleno
  grande. La única superficie saturada es la banda de cifras de la home.
- Colores de apoyo en `styles/layout.css`: `--color-tech` (cian, para datos y
  progreso) y `--color-ok` / `--color-off` (estado encendido o apagado).
- Curvas y duraciones salen de `lib/motion.ts` y de los tokens `--ease-*` /
  `--dur-*`. Nada de UI por encima de 300 ms.
- Toda animación respeta `prefers-reduced-motion`, y los efectos de `:hover`
  están limitados a punteros finos.
