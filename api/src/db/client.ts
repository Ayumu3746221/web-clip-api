import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import type { D1Database } from '@cloudflare/workers-types';

export const createDbClient = (d1: D1Database) => drizzle(d1, { schema });
export type DrizzleClient = ReturnType<typeof createDbClient>;