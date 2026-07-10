/**
 * @app/shared — contract layer reused by ui/ and server/.
 *
 * - validation: Zod schemas (single source of truth)
 * - contracts:  API route definitions
 * - types:      TypeScript types inferred from Zod schemas
 */
export * from './validation/index.js';
export * from './contracts/index.js';
export * from './types/index.js';
