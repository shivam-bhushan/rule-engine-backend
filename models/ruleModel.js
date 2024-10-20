// models/Rule.js

const mongoose = require('mongoose');

const OperandSchema = new mongoose.Schema({
    field: { type: String, required: true },
    op: { type: String, required: true, enum: ['>', '<', '=', '!=', '>=', '<='] },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
}, { _id: false });

const OperatorSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['AND', 'OR'] },
    left: { type: mongoose.Schema.Types.Mixed, required: true },
    right: { type: mongoose.Schema.Types.Mixed, required: true },
}, { _id: false });

const RuleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    expression: { type: String, required: true },
    ast: { type: mongoose.Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

RuleSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Rule = mongoose.model('Rule', RuleSchema);

module.exports = Rule;
