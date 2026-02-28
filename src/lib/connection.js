import mysql from "mysql2/promise";

const connection = mysql.createPool({
     host: process.env.DB_HOST, // e.g. "localhost"
     user: process.env.DB_USER, // e.g. "root"
     password: process.env.DB_PASSWORD, // e.g. ""
     database: process.env.DB_NAME, // e.g. "your_database_name"
     waitForConnections: true,
     connectionLimit: 10,
     connectTimeout: 10000, // 10 seconds
});

export default connection;