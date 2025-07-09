import { Hono } from 'hono'
import type { D1Database } from '@cloudflare/workers-types';
import { createDbClient, DrizzleClient } from './db/client';

export interface Bindings{
  DB: D1Database;
}

export type Variables = {
  db: DrizzleClient;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', async (c, next) => {
  const db = createDbClient(c.env.DB);
  c.set('db', db);
  await next();
})

app.get('/', async (c) => {
  const db = c.get('db');
  const user = await db.query.users.findFirst();

  if (!user) {
    return c.json({
      status: "ok",
      message: "DB connected, but no data found.",
    });
  }

  return c.json({
    status: "ok",
    message: "DB connection successful!",
    user: user, // 取得したデータをレスポンスに含める
  });
})

export default app
