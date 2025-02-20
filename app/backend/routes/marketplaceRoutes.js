const express = require('express');
const router = express.Router();
const Listing = require('../db/models/Listing');
const Buyer = require('../db/models/Buyer');
const Purchase = require('../db/models/Purchase');
const { transferNft, approveMarketplace, isApprovedForMarketplace } = require('../contractService');

// List NFT for sale
router.post('/list', async (req, res) => {
    try {
        const { tokenId, tokenUri, price, designerId, sellerId } = req.body;

        const listing = new Listing({
            tokenId,
            tokenUri,
            seller: sellerId,
            designer: designerId,
            price
        });

        await listing.save();
        res.status(201).json({ success: true, listing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all active listings
router.get('/listings', async (req, res) => {
    try {
        const listings = await Listing
            .find({ status: 'active' })
            .populate('seller', 'name walletAddress')
            .populate('designer', 'brandName');
        
        res.json({ success: true, listings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Purchase listed NFT
router.post('/buy/:listingId', async (req, res) => {
    try {
        const { buyerId } = req.body;
        
        const buyer = await Buyer.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: 'Buyer not found'
            });
        }

        const listing = await Listing.findById(req.params.listingId)
            .populate('seller')
            .populate('designer');
        
        if (!listing || listing.status !== 'active') {
            return res.status(400).json({ 
                success: false, 
                message: 'Listing not available' 
            });
        }

        console.log('Transfer details:', {
            from: listing.seller.walletAddress,
            to: buyer.walletAddress,
            tokenId: listing.tokenId
        });

        const tokenId = Number(listing.tokenId);

        const receipt = await transferNft(
            listing.seller.walletAddress,
            buyer.walletAddress,
            tokenId
        );

        listing.status = 'sold';
        await listing.save();

        const purchase = new Purchase({
            tokenId: tokenId,
            tokenUri: listing.tokenUri,
            buyer: buyerId,
            seller: listing.seller._id,
            designer: listing.designer._id,
            amount: listing.price,
            transactionHash: receipt.hash,
            type: 'marketplace'
        });

        await purchase.save();

        res.json({ 
            success: true, 
            purchase,
            transaction: receipt 
        });
    } catch (error) {
        console.error('Error in marketplace purchase:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Transfer failed. Please check NFT ownership and approvals.' 
        });
    }
});

// Cancel listing
router.post('/cancel/:listingId', async (req, res) => {
    try {
        const { sellerId } = req.body;
        const listing = await Listing.findById(req.params.listingId);
        
        if (listing.seller.toString() !== sellerId) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized' 
            });
        }

        listing.status = 'cancelled';
        await listing.save();

        res.json({ success: true, listing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get user's listings
router.get('/my-listings/:userId', async (req, res) => {
    try {
        const listings = await Listing
            .find({ seller: req.params.userId })
            .populate('designer', 'brandName');
        
        res.json({ success: true, listings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;