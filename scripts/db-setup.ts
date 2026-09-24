import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { Pool } from "pg";

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (key in process.env) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env"));

function createPool(): Pool {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED;
  if (!connectionString) {
    throw new Error(
      "Missing DATABASE_URL (or POSTGRES_URL / DATABASE_URL_UNPOOLED) environment variable"
    );
  }
  const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
  return new Pool({
    connectionString,
    max: 1,
    ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } })
  });
}

async function main() {
  const pool = createPool();
  try {
    for (const file of ["db/schema.sql", "db/seed.sql"]) {
      const sql = readFileSync(resolve(process.cwd(), file), "utf8");
      await pool.query(sql);
      console.log(`Applied ${file}`);
    }
    const { rows } = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM "Users") AS users,
         (SELECT COUNT(*) FROM "Services") AS services,
         (SELECT COUNT(*) FROM "SampleProjects") AS projects,
         (SELECT COUNT(*) FROM "ServiceOrders") AS orders,
         (SELECT COUNT(*) FROM "ServiceReviews") AS reviews,
         (SELECT COUNT(*) FROM "PaymentTransactions") AS transactions`
    );
    console.log("Seed row counts:", rows[0]);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("db:setup failed:", error);
  process.exit(1);
});
