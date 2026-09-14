import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

export const dbPool =
  globalThis._pgPool ||
  new Pool({
    connectionString,
    ssl: connectionString ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis._pgPool = dbPool;
}

export async function query<T = any>(text: string, params?: any[]) {
  const start = Date.now();
  const res = await dbPool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log('Executed DB query', { text: text.substring(0, 80), duration, rows: res.rowCount });
  }
  return res;
}
