// Database Connector
// Written by Bardia Habib Khoda

// Library Injections
const { Pool } = require('pg');

const database_connector = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false // For self-signed certificates, set this to false
    }
});

module.export = database_connector;