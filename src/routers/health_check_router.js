// Router for health checks
// Written by Bardia Habib Khoda

// Library injections
const express = require("express");
const health_check_router = express.Router();

health_check_router.get('/', async (req, res) => {
res.status(200).json({ message: 'OK'});
});

// Export router
module.exports = health_check_router;
