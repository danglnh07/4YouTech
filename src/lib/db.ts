import { Pool } from "pg";

const globalForDb = globalThis as unknown as { pgPool?: Pool };

function resolveConnectionString(): string {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED;
  if (!connectionString) {
    throw new Error(
      "Missing DATABASE_URL (or POSTGRES_URL / DATABASE_URL_UNPOOLED) environment variable"
    );
  }
  return connectionString;
}

function createPool(): Pool {
  const connectionString = resolveConnectionString();
  const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
  return new Pool({
    connectionString,
    max: 10,
    ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } })
  });
}

export function getPgPool(): Pool {
  if (!globalForDb.pgPool) {
    globalForDb.pgPool = createPool();
  }
  return globalForDb.pgPool;
}

export async function testDbConnection(): Promise<{
  connected: boolean;
  message: string;
  details?: any;
}> {
  try {
    const result = await getPgPool().query(
      `SELECT COUNT(*)::int AS "userCount" FROM "Users"`
    );
    return {
      connected: true,
      message: "Kết nối thành công PostgreSQL (Neon / Vercel Postgres)",
      details: {
        dbType: "PostgreSQL",
        usersInDb: result.rows[0]?.userCount || 0
      }
    };
  } catch (error: any) {
    return {
      connected: false,
      message: `Chưa kết nối PostgreSQL: ${error.message}`
    };
  }
}
