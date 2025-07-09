import { Hono } from 'hono'
import type { D1Database } from '@cloudflare/workers-types';
import { createDbClient, DrizzleClient } from './db/client';
import authRouter from './routes/auth.route';

export interface Bindings{
  DB: D1Database;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
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
    user: user,
  });
})

app.route('/api/v1/auth', authRouter)

export default app
