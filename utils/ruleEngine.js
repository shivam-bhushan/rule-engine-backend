// utils/ruleEngine.js

const { parseToAST } = require('./parser');

/**
 * Creates an AST from a rule string.
 * @param {string} ruleString - The rule string to parse.
 * @returns {Object} - The root node of the AST.
 * @throws {Error} - If the rule string has invalid syntax.
 */
function create_rule(ruleString) {
    if (typeof ruleString !== 'string' || ruleString.trim() === '') {
        throw new Error('Invalid rule string provided.');
    }

    try {
        const ast = parseToAST(ruleString);
        return ast.toObject(); // Convert AST node to plain object for consistency
    } catch (error) {
        throw new Error(`Failed to create rule: ${error.message}`);
    }
}

/**
 * Combines two ASTs with a specified logical operator.
 * @param {Object} left - The left AST node.
 * @param {Object} right - The right AST node.
 * @param {string} operator - The logical operator ('AND' or 'OR').
 * @returns {Object} - The combined AST node.
 * @throws {Error} - If an invalid operator is provided.
 */
function combine_two_rules(left, right, operator) {
    const validOperators = ['AND', 'OR'];
    operator = operator.toUpperCase();
    if (!validOperators.includes(operator)) {
        throw new Error(`Invalid combine operator. Use one of: ${validOperators.join(', ')}`);
    }

    return {
        type: 'operator',
        operator: operator,
        left: left,
        right: right
    };
}

/**
 * Evaluates an AST against provided data.
 * @param {Object} ast - The AST object representing the rule.
 * @param {Object} data - The data dictionary to evaluate against.
 * @returns {boolean} - True if data satisfies the rule, False otherwise.
 * @throws {Error} - If the AST contains unsupported operators or malformed nodes.
 */
function evaluate_rule(ast, data) {
    if (!ast || typeof ast !== 'object') {
        throw new Error('Invalid AST provided for evaluation.');
    }

    // Recursive evaluation function
    function evaluate(node) {
        if (node.type === 'operand') {
            const { field, op, value } = node.operand;
            const dataValue = data[field];

            switch (op) {
                case '>':
                    return dataValue > value;
                case '<':
                    return dataValue < value;
                case '=':
                    return dataValue == value;
                case '!=':
                    return dataValue != value;
                case '>=':
                    return dataValue >= value;
                case '<=':
                    return dataValue <= value;
                default:
                    throw new Error(`Unsupported operator: ${op}`);
            }
        } else if (node.type === 'operator') {
            const left = evaluate(node.left);
            const right = evaluate(node.right);

            switch (node.operator) {
                case 'AND':
                    return left && right;
                case 'OR':
                    return left || right;
                default:
                    throw new Error(`Unsupported logical operator: ${node.operator}`);
            }
        } else {
            throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    return evaluate(ast);
}

module.exports = {
    create_rule,
    combine_two_rules,
    evaluate_rule
};
