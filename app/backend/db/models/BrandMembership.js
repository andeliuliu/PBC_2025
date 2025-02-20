const mongoose = require('mongoose');

const brandMembershipSchema = new mongoose.Schema({
    buyerAddress: {
        type: String,
        required: true
    },
    brandName: {
        type: String,
        required: true
    },
    nftCount: {
        type: Number,
        default: 1
    },
    nftTokenIds: [{
        type: Number
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true 
});

// Compound index to ensure unique buyer-brand pairs
brandMembershipSchema.index({ buyerAddress: 1, brandName: 1 }, { unique: true });

module.exports = mongoose.model('BrandMembership', brandMembershipSchema);