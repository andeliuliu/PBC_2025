const express = require("express");
const router = express.Router();
const Purchase = require('../db/models/Purchase');
const Designer = require('../db/models/Designer');
const Buyer = require('../db/models/Buyer');
const { mintNftToBuyer } = require('../contractService');

/**
 * Get all purchases for a buyer
 */
router.get("/buyer/:buyerId", async (req, res) => {
    try {
        const purchases = await Purchase.find({ buyer: req.params.buyerId })
            .populate('buyer', 'name walletAddress')
            .populate('designer', 'name brandName')
            .sort({ purchasedAt: -1 });

        res.json({ success: true, purchases });
    } catch (error) {
        console.error("Error fetching purchases:", error);
        res.status(500).json({ success: false, message: "Failed to fetch purchases" });
    }
});

/**
 * Get all sales for a designer
 */
router.get("/designer/:designerId", async (req, res) => {
    try {
        const purchases = await Purchase.find({ designer: req.params.designerId })
            .populate('buyer', 'name walletAddress')
            .populate('designer', 'name brandName')
            .sort({ purchasedAt: -1 });

        res.json({ success: true, purchases });
    } catch (error) {
        console.error("Error fetching sales:", error);
        res.status(500).json({ success: false, message: "Failed to fetch sales" });
    }
});

/**
 * Create new purchase and mint NFT
 */
router.post("/buyProduct", async (req, res) => {
    try {
        const { buyerId, designerId, tokenUri, amount } = req.body;

        // Get buyer and designer details
        const buyer = await Buyer.findById(buyerId);
        const designer = await Designer.findById(designerId);

        if (!buyer || !designer) {
            return res.status(404).json({
                success: false,
                message: 'Buyer or Designer not found'
            });
        }

        // Mint NFT to buyer
        const { receipt, tokenId } = await mintNftToBuyer(
            buyer.walletAddress,
            tokenUri,
            designer.brandName,
            'DISCOUNT_CODE'
        );

        // Create purchase record
        const purchase = new Purchase({
            tokenId: tokenId,
            tokenUri: tokenUri,
            buyer: buyerId,
            seller: designerId,
            designer: designerId,
            amount: amount,
            transactionHash: receipt.hash,
            type: 'initial'
        });

        await purchase.save();

        res.status(201).json({
            success: true,
            purchase: purchase,
            transaction: receipt
        });

    } catch (error) {
        console.error('Error processing purchase:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * Get purchase details by tokenId
 */
router.get("/token/:tokenId", async (req, res) => {
    try {
        const purchase = await Purchase.findOne({ tokenId: req.params.tokenId })
            .populate('buyer', 'name walletAddress')
            .populate('designer', 'name brandName');

        if (!purchase) {
            return res.status(404).json({ 
                success: false, 
                message: "Purchase not found" 
            });
        }

        res.json({ success: true, purchase });
    } catch (error) {
        console.error("Error fetching purchase:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch purchase" 
        });
    }
});

module.exports = router;