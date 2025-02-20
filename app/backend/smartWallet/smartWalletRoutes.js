const express = require('express');
const router = express.Router();
const smartWalletService = require('./smartWalletService');
const paymasterService = require('../paymasterService');

// Create smart wallet for buyer
router.post('/create', async (req, res) => {
    try {
        const { buyerId } = req.body;
        const wallet = await smartWalletService.createWallet(buyerId);
        res.json({ success: true, wallet });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get sponsored transaction
router.post('/sponsor', async (req, res) => {
    try {
        const { userAddress, transactionData } = req.body;
        const sponsorship = await paymasterService.sponsorTransaction(
            userAddress, 
            transactionData
        );
        res.json({ success: true, sponsorship });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;