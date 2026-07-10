/**
 * Hono application wiring.
 *
 * Registers middleware and routes. Handlers validate input with shared Zod
 * schemas and delegate to services. No business logic here.
 */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { errorHandler } from './middleware/error-handler.js';
import type { Env } from './env.js';

export const app = new Hono<{ Bindings: Env }>();

// Cross-cutting middleware
app.use('*', logger());
app.use('*', async (c, next) => {
  const origin = c.env.CORS_ORIGIN;

  await cors({ origin })(c, next);
});
app.onError(errorHandler);

// Routes
import routes from './routes/index.js';

app.route('/', routes);

export default app;
