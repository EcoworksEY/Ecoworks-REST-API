// Database Connector
// Written by Bardia Habib Khoda

// Library Injections
const { Client } = require('pg');
const createSSHTunnel = require('./ssh_connector'); 

// Promise function to ensure the database connection is stable
const databasePromise = (async () => {
  try {
    const sshClient = await createSSHTunnel(); // Wait for the SSH tunnel to be established

    const database_connector = new Client({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST_LOCALHOST,
      port: process.env.DB_PORT
    });

    // Ensure the await is happening.
    await database_connector.connect();
    console.log('Database Connection successful.');

    return database_connector;
  } catch (error) {
    console.error('Error establishing SSH connection:', error);
    throw error; // Throw the error to be caught by the caller
  }
})();

module.exports = databasePromise;
