const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tokenId: {
        type: Number,
        required: true
    },
    tokenUri: {
        type: String,
        required: true,
        unique: true
    },
    discountCode: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    nftOwner: {
        type: String,  // wallet address
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const designerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },
    brandName: {
        type: String,
        required: true
    },
    products: [productSchema]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Designer', designerSchema);