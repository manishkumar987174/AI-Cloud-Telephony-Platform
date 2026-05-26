import { Router } from 'express';
import { getDatabaseDiagnostics, seedDatabase } from '../controllers/database.controller.js';

const router = Router();

// Retrieve connection status, row counts, and schema previews
router.get('/diagnostics', getDatabaseDiagnostics);

// Seed database programmatically for local development testing
router.post('/seed', seedDatabase);

export default router;
