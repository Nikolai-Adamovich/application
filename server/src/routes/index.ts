/**
 * HTTP route handlers.
 *
 * Thin handlers that validate input with shared Zod schemas and delegate
 * to services. All business logic lives in services.
 */
import { Hono } from 'hono';
import type { Env } from '../env.js';

export const routes = new Hono<{ Bindings: Env }>();

// Health check endpoint
routes.get('/', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

export default routes;
