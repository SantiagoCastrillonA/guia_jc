import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { Progress, TopicSetting, User } from './models.js';
import { clearSession, issueSession, requireAdmin, requireAuth } from './auth.js';

const BCRYPT_ROUNDS = 12;

/** Intentos de inicio de sesión y registro: 20 por IP cada 15 minutos. */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera unos minutos.' },
});

const credentials = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'El usuario necesita al menos 3 caracteres.')
    .max(32)
    .regex(/^[a-z0-9._-]+$/, 'Solo letras, números, punto, guion y guion bajo.'),
  password: z.string().min(8, 'La contraseña necesita al menos 8 caracteres.').max(200),
});

const registration = credentials.extend({
  name: z.string().trim().min(2, 'Escribe tu nombre.').max(80),
});

/** Devuelve los datos de zod como un error legible, o null si todo va bien. */
function parse(schema, body, res) {
  const result = schema.safeParse(body);
  if (result.success) return result.data;
  res.status(400).json({ error: result.error.issues[0]?.message ?? 'Datos inválidos.' });
  return null;
}

export const router = Router();

// ── sesión ────────────────────────────────────────────────────────────────

router.post('/auth/register', authLimiter, async (req, res) => {
  if (process.env.ALLOW_REGISTRATION === 'false') {
    return res.status(403).json({ error: 'El registro está cerrado. Pídele una cuenta a tu profe.' });
  }
  const data = parse(registration, req.body, res);
  if (!data) return;

  if (await User.exists({ username: data.username })) {
    return res.status(409).json({ error: 'Ese usuario ya existe.' });
  }

  // La primera cuenta de la instalación es la del profesor.
  const isFirst = (await User.estimatedDocumentCount()) === 0;

  const user = await User.create({
    username: data.username,
    name: data.name,
    passwordHash: await bcrypt.hash(data.password, BCRYPT_ROUNDS),
    role: isFirst ? 'admin' : 'student',
  });

  issueSession(res, user);
  res.status(201).json({ user: user.toPublic() });
});

router.post('/auth/login', authLimiter, async (req, res) => {
  const data = parse(credentials, req.body, res);
  if (!data) return;

  const user = await User.findOne({ username: data.username }).select('+passwordHash');
  // Mismo mensaje para usuario inexistente y contraseña errada: no se filtra
  // qué usuarios existen.
  const ok = user && (await bcrypt.compare(data.password, user.passwordHash));
  if (!ok) return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
  if (!user.active) return res.status(403).json({ error: 'Tu cuenta está desactivada.' });

  user.lastLoginAt = new Date();
  await user.save();

  issueSession(res, user);
  res.json({ user: user.toPublic() });
});

router.post('/auth/logout', (_req, res) => {
  clearSession(res);
  res.status(204).end();
});

router.get('/auth/me', (req, res) => {
  res.json({ user: req.user ? req.user.toPublic() : null });
});

router.post('/auth/password', requireAuth, async (req, res) => {
  const schema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, 'La contraseña nueva necesita al menos 8 caracteres.').max(200),
  });
  const data = parse(schema, req.body, res);
  if (!data) return;

  const user = await User.findById(req.user._id).select('+passwordHash');
  if (!(await bcrypt.compare(data.currentPassword, user.passwordHash))) {
    return res.status(401).json({ error: 'La contraseña actual no coincide.' });
  }
  user.passwordHash = await bcrypt.hash(data.newPassword, BCRYPT_ROUNDS);
  await user.save();
  res.status(204).end();
});

// ── progreso del estudiante ───────────────────────────────────────────────

router.get('/progress', requireAuth, async (req, res) => {
  const progress = await Progress.findOne({ user: req.user._id });
  res.json({ progress: progress ? progress.toMap() : {} });
});

const exerciseRef = z.object({
  topicSlug: z.string().trim().min(1).max(80),
  exerciseId: z.string().trim().min(1).max(80),
});

router.post('/progress', requireAuth, async (req, res) => {
  const data = parse(exerciseRef, req.body, res);
  if (!data) return;

  // $addToSet no sirve aquí (solvedAt hace único cada objeto): se filtra por
  // el par topicSlug + exerciseId.
  const progress =
    (await Progress.findOne({ user: req.user._id })) ??
    new Progress({ user: req.user._id, entries: [] });

  const already = progress.entries.some(
    (entry) => entry.topicSlug === data.topicSlug && entry.exerciseId === data.exerciseId,
  );
  if (!already) {
    progress.entries.push({ ...data, solvedAt: new Date() });
    await progress.save();
  }
  res.json({ progress: progress.toMap() });
});

/** Fusiona el progreso hecho sin sesión (localStorage) al iniciar sesión. */
router.post('/progress/merge', requireAuth, async (req, res) => {
  const schema = z.record(z.string().max(80), z.array(z.string().max(80)).max(200)).default({});
  const data = parse(schema, req.body?.progress ?? {}, res);
  if (!data) return;

  const progress =
    (await Progress.findOne({ user: req.user._id })) ??
    new Progress({ user: req.user._id, entries: [] });

  for (const [topicSlug, exerciseIds] of Object.entries(data)) {
    for (const exerciseId of exerciseIds) {
      const already = progress.entries.some(
        (entry) => entry.topicSlug === topicSlug && entry.exerciseId === exerciseId,
      );
      if (!already) progress.entries.push({ topicSlug, exerciseId, solvedAt: new Date() });
    }
  }
  await progress.save();
  res.json({ progress: progress.toMap() });
});

