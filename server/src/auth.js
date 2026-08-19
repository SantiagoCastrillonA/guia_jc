import jwt from 'jsonwebtoken';
import { User } from './models.js';

const COOKIE = 'jc_session';
const MAX_AGE_DAYS = 7;

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) {
    throw new Error('JWT_SECRET falta o es demasiado corto (mínimo 32 caracteres).');
  }
  return value;
}

export function issueSession(res, user) {
  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, secret(), {
    expiresIn: `${MAX_AGE_DAYS}d`,
  });
  res.cookie(COOKIE, token, {
    httpOnly: true, // el JavaScript de la página no puede leerla
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true', // ponerlo en true cuando haya HTTPS
    maxAge: MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearSession(res) {
  res.clearCookie(COOKIE, { path: '/' });
}

/** Deja `req.user` cuando la cookie es válida. Nunca falla: solo no autentica. */
export async function loadUser(req, _res, next) {
  const token = req.cookies?.[COOKIE];
  if (!token) return next();
  try {
    const payload = jwt.verify(token, secret());
    const user = await User.findById(payload.sub);
    if (user && user.active) req.user = user;
  } catch {
    // token vencido o manipulado: se sigue como anónimo
  }
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Necesitas iniciar sesión.' });
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Necesitas iniciar sesión.' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Solo para administradores.' });
  next();
}
