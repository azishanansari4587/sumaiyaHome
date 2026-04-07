const mysql = require('mysql2/promise');
const fs = require('fs');

const envPath = '.env';
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .forEach(line => {
      const [key, ...values] = line.split('=');
      if (key && values.length > 0) process.env[key.trim()] = values.join('=').trim().replace(/^['"]|['"]$/g, '');
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

        const [rows] = await connection.execute("SHOW COLUMNS FROM users");
        console.log(JSON.stringify(rows, null, 2));
        
        await connection.end();
    } catch (e) {
        console.error("Error: ", e);
    }
})();
