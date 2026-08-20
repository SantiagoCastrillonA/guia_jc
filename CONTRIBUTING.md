# Cómo trabajar en este repositorio

## Ramas

| Rama | Para qué |
| --- | --- |
| `main` | Lo que está publicado. **Cada push despliega en producción en unos 15 segundos.** |
| `dev` | Donde se trabaja. No despliega nada. |
| `feature/<nombre>` | Opcional, para cambios grandes o para varias personas a la vez. |

## Flujo normal

```bash
git checkout dev
git pull origin dev

# ...trabajas...
git add .
git commit -m "feat: agrego lo que sea"
git push origin dev
```

Cuando lo de `dev` esté probado y quieras publicarlo:

```bash
git checkout main
git pull origin main
git merge dev
git push origin main        # esto despliega
```

## Antes de mezclar a main

```bash
npm run build   # typecheck + build; si falla, no se sube
npm run lint
```

Un push a `main` sale al aire de inmediato, sin revisión previa: por eso el
build se corre antes y no después.

## Trabajando con más gente

- Una rama por funcionalidad, salida de `dev`.
- Commits pequeños y `git pull origin dev` al empezar el día.
- Pull request de la rama hacia `dev`; de `dev` a `main` solo cuando esté probado.
- En GitHub → Settings → Branches conviene proteger `main`: exigir pull request
  y prohibir el push directo. Eso lo activas tú desde la interfaz.

## Convención de mensajes

`feat:` algo nuevo · `fix:` corregir · `docs:` documentación · `style:` visual ·
`refactor:` reorganizar sin cambiar el comportamiento.
