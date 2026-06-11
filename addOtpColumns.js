const mysql = require('mysql2/promise');
const fs = require('fs');

// Load environment variables manually
const envPath = '.env';
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .forEach(line => {
      const [key, ...values] = line.split('=');
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim().replace(/^['"]|['"]$/g, '');
      }
    });
}

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 30000,
  });

  console.log("✅ Connected to database.");

  // Show existing columns
  const [cols] = await connection.execute("DESCRIBE users");
  console.log("\nExisting columns in 'users' table:");
  cols.forEach(c => console.log(` - ${c.Field} (${c.Type})`));

  // Add otp_code column
  try {
    await connection.execute("ALTER TABLE users ADD COLUMN otp_code VARCHAR(6) NULL");
    console.log("\n✅ Added column: otp_code");
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') console.log("\nℹ️  otp_code already exists.");
    else { console.error("❌", e.message); }
  }

  // Add otp_expires column
  try {
    await connection.execute("ALTER TABLE users ADD COLUMN otp_expires DATETIME NULL");
    console.log("✅ Added column: otp_expires");
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') console.log("ℹ️  otp_expires already exists.");
    else { console.error("❌", e.message); }
  }

  await connection.end();
  console.log("\n✅ Done!");
})().catch(e => console.error("❌ Connection failed:", e.message));