router.delete('/progress/:topicSlug', requireAuth, async (req, res) => {
  const progress = await Progress.findOne({ user: req.user._id });
  if (progress) {
    progress.entries = progress.entries.filter((e) => e.topicSlug !== req.params.topicSlug);
    await progress.save();
  }
  res.json({ progress: progress ? progress.toMap() : {} });
});

// ── visibilidad de temas ─────────────────────────────────────────────────

/** Público: qué temas apagó el profe y en qué semana va cada uno. */
router.get('/topics/visibility', async (_req, res) => {
  const ajustes = await TopicSetting.find().select('slug enabled weekStart weekEnd');
  res.json({
    disabled: ajustes.filter((t) => t.enabled === false).map((t) => t.slug),
    semanas: Object.fromEntries(
      ajustes.filter((t) => t.weekStart).map((t) => [t.slug, t.weekStart]),
    ),
    fines: Object.fromEntries(
      ajustes.filter((t) => t.weekEnd).map((t) => [t.slug, t.weekEnd]),
    ),
  });
});

const FECHA_ISO = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

router.patch('/admin/topics/:slug', requireAdmin, async (req, res) => {
  const data = parse(
    z
      .object({
        enabled: z.boolean().optional(),
        // null borra la fecha y devuelve el tema a la que toca por defecto.
        weekStart: FECHA_ISO.nullable().optional(),
        weekEnd: FECHA_ISO.nullable().optional(),
      })
      .refine(
        (v) => v.enabled !== undefined || v.weekStart !== undefined || v.weekEnd !== undefined,
        { message: 'No hay nada que cambiar.' },
      ),
    req.body,
    res,
  );
  if (!data) return;

  const cambios = {};
  if (data.enabled !== undefined) cambios.enabled = data.enabled;
  if (data.weekStart !== undefined) cambios.weekStart = data.weekStart;
  if (data.weekEnd !== undefined) cambios.weekEnd = data.weekEnd;

  const guardado = await TopicSetting.findOneAndUpdate(
    { slug: req.params.slug },
    cambios,
    { upsert: true, new: true },
  );
  res.json({
    slug: req.params.slug,
    enabled: guardado.enabled,
    weekStart: guardado.weekStart,
    weekEnd: guardado.weekEnd,
  });
});

// ── panel de administración ───────────────────────────────────────────────

router.post('/admin/users', requireAdmin, async (req, res) => {
  // A diferencia de /auth/register, no depende de ALLOW_REGISTRATION: es como
  // el profe crea cuentas (incluidas las de otros profes) una vez cerrado el
  // registro público.
  const data = parse(registration.extend({ role: z.enum(['student', 'admin']) }), req.body, res);
  if (!data) return;

  if (await User.exists({ username: data.username })) {
    return res.status(409).json({ error: 'Ese usuario ya existe.' });
  }

  const user = await User.create({
    username: data.username,
    name: data.name,
    passwordHash: await bcrypt.hash(data.password, BCRYPT_ROUNDS),
    role: data.role,
  });
  res.status(201).json({ user: user.toPublic() });
});

router.get('/admin/users', requireAdmin, async (_req, res) => {
  const users = await User.find().sort({ createdAt: 1 });
  const progress = await Progress.find();
  const byUser = new Map(progress.map((p) => [p.user.toString(), p]));

  res.json({
    users: users.map((user) => {
      const own = byUser.get(user._id.toString());
      const map = own ? own.toMap() : {};
      return {
        ...user.toPublic(),
        solvedTotal: Object.values(map).reduce((sum, ids) => sum + ids.length, 0),
        progress: map,
      };
    }),
  });
});

router.patch('/admin/users/:id', requireAdmin, async (req, res) => {
  const schema = z.object({
    role: z.enum(['student', 'admin']).optional(),
    active: z.boolean().optional(),
    newPassword: z.string().min(8).max(200).optional(),
  });
  const data = parse(schema, req.body, res);
  if (!data) return;

  const user = await User.findById(req.params.id).select('+passwordHash');
  if (!user) return res.status(404).json({ error: 'Ese usuario no existe.' });

  // No dejar la instalación sin ningún administrador activo.
  const losingAdmin =
    user.role === 'admin' && (data.role === 'student' || data.active === false);
  if (losingAdmin) {
    const otherAdmins = await User.countDocuments({
      _id: { $ne: user._id },
      role: 'admin',
      active: true,
    });
    if (otherAdmins === 0) {
      return res.status(409).json({ error: 'Debe quedar al menos un administrador activo.' });
    }
  }

  if (data.role) user.role = data.role;
  if (typeof data.active === 'boolean') user.active = data.active;
  if (data.newPassword) user.passwordHash = await bcrypt.hash(data.newPassword, BCRYPT_ROUNDS);
  await user.save();

  res.json({ user: user.toPublic() });
});

router.delete('/admin/users/:id', requireAdmin, async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    return res.status(409).json({ error: 'No puedes borrar tu propia cuenta.' });
  }
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Ese usuario no existe.' });

  await Progress.deleteOne({ user: user._id });
  await user.deleteOne();
  res.status(204).end();
});
