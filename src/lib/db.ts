import sql from "mssql";

const sqlConfig: sql.config = {
  user: process.env.MSSQL_USER || "sa",
  password: process.env.MSSQL_PASSWORD || "",
  database: process.env.MSSQL_DATABASE || "4YouTechDB",
  server: process.env.MSSQL_SERVER || "localhost",
  port: parseInt(process.env.MSSQL_PORT || "1433", 10),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === "true", // Use true for Azure SQL
    trustServerCertificate: true // Self-signed certs fallback
  }
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export async function getDbPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(sqlConfig)
      .connect()
      .then((pool) => {
        console.log("==> Connected to SQL Server successfully.");
        return pool;
      })
      .catch((err) => {
        console.error("==> SQL Server Connection Error:", err.message);
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

export async function testDbConnection(): Promise<{ connected: boolean; message: string; details?: any }> {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query("SELECT COUNT(*) AS userCount FROM dbo.Users");
    return {
      connected: true,
      message: "Kết nối SQL Server thành công (Database 4YouTechDB)",
      details: {
        usersInDb: result.recordset[0]?.userCount || 0
      }
    };
  } catch (error: any) {
    return {
      connected: false,
      message: `Chưa thể kết nối SQL Server: ${error.message}`
    };
  }
}
