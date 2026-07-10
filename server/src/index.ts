/**
 * Server entry point — the Cloudflare Worker fetch handler.
 *
 * Builds the Hono app and exports the Worker bindings. Route handlers are
 * thin; all business logic lives in services.
 */
import type { Env } from './env.js';
import { app } from './app.js';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
