import express from 'express';
import cors from 'cors';
import { notificationRouter } from './notification.routes';
import { getAllFlags } from '@poc/feature-flags';

const app = express();
const PORT = process.env.PORT ?? 3002;

app.use(cors());
app.use(express.json());

app.use('/notifications', notificationRouter);

app.get('/health', (_req, res) => {
  res.json({
    service: 'notification-service',
    status: 'ok',
    uptime: process.uptime(),
    featureFlags: getAllFlags(),
  });
});

app.listen(PORT, () => {
  console.log(`[notification-service] Listening on http://localhost:${PORT}`);
});

export default app;
