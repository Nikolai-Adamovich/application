/**
 * Cloudflare Worker environment bindings.
 *
 * Secrets (set via `wrangler secret put`):
 * - MONGODB_URI: MongoDB Atlas connection string.
 *
 * Vars (set in wrangler.toml):
 * - CORS_ORIGIN: allowed origin for CORS.
 */
import { z } from 'zod';

/**
 * Runtime validation schema for environment variables.
 * Ensures required secrets and vars are present and valid at startup.
 */
export const envSchema = z.object({
  MONGODB_URI: z.url('MONGODB_URI must be a valid URL'),
  CORS_ORIGIN: z.url('CORS_ORIGIN must be a valid URL'),
});

/**
 * Validated environment bindings.
 * Use `validateEnv()` at startup to ensure all required variables are present.
 */
export interface Env {
  readonly MONGODB_URI: string;
  readonly CORS_ORIGIN: string;
}

/**
 * Validates and returns typed environment bindings.
 * Throws if required variables are missing or invalid.
 */
export function validateEnv(env: Record<string, unknown>): Env {
  return envSchema.parse(env);
}
