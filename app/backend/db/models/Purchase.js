const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    tokenId: {
        type: Number,
        required: true
    },
    tokenUri: {
        type: String,
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Designer',
        required: true
    },
    designer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Designer',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transactionHash: {
        type: String,
        required: true,
        unique: true 
    },
    type: {
        type: String,
        enum: ['initial', 'marketplace'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);