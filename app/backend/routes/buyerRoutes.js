const express = require("express");
const router = express.Router();
const Buyer = require('../db/models/Buyer');

/**
 * Register a buyer
 */
router.post("/", async (req, res) => {
  try {
    const { name, walletAddress } = req.body;

    // Check if buyer already exists
    const existingBuyer = await Buyer.findOne({ walletAddress });
    if (existingBuyer) {
      return res.status(400).json({ 
        success: false, 
        message: "Buyer already registered" 
      });
    }

    const buyer = new Buyer({
      name,
      walletAddress
    });

    const savedBuyer = await buyer.save();
    res.status(201).json({ success: true, buyer: savedBuyer });
  } catch (error) {
    console.error("Error registering buyer:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

/**
 * Get all buyers
 */
router.get("/", async (req, res) => {
  try {
    const buyers = await Buyer.find();
    res.json({ success: true, buyers });
  } catch (error) {
    console.error("Error fetching buyers:", error);
    res.status(500).json({ success: false, message: "Failed to fetch buyers" });
  }
});

/**
 * Get buyer by wallet address
 */
router.get("/:walletAddress", async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ 
      walletAddress: req.params.walletAddress 
    });
    
    if (!buyer) {
      return res.status(404).json({ 
        success: false, 
        message: "Buyer not found" 
      });
    }
    
    res.json({ success: true, buyer });
  } catch (error) {
    console.error("Error fetching buyer:", error);
    res.status(500).json({ success: false, message: "Failed to fetch buyer" });
  }
});

/**
 * Update buyer information
 */
router.put("/:walletAddress", async (req, res) => {
  try {
    const { name } = req.body;
    const buyer = await Buyer.findOneAndUpdate(
      { walletAddress: req.params.walletAddress },
      { name },
      { new: true } // Return the updated document
    );

    if (!buyer) {
      return res.status(404).json({ 
        success: false, 
        message: "Buyer not found" 
      });
    }

    res.json({ success: true, buyer });
  } catch (error) {
    console.error("Error updating buyer:", error);
    res.status(500).json({ success: false, message: "Failed to update buyer" });
  }
});

/**
 * Delete buyer
 */
router.delete("/:walletAddress", async (req, res) => {
  try {
    const buyer = await Buyer.findOneAndDelete({ 
      walletAddress: req.params.walletAddress 
    });

    if (!buyer) {
      return res.status(404).json({ 
        success: false, 
        message: "Buyer not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Buyer deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting buyer:", error);
    res.status(500).json({ success: false, message: "Failed to delete buyer" });
  }
});

module.exports = router;