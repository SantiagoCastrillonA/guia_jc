import crypto from 'node:crypto';
import fs from 'node:fs';
import { Router } from 'express';

/**
 * Autodeploy: GitHub avisa de cada push a main y el servidor se actualiza solo.
 *
 * La única credencial es el secreto compartido del webhook (DEPLOY_SECRET en
 * .env, el mismo que se configura en GitHub). No se abre ningún puerto nuevo:
 * la petición entra por el 80 que ya sirve el sitio.
 *
 * Este proceso no despliega ni escala privilegios: solo deja una señal en
 * disco. Una `systemd.path` la ve y arranca guia-jc-deploy.service como root,
 * en su propio cgroup — así el `systemctl restart` del final no se mata a sí
 * mismo, y el API puede seguir con NoNewPrivileges=true (sin sudo, que es
 * justo lo que esa opción bloquea).
 */

const SIGNAL = process.env.DEPLOY_SIGNAL ?? '/run/guia-jc/deploy.request';
export const deployRouter = Router();

/** Compara en tiempo constante, tolerando longitudes distintas. */
function signatureMatches(received, expected) {
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

deployRouter.post('/deploy', (req, res) => {
  const secret = process.env.DEPLOY_SECRET;
  if (!secret) {
    return res.status(503).json({ error: 'El autodeploy no está configurado.' });
  }

  const received = req.get('X-Hub-Signature-256');
  if (!received || !req.rawBody) {
    return res.status(401).json({ error: 'Falta la firma.' });
  }

  const expected =
    'sha256=' + crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex');
  if (!signatureMatches(received, expected)) {
    return res.status(401).json({ error: 'Firma inválida.' });
  }

  // GitHub manda un ping al crear el webhook.
  if (req.get('X-GitHub-Event') === 'ping') {
    return res.json({ pong: true });
  }

  // Solo main despliega; ramas y tags se ignoran.
  const ref = req.body?.ref;
  if (ref && ref !== 'refs/heads/main') {
    return res.json({ skipped: `ignorado: ${ref}` });
  }

  try {
    fs.writeFileSync(SIGNAL, `${new Date().toISOString()}\n`);
  } catch (err) {
    console.error('No se pudo señalar el despliegue:', err);
    return res.status(500).json({ error: 'No se pudo lanzar el despliegue.' });
  }

  // 202: se aceptó el aviso; el despliegue sigue en segundo plano.
  res.status(202).json({ ok: true, mensaje: 'Despliegue lanzado.' });
});
