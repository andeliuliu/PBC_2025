const { uploadMetadata } = require('../ipfsService');
const fs = require('fs').promises;
const path = require('path');
const { ethers } = require('ethers');
require('dotenv').config();

// Add these lines to get contract and address
const BrandMembershipABI = require("../BrandMembership.json");
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const brandSigner = new ethers.Wallet(process.env.PRIVATE_KEY_BRAND, provider);
const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    BrandMembershipABI,
    brandSigner
);

async function mintNFT() {
    try {
        // Check contract deployment
        console.log('Contract address:', process.env.CONTRACT_ADDRESS);
        console.log('Minting to address:', process.env.RECIPIENT_ADDRESS);
        
        // Check wallet balance
        const balance = await provider.getBalance(brandSigner.address);
        console.log('Wallet balance:', ethers.formatEther(balance), 'BASE');

        const imageBuffer = await fs.readFile(path.join(__dirname, './sample-nft.png'));
        const metadata = {
            name: "My Brand NFT #1",
            description: "A unique brand membership NFT",
            attributes: [
                {
                    trait_type: "Brand",
                    value: "YourBrand"
                },
                {
                    trait_type: "Membership Level",
                    value: "Gold"
                }
            ]
        };

        console.log('Uploading to Pinata...');
        const tokenUri = await uploadMetadata(metadata, imageBuffer);
        console.log('Metadata uploaded to IPFS:', tokenUri);

        console.log('Preparing to mint NFT...');
        const tx = await contract.mintNFT(
            process.env.RECIPIENT_ADDRESS,
            tokenUri,
            "YourBrand",
            "GOLD2024",
            {
                gasLimit: 300000  // Fixed gas limit
            }
        );
        
        console.log('Transaction sent:', tx.hash);
        console.log('Waiting for confirmation...');
        const receipt = await tx.wait();
        console.log('Transaction confirmed in block:', receipt.blockNumber);
        
    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            code: error.code,
            data: error.data,
            transaction: error.transaction
        });
        throw error;
    }
}

mintNFT()
    .then(() => console.log('Process completed successfully'))
    .catch(error => {
        console.error('Process failed:', error);
        process.exit(1);
    });