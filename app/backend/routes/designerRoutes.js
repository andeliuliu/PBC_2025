const express = require("express");
const router = express.Router();
const Designer = require('../db/models/Designer');
const { uploadMetadata } = require("../ipfsService");
const { mintNftToBuyer } = require("../contractService");

// Register designer
router.post("/", async (req, res) => {
  try {
    const { name, walletAddress, brandName } = req.body;

    // Check if designer already exists
    const existingDesigner = await Designer.findOne({ walletAddress });
    if (existingDesigner) {
      return res.status(400).json({ 
        success: false, 
        message: "Designer already registered" 
      });
    }

    const designer = new Designer({
      name,
      walletAddress,
      brandName
    });

    const savedDesigner = await designer.save();
    res.status(201).json({ success: true, designer: savedDesigner });
  } catch (error) {
    console.error("Error registering designer:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

/**
 * Create a new product and mint its NFT
 */
router.post("/:designerId/products", async (req, res) => {
    try {
        const { 
            name, 
            price,
            discountCode,
            imageData
        } = req.body;

        const designer = await Designer.findById(req.params.designerId);
        if (!designer) {
            return res.status(400).json({ 
                success: false, 
                message: "Designer not found" 
            });
        }

        const metadata = {
            name: `${name} - ${designer.brandName}`,
            description: `Exclusive NFT for ${designer.brandName}`
        };

        const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
        
        const tokenUri = await uploadMetadata(
            metadata,
            imageBuffer,
            designer.brandName,
            discountCode
        );

        const { receipt, tokenId } = await mintNftToBuyer(
            designer.walletAddress,
            tokenUri,
            designer.brandName,
            discountCode
        );

        const product = {
            name,
            tokenId,
            tokenUri,
            discountCode,
            price,
            nftOwner: designer.walletAddress
        };

        designer.products.push(product);
        await designer.save();

        res.status(201).json({ 
            success: true, 
            product,
            transaction: receipt
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to create product" 
        });
    }
});

/**
 * Get all products for a designer
 */
router.get("/:designerId/products", async (req, res) => {
    try {
        const designer = await Designer.findById(req.params.designerId);
        if (!designer) {
            return res.status(404).json({ 
                success: false, 
                message: "Designer not found" 
            });
        }

        res.json({ 
            success: true, 
            products: designer.products 
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch products" 
        });
    }
});

// Get designer by wallet address
router.get("/:walletAddress", async (req, res) => {
  try {
    const designer = await Designer.findOne({ 
      walletAddress: req.params.walletAddress 
    });
    
    if (!designer) {
      return res.status(404).json({ 
        success: false, 
        message: "Designer not found" 
      });
    }
    
    res.json({ success: true, designer });
  } catch (error) {
    console.error("Error fetching designer:", error);
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
});

module.exports = router;