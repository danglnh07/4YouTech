const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match) {
      env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

async function testConnection() {
  const env = loadEnv();
  const host = env.MYSQL_HOST || "localhost";
  const port = parseInt(env.MYSQL_PORT || "3306", 10);
  const user = env.MYSQL_USER || "root";
  const password = env.MYSQL_PASSWORD || "";
  const database = env.MYSQL_DATABASE || "4youtechdb";

  console.log(`\n========================================`);
  console.log(`🔍 Đang kiểm tra kết nối MySQL Server...`);
  console.log(`- Host: ${host}`);
  console.log(`- Port: ${port}`);
  console.log(`- User: ${user}`);
  console.log(`- Database: ${database}`);
  console.log(`========================================\n`);

  // Step 1: Connect to MySQL server without database (to verify server is alive & auth works)
  let baseConn;
  try {
    baseConn = await mysql.createConnection({ host, port, user, password });
    console.log(`✅ Kết nối thành công tới MySQL Server (${host}:${port})!`);
  } catch (err) {
    console.error(`❌ Không thể kết nối tới MySQL Server tại ${host}:${port}`);
    console.error(`   Mã lỗi: ${err.code} (${err.errno})`);
    console.error(`   Thông điệp: ${err.message}\n`);
    if (err.code === "ECONNREFUSED") {
      console.log(`👉 GỢI Ý: MySQL service chưa chạy hoặc chạy ở cổng khác. Hãy mở XAMPP / MySQL Workbench / Services và Start MySQL!`);
    } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.log(`👉 GỢI Ý: Sai mật khẩu hoặc tài khoản MySQL (root / ${password}). Hãy kiểm tra lại trong .env.local!`);
    }
    process.exit(1);
  }

  // Step 2: Check if database exists
  try {
    const [databases] = await baseConn.query("SHOW DATABASES;");
    const dbNames = databases.map((d) => Object.values(d)[0]);
    const exists = dbNames.includes(database);

    console.log(`📋 Danh sách Database trên server:`, dbNames.join(", "));

    if (!exists) {
      console.log(`\n⚠️ Database '${database}' chưa tồn tại. Đang tự động tạo...`);
      await baseConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      console.log(`✅ Đã tạo thành công Database '${database}'!`);
    } else {
      console.log(`✅ Database '${database}' đã tồn tại sẵn.`);
    }
  } catch (err) {
    console.error(`❌ Lỗi khi kiểm tra/tạo database:`, err.message);
  } finally {
    await baseConn.end();
  }

  // Step 3: Connect directly to the target database
  let dbConn;
  try {
    dbConn = await mysql.createConnection({ host, port, user, password, database });
    console.log(`\n✅ Kết nối trực tiếp vào Database '${database}' thành công!`);

    // Step 4: Check existing tables
    const [tables] = await dbConn.query("SHOW TABLES;");
    const tableNames = tables.map((t) => Object.values(t)[0]);

    console.log(`📊 Số bảng hiện có trong '${database}': ${tableNames.length}`);
    if (tableNames.length > 0) {
      console.log(`   Các bảng:`, tableNames.join(", "));

      // Query row counts for main tables
      console.log(`\n📈 Thống kê số lượng bản ghi mẫu:`);
      for (const tbl of tableNames) {
        try {
          const [cnt] = await dbConn.query(`SELECT COUNT(*) AS total FROM \`${tbl}\`;`);
          console.log(`   - Bảng \`${tbl}\`: ${cnt[0].total} dòng`);
        } catch {}
      }
    } else {
      console.log(`⚠️ Database '${database}' chưa có bảng nào.`);
      console.log(`👉 Bạn có thể chạy script '4YouTech_MySQL_Script.sql' để nạp đầy đủ cấu trúc 12 bảng và dữ liệu mẫu.`);
    }

    console.log(`\n🎉 KẾT QUẢ: KẾT NỐI MYSQL HOÀN TOÀN THÀNH CÔNG!\n`);
  } catch (err) {
    console.error(`❌ Lỗi khi kết nối vào Database '${database}':`, err.message);
  } finally {
    if (dbConn) await dbConn.end();
  }
}

testConnection().catch((err) => {
  console.error("Lỗi không mong muốn:", err);
  process.exit(1);
});
