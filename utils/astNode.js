// astNodes.js

class OperandNode {
    constructor(field, operator, value) {
        this.type = 'operand';
        this.field = field;
        this.operator = operator;
        this.value = value;
    }

    toObject() {
        return {
            type: this.type,
            operand: {
                field: this.field,
                op: this.operator,
                value: this.value
            }
        };
    }
}

class OperatorNode {
    constructor(operator, left, right) {
        this.type = 'operator';
        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    toObject() {
        return {
            type: this.type,
            operator: this.operator,
            left: this.left.toObject(),
            right: this.right.toObject()
        };
    }
}

module.exports = {
    OperandNode,
    OperatorNode
};
