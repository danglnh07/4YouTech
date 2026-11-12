const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "090504",
    database: "4youtechdb"
  });

  const adminStaffHash = "hash_3650c942"; // hashPassword("090504@Th")

  // Update admin password
  await conn.query("UPDATE users SET PasswordHash = ? WHERE UserId = ?", [adminStaffHash, "usr-admin"]);
  console.log("Updated usr-admin password to 090504@Th (hash_3650c942)");

  // Update staff passwords
  await conn.query("UPDATE users SET PasswordHash = ? WHERE UserId IN (?, ?)", [adminStaffHash, "usr-staff-it", "usr-staff-des"]);
  console.log("Updated staff passwords (usr-staff-it, usr-staff-des) to 090504@Th (hash_3650c942)");

  // Clear demo passwords for customer accounts so nobody can log in with demo passwords
  await conn.query("UPDATE users SET PasswordHash = NULL WHERE UserId LIKE 'usr-cust-%'");
  console.log("Cleared demo passwords for all usr-cust-* accounts");

  const [rows] = await conn.query("SELECT UserId, Email, Role, PasswordHash FROM users");
  console.table(rows);

  await conn.end();
}

main().catch((err) => {
  console.error("Error updating passwords:", err);
  process.exit(1);
});

