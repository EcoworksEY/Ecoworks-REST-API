// CORE REST API Written for Ecoworks
// Written by Bardia Habib Khoda

// Library injections
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

// App setup with required dependencies
const app = express();
const port = process.env.PORT || 3000; 

app.use(helmet());
app.use(bodyParser.json());

// Configure the app to use the routers
app.use("/product", require("./product_router.js"));

// Start the app
app.listen(port, () => console.log(`Server listening on port ${port}...`));
