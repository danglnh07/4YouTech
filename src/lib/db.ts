import mysql from "mysql2/promise";
import sql from "mssql";

// MySQL Pool Configuration for MySQL Workbench / phpMyAdmin / XAMPP / MariaDB
export const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT || "3306", 10),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "4youtechdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Microsoft SQL Server Configuration (Backup Connection)
const sqlConfig: sql.config = {
  user: process.env.MSSQL_USER || "sa",
  password: process.env.MSSQL_PASSWORD || "090504",
  database: process.env.MSSQL_DATABASE || "4YouTechDB",
  server: process.env.MSSQL_SERVER || "localhost",
  port: parseInt(process.env.MSSQL_PORT || "1433", 10),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === "true",
    trustServerCertificate: true
  }
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export async function getDbPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(sqlConfig)
      .connect()
      .then((pool) => {
        console.log("==> Connected to MSSQL Server successfully.");
        return pool;
      })
      .catch((err) => {
        console.error("==> MSSQL Server Connection Notice:", err.message);
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

export async function testDbConnection(): Promise<{ connected: boolean; message: string; details?: any }> {
  const dbType = (process.env.DB_TYPE || "mysql").toLowerCase();

  if (dbType === "mysql" || dbType === "workbench") {
    try {
      const [rows]: any = await mysqlPool.query("SELECT COUNT(*) AS userCount FROM Users");
      return {
        connected: true,
        message: "Kết nối thành công Cơ sở dữ liệu MySQL Workbench (Database 4youtechdb)",
        details: {
          dbType: "MySQL / MySQL Workbench",
          usersInDb: rows[0]?.userCount || 0
        }
      };
    } catch (mysqlErr: any) {
      // Fallback check to MSSQL
      try {
        const pool = await getDbPool();
        const result = await pool.request().query("SELECT COUNT(*) AS userCount FROM dbo.Users");
        return {
          connected: true,
          message: "Kết nối Microsoft SQL Server thành công (Fallback 4YouTechDB)",
          details: {
            dbType: "Microsoft SQL Server",
            usersInDb: result.recordset[0]?.userCount || 0
          }
        };
      } catch (mssqlErr: any) {
        return {
          connected: false,
          message: `Chưa kết nối MySQL Workbench (${mysqlErr.message}). Vui lòng chạy script 4YouTech_MySQL_Script.sql trong Workbench!`
        };
      }
    }
  } else {
    try {
      const pool = await getDbPool();
      const result = await pool.request().query("SELECT COUNT(*) AS userCount FROM dbo.Users");
      return {
        connected: true,
        message: "Kết nối Microsoft SQL Server thành công (Database 4YouTechDB)",
        details: {
          dbType: "Microsoft SQL Server",
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
}
