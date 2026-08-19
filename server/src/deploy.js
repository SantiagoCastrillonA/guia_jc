import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { Router } from 'express';

/**
 * Autodeploy: GitHub avisa de cada push a main y el servidor se actualiza solo.
 *
 * La única credencial es el secreto compartido del webhook (DEPLOY_SECRET en
 * .env, el mismo que se configura en GitHub). No se abre ningún puerto nuevo:
 * la petición entra por el 80 que ya sirve el sitio.
 *
 * El trabajo pesado lo hace /usr/local/bin/guia-jc-redeploy, lanzado con
 * systemd-run para que quede fuera del cgroup de este servicio: si corriera
 * como hijo, el `systemctl restart` del final se mataría a sí mismo.
 */
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

  const child = spawn(
    'sudo',
    [
      '/usr/bin/systemd-run',
      '--unit=guia-jc-deploy',
      '--collect',
      '/usr/local/bin/guia-jc-redeploy',
    ],
    { detached: true, stdio: 'ignore' },
  );
  child.unref();

  // 202: se aceptó el aviso; el despliegue sigue en segundo plano.
  res.status(202).json({ ok: true, mensaje: 'Despliegue lanzado.' });
});
