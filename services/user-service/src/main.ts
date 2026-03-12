import express from 'express';
import cors from 'cors';
import { userRouter } from './user.routes';
import { getAllFlags } from '@poc/feature-flags';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/users', userRouter);

// Health check — includes feature flag snapshot so api-gateway can proxy it
app.get('/health', (_req, res) => {
  res.json({
    service: 'user-service',
    status: 'ok',
    uptime: process.uptime(),
    featureFlags: getAllFlags(),
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[user-service] Listening on http://localhost:${PORT}`);
});

export default app;
