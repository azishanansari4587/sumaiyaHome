const mysql = require('mysql2/promise');
const fs = require('fs');

// Load environment variables manually
const envPath = '.env';
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8')
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
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log("Connected to database. Altering table...");
        
        // Add reset_token_expires if not exists
        try {
          const [result] = await connection.execute("ALTER TABLE users ADD COLUMN reset_token_expires DATETIME NULL");
          console.log("Successfully added column reset_token_expires to users table.");
        } catch (alterErr) {
          if (alterErr.code === 'ER_DUP_FIELDNAME') {
            console.log("Column already exists.");
          } else {
            throw alterErr;
          }
        }
        
        await connection.end();
        console.log("Finished.");
    } catch (e) {
        console.error("Error connecting to db or executing query: ", e);
    }
})();
