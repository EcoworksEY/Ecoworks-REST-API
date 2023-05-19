// CORE REST API Written for Ecoworks
// Written by Bardia Habib Khoda

// Library injections
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const product_router = require("./routers/product_router")

// App setup with required dependencies
const app = express();
const port = process.env.PORT || 3000; 

app.use(helmet());
app.use(bodyParser.json());


// Configure the app to use the routers
app.use("/product", product_router);

// Start the app
app.listen(port, () => console.log(`Server listening on port ${port}...`));
