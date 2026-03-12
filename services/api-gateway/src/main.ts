import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { ClientRequest } from 'http';
import { getAllFlags } from '@poc/feature-flags';

const app = express();
const PORT = process.env.PORT ?? 3000;

const USER_SERVICE_URL        = process.env.USER_SERVICE_URL        ?? 'http://localhost:3001';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL ?? 'http://localhost:3002';

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));

// NOTE: express.json() is applied ONLY to gateway-owned routes (/health, /flags).
// Proxy routes must NOT have their body stream consumed before http-proxy-middleware
// can forward it — doing so silently drops POST/PUT bodies.
const jsonParser = express.json();

// ── Helper: re-stream a parsed JSON body into the outgoing proxy request ──────
// When express.json() runs on a gateway-owned route it consumes req.body from the
// stream. For proxied routes we skip the parser entirely so the raw stream is
// preserved. This helper is used as a safety net if a parser slips through.
function forwardParsedBody(proxyReq: ClientRequest, req: express.Request): void {
  const body: unknown = (req as express.Request & { body?: unknown }).body;
  if (body !== undefined && body !== null) {
    const raw = JSON.stringify(body);
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(raw));
    proxyReq.write(raw);
  }
}

// ── Gateway-level routes ──────────────────────────────────────────────────────

/**
 * GET /health — Aggregate health check across all services.
 * Shows feature flags snapshot — PMs can see what's ON/OFF without a
 * database or separate service.
 */
app.get('/health', jsonParser, (_req, res) => {
  res.json({
    service: 'api-gateway',
    status: 'ok',
    uptime: process.uptime(),
    routes: {
      '/users/*': USER_SERVICE_URL,
      '/notifications/*': NOTIFICATION_SERVICE_URL,
    },
    featureFlags: getAllFlags(),
  });
});

/**
 * GET /flags — Expose current feature flag state to frontends.
 * Angular and React apps call this on startup to activate/deactivate UI features.
 */
app.get('/flags', jsonParser, (_req, res) => {
  res.json({ success: true, data: getAllFlags() });
});

// ── Proxy routes ──────────────────────────────────────────────────────────────
// Raw streams are forwarded untouched — no express.json() before these routes.

app.use(
  '/users',
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/users${path === '/' ? '' : path}`,
    logger: console,
    on: { proxyReq: forwardParsedBody as never },
  }),
);

app.use(
  '/notifications',
  createProxyMiddleware({
    target: NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/notifications${path === '/' ? '' : path}`,
    logger: console,
    on: { proxyReq: forwardParsedBody as never },
  }),
);

// ── 404 catch-all ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not registered in api-gateway' } });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[api-gateway] Listening on http://localhost:${PORT}`);
  console.log(`  → /users/*         → ${USER_SERVICE_URL}`);
  console.log(`  → /notifications/* → ${NOTIFICATION_SERVICE_URL}`);
});

export default app;
