// CORE REST API Written for Ecoworks
// Written by Bardia Habib Khoda

// Library injections
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mssql = require('mssql');

// App setup with required dependencies
const app = express();
const port = process.env.PORT || 3000; 

app.use(helmet());
app.use(bodyParser.json());

// Configuration file and environment setup
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE
};

// Connect to the database
mssql.connect(config, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to database!');
  }
});

// Configure the app to use the routers
app.use("/product", require("./product_router.js"));

// Start the app
app.listen(port, () => console.log(`Server listening on port ${port}...`));
