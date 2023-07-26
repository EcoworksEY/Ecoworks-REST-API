// Database Connector
// Written by Bardia Habib Khoda
// Library Injections
const { Client } = require('pg');
console.log(' We got in here.');
console.log(`host is: ${process.env.DB_HOST}`);

const database_connector = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10)
});

database_connector.connect();

module.exports = database_connector;
