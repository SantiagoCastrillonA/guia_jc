import 'dotenv/config';
import express from 'express';
import 'express-async-errors'; // los errores de los handlers async llegan al middleware de error
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { loadUser } from './src/auth.js';
import { router } from './src/routes.js';
import { deployRouter } from './src/deploy.js';

const PORT = Number(process.env.PORT ?? 3000);
const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://127.0.0.1:27017/guia_jc';

const app = express();

// nginx es quien habla con el cliente: sin esto el rate limit vería una sola IP.
app.set('trust proxy', 1);

app.use(helmet());
// El cuerpo crudo se guarda para poder verificar la firma HMAC del webhook de
// GitHub: la firma se calcula sobre los bytes exactos, no sobre el JSON reserializado.
app.use(
  express.json({
    limit: '256kb', // los payloads de push de GitHub pasan de 32kb
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(cookieParser());
app.use(loadUser);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', deployRouter); // webhook de GitHub: autentica por firma, no por sesión
app.use('/api', router);

app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));

// Último recurso: nunca se filtra el stack al cliente.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Algo falló en el servidor.' });
});

await mongoose.connect(MONGO_URL);
console.log('Conectado a MongoDB');

app.listen(PORT, '127.0.0.1', () => {
  console.log(`API escuchando en http://127.0.0.1:${PORT}`);
});
