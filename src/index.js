// CORE REST API Written for Ecoworks
// Written by Bardia Habib Khoda

// Library injections
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const product_router = require("./routers/product_router");
const user_router = require('./routers/user_router');
const health_check_router = require('./routers/health_check_router');
const cors = require('cors');

// App setup with required dependencies
const app = express();
const port = process.env.PORT || 3000; 

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());


// Configure the app to use the routers
app.use("/product", product_router);
app.use("/auth", user_router);
app.use("/", health_check_router);

// Start the app
app.listen(port, () => console.log(`Server listening on port ${port}...`));
