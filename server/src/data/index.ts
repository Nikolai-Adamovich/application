/**
 * Data-access layer.
 *
 * This is the ONLY place that knows about `cloudflare:sockets` and the
 * MongoDB driver. Services depend on the interface defined here, not on the
 * concrete driver, so the fallback strategy (ADR-0002) can swap
 * implementations without touching services.
 *
 * The concrete MongoDB connection setup will be implemented in a later task
 * once the socket-interop details are validated.
 */
import type { Db } from 'mongodb';

/**
 * A minimal data-access interface. Services depend on this abstraction.
 */
export interface DataStore {
  readonly db: Db;
}

/**
 * Factory placeholder. The real implementation will construct a MongoDB
 * client routed through `cloudflare:sockets` with `nodejs_compat`.
 */
export interface DataStoreFactory {
  create(uri: string): Promise<DataStore>;
}
