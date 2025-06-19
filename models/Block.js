const mongoose = require('mongoose');
const crypto = require('crypto-js');

const BlockSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    activityType: {
        type: String,
        required: true,
        enum: ['harvest', 'transport', 'sell']
    },
    productId: {
        type: String,
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    previousHash: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
});

BlockSchema.pre('save', function(next) {
    const blockString = JSON.stringify({
        index: this.index,
        timestamp: this.timestamp,
        activityType: this.activityType,
        productId: this.productId,
        data: this.data,
        previousHash: this.previousHash
    });
    this.hash = crypto.SHA256(blockString).toString();
    next();
});

module.exports = mongoose.model('Block', BlockSchema); 