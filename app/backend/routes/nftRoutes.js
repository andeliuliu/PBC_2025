const express = require('express');
const router = express.Router();
const Nft = require('../db/models/Nft');
const Designer = require('../db/models/Designer');
const { 
    mintNftToBuyer, 
    getBrandDetails, 
    getTokensOfOwner,
    ownerOf 
} = require('../contractService');

/**
 * Get all NFTs owned by a wallet address
 */
router.get('/owner/:walletAddress', async (req, res) => {
    try {
        const walletAddress = req.params.walletAddress;
        
        // Get NFTs from blockchain
        const tokens = await getTokensOfOwner(walletAddress);
        
        // Get detailed NFT info from database
        const nfts = await Nft.find({ 
            tokenId: { $in: tokens.map(t => t.tokenId) }
        }).populate('designer', 'name brandName');

        res.json({ 
            success: true, 
            nfts: nfts.map(nft => ({
                ...nft.toObject(),
                brandDetails: tokens.find(t => t.tokenId === nft.tokenId.toString())
            }))
        });
    } catch (error) {
        console.error('Error fetching owner NFTs:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch owner NFTs' 
        });
    }
});

/**
 * Get specific NFT details by tokenId
 */
router.get('/:tokenId', async (req, res) => {
    try {
        const tokenId = req.params.tokenId;

        // Check if NFT exists and get owner
        const owner = await ownerOf(tokenId);
        
        // Get brand details from blockchain
        const brandDetails = await getBrandDetails(tokenId);
        
        // Get detailed NFT info from database
        const nft = await Nft.findOne({ tokenId })
            .populate('designer', 'name brandName');
        
        if (!nft) {
            return res.status(404).json({ 
                success: false, 
                message: 'NFT not found in database' 
            });
        }
        
        res.json({ 
            success: true, 
            nft: {
                ...nft.toObject(),
                currentOwner: owner,
                brandDetails
            }
        });
    } catch (error) {
        console.error('Error fetching NFT:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch NFT' 
        });
    }
});

/**
 * Mint new NFT to buyer (called from purchase route)
 */
router.post('/mint', async (req, res) => {
    try {
        const {
            buyerAddress,
            designerId,
            tokenUri,
            discountCode
        } = req.body;

        // 1. Verify designer exists
        const designer = await Designer.findById(designerId);
        if (!designer) {
            return res.status(400).json({
                success: false,
                message: 'Designer not found'
            });
        }

        // 2. Mint NFT on blockchain
        const { receipt, tokenId } = await mintNftToBuyer(
            buyerAddress,
            tokenUri,
            designer.brandName,
            discountCode
        );

        // 3. Create NFT record in database
        const nft = new Nft({
            tokenId,
            owner: buyerAddress,
            designer: designerId,
            brandName: designer.brandName,
            discountCode,
            tokenUri,
            metadata: {
                name: `${designer.brandName} NFT #${tokenId}`,
                description: `Membership NFT for ${designer.brandName}`,
                image: tokenUri
            }
        });

        const savedNft = await nft.save();
        const populatedNft = await Nft.findById(savedNft._id)
            .populate('designer', 'name brandName');

        res.status(201).json({ 
            success: true, 
            nft: populatedNft,
            transaction: receipt
        });
    } catch (error) {
        console.error('Error minting NFT:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to mint NFT' 
        });
    }
});

module.exports = router;