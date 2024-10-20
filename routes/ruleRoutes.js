// routes/ruleRoutes.js

const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleController');

// Create a new rule
router.post('/rules', ruleController.createRule);

// Get all rules
router.get('/rules', ruleController.getAllRules);

// Get a single rule by ID
router.get('/rules/:id', ruleController.getRuleById);

// Update a rule by ID
router.put('/rules/:id', ruleController.updateRule);

// Delete a rule by ID
router.delete('/rules/:id', ruleController.deleteRule);

// Evaluate data against rules
router.post('/evaluate', ruleController.evaluateData);

module.exports = router;
