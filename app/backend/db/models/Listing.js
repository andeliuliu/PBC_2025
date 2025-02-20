const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    tokenId: {
        type: Number,
        required: true
    },
    tokenUri: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true
    },
    designer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Designer',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'cancelled'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);