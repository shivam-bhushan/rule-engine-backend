// tests/parserTest.js

const { parseToAST } = require('../utils/parser');

// Sample Rules to Test
const rules = [
    {
        name: 'rule1',
        expression: "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)"
    },
    {
        name: 'rule2',
        expression: "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)"
    },
    {
        name: 'simpleRule',
        expression: "age >= 18 AND status = 'Active'"
    },
    {
        name: 'invalidRule', // This rule is intentionally invalid for testing error handling
        expression: "age >> 30 AND department = 'HR'"
    }
];

/**
 * Function to test parsing of rules and output AST
 */
function testParser() {
    rules.forEach(rule => {
        console.log(`\n--- Testing ${rule.name} ---`);
        console.log(`Expression: ${rule.expression}`);
        try {
            const ast = parseToAST(rule.expression);
            console.log('AST:', JSON.stringify(ast.toObject(), null, 2));
        } catch (error) {
            console.error('Error:', error.message);
        }
    });
}

testParser();
