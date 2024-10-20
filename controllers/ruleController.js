// controllers/ruleController.js

const Rule = require('../models/ruleModel');
const { create_rule, combine_two_rules, evaluate_rule } = require('../utils/ruleEngine');

/**
 * Create a new rule.
 */
exports.createRule = async (req, res) => {
    const { name, expression } = req.body;

    // Validate request
    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message: 'Name must be a non-empty string.' });
    }

    if (typeof expression !== 'string' || expression.trim() === '') {
        return res.status(400).json({ message: 'Expression must be a non-empty string.' });
    }

    if (!name || !expression) {
        return res.status(400).json({ message: 'Name and expression are required.' });
    }

    try {
        // Generate AST
        const ast = create_rule(expression);

        // Create and save the rule
        const newRule = new Rule({
            name,
            expression,
            ast,
        });

        await newRule.save();

        res.status(201).json({ message: 'Rule created successfully.', rule: newRule });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            res.status(409).json({ message: 'Rule with this name already exists.' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

/**
 * Get all rules.
 */
exports.getAllRules = async (req, res) => {
    try {
        const rules = await Rule.find().sort({ createdAt: -1 });
        res.status(200).json({ rules });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get a single rule by ID.
 */
exports.getRuleById = async (req, res) => {
    const { id } = req.params;

    try {
        const rule = await Rule.findById(id);
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found.' });
        }
        res.status(200).json({ rule });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update a rule by ID.
 */
exports.updateRule = async (req, res) => {
    const { id } = req.params;
    const { name, expression } = req.body;

    try {
        const rule = await Rule.findById(id);
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found.' });
        }

        if (name) rule.name = name;
        if (expression) {
            rule.expression = expression;
            rule.ast = create_rule(expression);
        }

        await rule.save();

        res.status(200).json({ message: 'Rule updated successfully.', rule });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            res.status(409).json({ message: 'Rule with this name already exists.' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

/**
 * Delete a rule by ID.
 */
exports.deleteRule = async (req, res) => {
    const { id } = req.params;

    try {
        const rule = await Rule.findByIdAndDelete(id);
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found.' });
        }
        res.status(200).json({ message: 'Rule deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Evaluate data against combined rules.
 */
exports.evaluateData = async (req, res) => {
    const { data, ruleIds } = req.body;

    if (!data || !Array.isArray(ruleIds) || ruleIds.length === 0) {
        return res.status(400).json({ message: 'Data and an array of ruleIds are required.' });
    }

    try {
        // Fetch rules by IDs
        const rules = await Rule.find({ _id: { $in: ruleIds } });

        if (rules.length !== ruleIds.length) {
            return res.status(404).json({ message: 'One or more rules not found.' });
        }

        // Combine rules with OR (or choose another strategy as needed)
        let combinedAST = rules[0].ast;
        for (let i = 1; i < rules.length; i++) {
            combinedAST = combine_two_rules(combinedAST, rules[i].ast, 'OR');
        }

        // Combine with base rule if needed (optional)
        // For example, if there's a base rule that should always apply

        // Evaluate
        const isEligible = evaluate_rule(combinedAST, data);

        res.status(200).json({ eligible: isEligible });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
