const express = require("express");
const router = express.Router();
const Purchase = require('../db/models/Purchase');
const Designer = require('../db/models/Designer');
const Buyer = require('../db/models/Buyer');
const { transferNft } = require("../contractService");

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
        const { buyerId, designerId, tokenUri } = req.body;

        // Find buyer
        const buyer = await Buyer.findById(buyerId);
        if (!buyer) {
            return res.status(400).json({ 
                success: false, 
                message: "Buyer not found" 
            });
        }

        // Find designer and product
        const designer = await Designer.findById(designerId);
        if (!designer) {
            return res.status(400).json({ 
                success: false, 
                message: "Designer not found" 
            });
        }

        const product = designer.products.find(p => p.tokenUri === tokenUri);
        if (!product) {
            return res.status(400).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        // Transfer NFT
        const receipt = await transferNft(
            designer.walletAddress,
            buyer.walletAddress,
            product.tokenId  // Use tokenId for the transfer
        );

        // Update product owner
        product.nftOwner = buyer.walletAddress;
        await designer.save();

        // Create purchase record - Now including all required fields
        const purchase = new Purchase({
            tokenId: product.tokenId,    // Add this
            tokenUri: product.tokenUri,
            buyer: buyerId,
            designer: designerId,
            amount: product.price,
            transactionHash: receipt.hash,  // Changed from receipt.transactionHash
            status: 'completed'
        });

        const savedPurchase = await purchase.save();
        const populatedPurchase = await Purchase.findById(savedPurchase._id)
            .populate('buyer', 'name walletAddress')
            .populate('designer', 'name brandName');

        res.json({ 
            success: true, 
            purchase: populatedPurchase,
            transaction: receipt
        });

    } catch (error) {
        console.error("Error processing purchase:", error);
        res.status(500).json({ 
            success: false, 
            message: "Purchase failed" 
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