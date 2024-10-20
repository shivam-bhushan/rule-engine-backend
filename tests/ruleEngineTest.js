// tests/ruleEngineTest.js

const { create_rule, combine_two_rules, evaluate_rule } = require('../utils/ruleEngine');

/**
 * Comprehensive Test Function
 */
function comprehensiveTest() {
    console.log('--- Testing create_rule ---');
    const rule3String = "age >= 18 AND status = 'Active'";
    try {
        const rule3AST = create_rule(rule3String);
        console.log('Rule3 AST:', JSON.stringify(rule3AST, null, 2));

        // Define eligibility rules
        const rule1String = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)";
        const rule2String = "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)";

        const rule1AST = create_rule(rule1String);
        console.log('Rule1 AST:', JSON.stringify(rule1AST, null, 2));

        const rule2AST = create_rule(rule2String);
        console.log('Rule2 AST:', JSON.stringify(rule2AST, null, 2));

        // Combine Rule1 and Rule2 with OR
        const eligibilityAST = combine_two_rules(rule1AST, rule2AST, 'OR');
        console.log('Eligibility Combined AST (Rule1 OR Rule2):', JSON.stringify(eligibilityAST, null, 2));

        // Combine Rule3 with Eligibility AST using AND
        const combinedAST = combine_two_rules(rule3AST, eligibilityAST, 'AND');
        console.log('Final Combined AST (Rule3 AND (Rule1 OR Rule2)):', JSON.stringify(combinedAST, null, 2));

        // Define data samples
        const dataSamples = [
            {
                id: 1,
                data: {
                    age: 35,
                    department: 'Sales',
                    salary: 60000,
                    experience: 3,
                    status: 'Active'
                },
                expected: true
            },
            {
                id: 2,
                data: {
                    age: 22,
                    department: 'Marketing',
                    salary: 45000,
                    experience: 6,
                    status: 'Active' // Corrected to 'Active' to meet Rule3
                },
                expected: true
            },
            {
                id: 3,
                data: {
                    age: 28,
                    department: 'Engineering',
                    salary: 70000,
                    experience: 4,
                    status: 'Active'
                },
                expected: false
            },
            {
                id: 4,
                data: {
                    age: 19,
                    department: 'HR',
                    salary: 25000,
                    experience: 2,
                    status: 'Active'
                },
                expected: false
            }
        ];

        // Evaluate each data sample against the combined AST
        console.log('\n--- Testing evaluate_rule ---');
        dataSamples.forEach(sample => {
            try {
                const result = evaluate_rule(combinedAST, sample.data);
                console.log(`Data Sample ${sample.id} Eligible: ${result} (Expected: ${sample.expected})`);
            } catch (error) {
                console.error(`Data Sample ${sample.id} Evaluation Error:`, error.message);
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Execute the comprehensive test
comprehensiveTest();
