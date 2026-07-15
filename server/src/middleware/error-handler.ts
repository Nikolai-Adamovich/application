/**
 * Global error handler middleware.
 *
 * Catches thrown errors, logs them, and returns a consistent JSON error
 * envelope. Zod validation errors are surfaced as 400s.
 */
import type { Context } from 'hono';
import { ZodError } from 'zod';

export function errorHandler(err: unknown, c: Context): Response {
  if (err instanceof ZodError) {
    return c.json({ error: 'validation_error', issues: err.issues }, 400);
  }

  console.error('Unhandled error:', err);
  return c.json({ error: 'internal_error' }, 500);
}
