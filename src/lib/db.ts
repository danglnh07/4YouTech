import { Pool as PgPool } from "pg";
import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as {
  pgPool?: PgPool;
  mysqlPool?: mysql.Pool;
};

export function getDbDriverType(): "postgres" | "mysql" {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    "";

  if (
    dbUrl.includes("postgres") ||
    dbUrl.includes("neon.tech") ||
    dbUrl.includes("vercel-storage") ||
    process.env.DB_TYPE === "postgres" ||
    process.env.DB_TYPE === "neon"
  ) {
    return "postgres";
  }

  if (process.env.DB_TYPE === "mysql" || (process.env.MYSQL_HOST && !dbUrl)) {
    return "mysql";
  }

  // If DATABASE_URL exists, default to postgres (Neon on Vercel), else mysql
  return dbUrl ? "postgres" : "mysql";
}

export function getPgPool(): PgPool {
  if (!globalForDb.pgPool) {
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL_UNPOOLED ||
      "";
    const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
    globalForDb.pgPool = new PgPool({
      connectionString,
      max: 10,
      ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } })
    });
  }
  return globalForDb.pgPool;
}

export function getMysqlPool(): mysql.Pool {
  if (!globalForDb.mysqlPool) {
    const host = process.env.MYSQL_HOST || "localhost";
    const port = parseInt(process.env.MYSQL_PORT || "3306", 10);
    const user = process.env.MYSQL_USER || "root";
    const password = process.env.MYSQL_PASSWORD || "";
    const database = process.env.MYSQL_DATABASE || "4youtechdb";
    const dbUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

    if (dbUrl && dbUrl.startsWith("mysql://")) {
      globalForDb.mysqlPool = mysql.createPool({
        uri: dbUrl,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    } else {
      globalForDb.mysqlPool = mysql.createPool({
        host,
        port,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }
  }
  return globalForDb.mysqlPool;
}

export async function queryDb<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const driver = getDbDriverType();

  if (driver === "postgres") {
    const pool = getPgPool();
    // Convert ? placeholders to $1, $2, $3... for Postgres
    let paramIndex = 1;
    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    const result = await pool.query(pgSql, params);
    return result.rows as T[];
  } else {
    const pool = getMysqlPool();
    // Convert "TableName" double-quotes to `TableName` backticks for MySQL
    const mysqlSql = sql.replace(/"([A-Za-z0-9_]+)"/g, "`$1`");
    const [rows] = await pool.query(mysqlSql, params);
    return rows as T[];
  }
}

export async function testDbConnection(): Promise<{
  connected: boolean;
  message: string;
  details?: any;
}> {
  const driver = getDbDriverType();
  try {
    const rows = await queryDb<any>(`SELECT COUNT(*) AS usercount FROM "Users"`);
    return {
      connected: true,
      message: `Kết nối thành công ${driver === "postgres" ? "Neon PostgreSQL (Vercel)" : "MySQL"} Database!`,
      details: {
        dbType: driver === "postgres" ? "Neon PostgreSQL" : "MySQL",
        usersInDb: rows[0]?.usercount || rows[0]?.userCount || rows[0]?.count || 0
      }
    };
  } catch (error: any) {
    return {
      connected: false,
      message: `Chưa kết nối DB (${driver}): ${error.message}`
    };
  }
}


