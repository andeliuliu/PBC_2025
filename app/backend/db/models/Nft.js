const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
    tokenId: {
        type: Number,
        required: true,
        unique: true
    },
    owner: {
        type: String,  // wallet address
        required: true
    },
    designer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Designer',
        required: true
    },
    brandName: {
        type: String,
        required: true
    },
    discountCode: {
        type: String,
        required: true
    },
    tokenUri: {
        type: String,
        required: true
    },
    // Keep metadata simpler since it's just for brand membership
    metadata: {
        name: String,
        description: String,
        image: String
    },
    mintedAt: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true 
});

// Index for faster queries
nftSchema.index({ owner: 1 });
nftSchema.index({ brandName: 1 });

// Virtual for checking if NFT exists (useful for API responses)
nftSchema.virtual('exists').get(function() {
    return true;
});

// Method to format NFT data for API responses
nftSchema.methods.toJSON = function() {
    const obj = this.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('Nft', nftSchema);