// parser.js

const { Tokenizer } = require('./tokenizer');
const { OperandNode, OperatorNode } = require('./astNode');

class Parser {
    constructor() {
        this.tokens = [];
        this.current = 0;
    }

    parse(input) {
        const tokenizer = new Tokenizer();
        tokenizer.init(input);
        this.tokens = tokenizer.tokenize();
        this.current = 0;

        const ast = this.parseExpression();
        if (this.current < this.tokens.length) {
            throw new Error('Unexpected tokens at the end of expression');
        }
        return ast;
    }

    // Helper to get the current token
    peek() {
        return this.tokens[this.current];
    }

    // Helper to consume the current token if it matches the type
    consume(type) {
        const token = this.peek();
        if (token && token.type === type) {
            this.current++;
            return token;
        }
        return null;
    }

    // Entry point for parsing expressions
    parseExpression() {
        return this.parseOr();
    }

    // Parse OR expressions
    parseOr() {
        let node = this.parseAnd();

        while (this.consume('OR')) {
            const operator = 'OR';
            const right = this.parseAnd();
            node = new OperatorNode(operator, node, right);
        }

        return node;
    }

    // Parse AND expressions
    parseAnd() {
        let node = this.parseComparison();

        while (this.consume('AND')) {
            const operator = 'AND';
            const right = this.parseComparison();
            node = new OperatorNode(operator, node, right);
        }

        return node;
    }

    // Parse comparison expressions
    parseComparison() {
        let node = this.parsePrimary();

        const comparisonOperators = ['GT', 'LT', 'EQ', 'NEQ', 'GTE', 'LTE'];
        const operatorToken = this.peek();

        if (operatorToken && comparisonOperators.includes(operatorToken.type)) {
            this.current++;
            const operatorMap = {
                'GT': '>',
                'LT': '<',
                'EQ': '=',
                'NEQ': '!=',
                'GTE': '>=',
                'LTE': '<='
            };
            const operator = operatorMap[operatorToken.type];
            const valueNode = this.parsePrimary();

            if (node.type !== 'operand' || typeof node.value !== 'string') {
                throw new Error('Left-hand side of comparison must be an identifier');
            }

            node = new OperandNode(node.value, operator, valueNode.value);
        }

        return node;
    }

    // Parse primary expressions (identifiers, literals, parentheses)
    parsePrimary() {
        const token = this.peek();

        if (!token) {
            throw new Error('Unexpected end of input');
        }

        if (token.type === 'LPAREN') {
            this.consume('LPAREN');
            const node = this.parseExpression();
            if (!this.consume('RPAREN')) {
                throw new Error('Expected closing parenthesis');
            }
            return node;
        }

        if (token.type === 'IDENTIFIER') {
            this.current++;
            return {
                type: 'operand',
                value: token.value
            };
        }

        if (token.type === 'NUMBER') {
            this.current++;
            return {
                type: 'operand',
                value: Number(token.value)
            };
        }

        if (token.type === 'STRING') {
            this.current++;
            // Remove quotes
            const str = token.value.slice(1, -1);
            return {
                type: 'operand',
                value: str
            };
        }

        throw new Error(`Unexpected token: '${token.value}' of type ${token.type}`);
    }
}

function parseToAST(ruleString) {
    const parser = new Parser();
    return parser.parse(ruleString);
}

module.exports = {
    parseToAST
};
