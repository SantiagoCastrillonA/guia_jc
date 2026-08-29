import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Un estudiante o un profesor. La contraseña nunca se guarda en claro:
 * se almacena el hash de bcrypt y el campo queda fuera de las consultas
 * por defecto (`select: false`).
 */
const userSchema = new Schema(
  {
    // El usuario con el que inicia sesión. Se guarda en minúsculas.
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 32,
    },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'admin'], default: 'student', index: true },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    username: this.username,
    name: this.name,
    role: this.role,
    active: this.active,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt ?? null,
  };
};

/**
 * El progreso de un estudiante: un documento por persona, con una entrada por
 * ejercicio resuelto. El índice único evita duplicados si llegan dos marcas
 * del mismo ejercicio a la vez.
 */
const progressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    entries: [
      {
        _id: false,
        topicSlug: { type: String, required: true },
        exerciseId: { type: String, required: true },
        solvedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

/** El progreso en el mismo formato que usa el frontend: { slug: [ids] }. */
progressSchema.methods.toMap = function toMap() {
  const map = {};
  for (const entry of this.entries) {
    (map[entry.topicSlug] ??= []).push(entry.exerciseId);
  }
  return map;
};

/**
 * Si un tema está apagado por el profe. Solo existe un documento por tema
 * cuando alguna vez se desactivó: su ausencia significa "disponible" (el
 * valor por defecto que ya trae `topics.ts` en el frontend).
 */
const topicSettingSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    enabled: { type: Boolean, default: true },
    /**
     * Inicio y fin de la semana en que se dicta, como 'YYYY-MM-DD'. Se
     * guardan como texto y no como Date a proposito: son dias del calendario
     * del salon, no un instante, y un Date los correria de dia segun la zona
     * horaria del servidor. Vacio = vale la fecha por defecto que calcula el
     * frontend (weekStart a partir del numero de sesion; weekEnd, sabado de
     * esa misma semana).
     */
    weekStart: { type: String, default: null, match: /^\d{4}-\d{2}-\d{2}$/ },
    weekEnd: { type: String, default: null, match: /^\d{4}-\d{2}-\d{2}$/ },
  },
  { timestamps: true },
);

export const User = model('User', userSchema);
export const Progress = model('Progress', progressSchema);
export const TopicSetting = model('TopicSetting', topicSettingSchema);
