// Database Connector
// Written by Bardia Habib Khoda

// Library Injections
const express = require('express');
const sql = require('mssql');

// create the object type
class database_connector {

    // Creating this class for later re-use with other databases
    constructor(sql_database, database_name) {
        this.sql_database = sql_database || sql;
        this.database_name = database_name || "no"; 
    }

    async createConnection() {

        //Create a new SQL connection pool
        // This still goes to the process environment variables.
        const pool = await sql.connect({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_SERVER,
            database: process.env.DB_DATABASE,
            options: {
            encrypt: true //For secure connections
            }
      });

      return pool;
    }
}

module.export = database_connector;