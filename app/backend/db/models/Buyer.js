const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true
    }
}, { 
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Buyer', buyerSchema);