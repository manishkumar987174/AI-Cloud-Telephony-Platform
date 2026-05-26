const { Router } = require('express');
const { getDatabaseDiagnostics, seedDatabase } = require('../controllers/database.controller');

const router = Router();

// Retrieve connection status, row counts, and schema previews
router.get('/diagnostics', getDatabaseDiagnostics);

// Seed database programmatically for local development testing
router.post('/seed', seedDatabase);

module.exports = router;
