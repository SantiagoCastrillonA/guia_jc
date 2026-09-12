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

## Versión

`package.json` (raíz) y `server/package.json` llevan la misma versión — front
y back se despliegan juntos, así que son una sola versión de "la app", no dos.
Se lee en tiempo real en el pie del sitio y en `GET /api/health`; sirve para
confirmar qué build quedó arriba después de un autodeploy.

Se sube **al mezclar a `main`**, no en cada commit de `dev`. Mirando los
commits que se van a mezclar:

- Solo `fix:` → sube el parche (`1.0.0` → `1.0.1`).
- Hay algún `feat:` → sube el minor (`1.0.1` → `1.1.0`), el parche vuelve a 0.
- Cambia algo que rompe lo que ya hay (URL de tema, forma de un dato en el
  servidor, variable de entorno) → sube el major (`1.1.0` → `2.0.0`).

```bash
# en dev, antes del merge — cambiar el número a mano en los dos package.json
git add package.json server/package.json
git commit -m "chore: version 1.1.0"
git checkout main && git merge dev && git push origin main
git tag v1.1.0 && git push origin v1.1.0
```
