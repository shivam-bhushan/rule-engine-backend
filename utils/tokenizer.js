// tokenizer.js

const Spec = [
    // Parentheses
    [/^\(/, 'LPAREN'],
    [/^\)/, 'RPAREN'],

    // Logical Operators
    [/^AND\b/i, 'AND'],
    [/^OR\b/i, 'OR'],

    // Comparison Operators
    [/^>=/, 'GTE'],
    [/^<=/, 'LTE'],
    [/^!=/, 'NEQ'],
    [/^>/, 'GT'],
    [/^</, 'LT'], // Correctly uncommented
    [/^=/, 'EQ'],

    // Identifiers (e.g., age, department)
    [/^[a-zA-Z_][a-zA-Z0-9_]*/, 'IDENTIFIER'],

    // Numbers (integer and decimal)
    [/^\d+(\.\d+)?/, 'NUMBER'],

    // Strings (single and double quotes)
    [/^"[^"]*"/, 'STRING'],
    [/^'[^']*'/, 'STRING'],

    // Whitespace (ignored)
    [/^\s+/, null]
];

class Tokenizer {
    init(string) {
        this._string = string;
        this._cursor = 0;
    }

    hasMoreTokens() {
        return this._cursor < this._string.length;
    }

    isEOF() {
        return this._cursor >= this._string.length;
    }

    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null;
        }

        const string = this._string.slice(this._cursor);

        for (const [regex, type] of Spec) {
            const value = this._match(regex, string);
            if (value == null) {
                continue;
            }

            if (type == null) {
                return this.getNextToken();
            }

            return {
                type: type,
                value: value
            };
        }

        throw new Error(`Unexpected token: '${string[0]}' at position ${this._cursor}`);
    }

    _match(regex, string) {
        const matched = regex.exec(string);
        if (matched == null) {
            return null;
        }
        this._cursor += matched[0].length;
        return matched[0];
    }

    // Utility to tokenize the entire string
    tokenize() {
        const tokens = [];
        while (this.hasMoreTokens()) {
            const token = this.getNextToken();
            if (token) {
                tokens.push(token);
            }
        }
        return tokens;
    }
}

module.exports = {
    Tokenizer
};
