const ethers = require('ethers');
const BrandMembershipABI = require("./BrandMembership.json");
require('dotenv').config();

// Setup provider and contract
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const brandSigner = new ethers.Wallet(process.env.PRIVATE_KEY_BRAND, provider);
const buyerSigner = new ethers.Wallet(process.env.PRIVATE_KEY_BUYER, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, BrandMembershipABI, brandSigner);

/**
 * Mint NFT to buyer
 */
async function mintNftToBuyer(buyerAddress, tokenUri, brandName, discountCode) {
    try {
        console.log(`Minting NFT to ${buyerAddress} with URI ${tokenUri}`);
        
        // Always use brandSigner for minting since only designer can mint
        const tx = await contract.mintNFT(
            buyerAddress,
            tokenUri,
            brandName,
            discountCode
        );
        
        const receipt = await tx.wait();
        console.log('Mint transaction receipt:', receipt);

        // Get tokenId from Transfer event
        const transferEvent = receipt.logs[0];
        const tokenId = parseInt(transferEvent.topics[3], 16);
        
        return { receipt, tokenId, tokenUri };
    } catch (error) {
        console.error('Error minting NFT:', error);
        throw error;
    }
}

/**
 * Transfer NFT from one address to another
 */
async function transferNft(from, to, tokenId) {
    try {
        console.log(`Transferring NFT ${tokenId} from ${from} to ${to}`);
        
        // Check current owner
        const currentOwner = await contract.ownerOf(tokenId);
        console.log('Current owner:', currentOwner);
        
        if (currentOwner.toLowerCase() !== from.toLowerCase()) {
            throw new Error(`Sender ${from} does not own token ${tokenId}`);
        }

        // Use different signer based on who's transferring
        let signerToUse;
        if (from.toLowerCase() === brandSigner.address.toLowerCase()) {
            console.log('Using brand signer for transfer');
            signerToUse = brandSigner;
        } else {
            console.log('Using buyer signer for transfer');
            signerToUse = buyerSigner;
        }

        // Connect contract with correct signer
        const contractWithSigner = contract.connect(signerToUse);
        
        console.log('Executing transfer...');
        const tx = await contractWithSigner.transferFrom(from, to, tokenId);
        const receipt = await tx.wait();
        console.log('Transfer confirmed:', receipt.hash);
        
        return receipt;
    } catch (error) {
        console.error('Error in transferNft:', error);
        throw error;
    }
}

/**
 * Get brand details for a specific token
 */
async function getBrandDetails(tokenId) {
    try {
        const details = await contract.getBrandDetails(tokenId);
        return {
            creator: details[0],
            brandName: details[1],
            discountCode: details[2]
        };
    } catch (error) {
        console.error('Error getting brand details:', error);
        throw error;
    }
}

/**
 * Get token URI
 */
async function getTokenURI(tokenId) {
    try {
        const uri = await contract.tokenURI(tokenId);
        return uri;
    } catch (error) {
        console.error('Error getting token URI:', error);
        throw error;
    }
}

/**
 * Check if an address owns a specific token
 */
async function ownerOf(tokenId) {
    try {
        const owner = await contract.ownerOf(tokenId);
        return owner;
    } catch (error) {
        console.error('Error getting token owner:', error);
        throw error;
    }
}

/**
 * Get balance of NFTs for an address
 */
async function balanceOf(address) {
    try {
        const balance = await contract.balanceOf(address);
        return balance;
    } catch (error) {
        console.error('Error getting balance:', error);
        throw error;
    }
}

/**
 * Check if token exists
 */
async function exists(tokenId) {
    try {
        const exists = await contract._exists(tokenId);
        return exists;
    } catch (error) {
        console.error('Error checking token existence:', error);
        throw error;
    }
}

/**
 * Get total supply of NFTs
 */
async function totalSupply() {
    try {
        const supply = await contract.totalSupply();
        return supply;
    } catch (error) {
        console.error('Error getting total supply:', error);
        throw error;
    }
}

/**
 * Get token by index
 */
async function tokenByIndex(index) {
    try {
        const tokenId = await contract.tokenByIndex(index);
        return tokenId;
    } catch (error) {
        console.error('Error getting token by index:', error);
        throw error;
    }
}

/**
 * Get token of owner by index
 */
async function tokenOfOwnerByIndex(owner, index) {
    try {
        const tokenId = await contract.tokenOfOwnerByIndex(owner, index);
        return tokenId;
    } catch (error) {
        console.error('Error getting token of owner by index:', error);
        throw error;
    }
}

/**
 * Get all tokens owned by an address
 */
async function getTokensOfOwner(ownerAddress) {
    try {
        const balance = await contract.balanceOf(ownerAddress);
        const tokens = [];
        
        for (let i = 0; i < balance; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(ownerAddress, i);
            const uri = await contract.tokenURI(tokenId);
            const details = await contract.getBrandDetails(tokenId);
            
            tokens.push({
                tokenId: tokenId.toString(),
                tokenUri: uri,
                brandName: details[1],
                discountCode: details[2]
            });
        }
        
        return tokens;
    } catch (error) {
        console.error('Error getting tokens of owner:', error);
        throw error;
    }
}

async function approveMarketplace(tokenId) {
    try {
        console.log(`Approving marketplace for token ${tokenId}`);
        const tx = await contract.approve(process.env.CONTRACT_ADDRESS, tokenId);
        const receipt = await tx.wait();
        return receipt;
    } catch (error) {
        console.error('Error approving marketplace:', error);
        throw error;
    }
}

async function isApprovedForMarketplace(tokenId) {
    try {
        const approved = await contract.getApproved(tokenId);
        return approved === process.env.CONTRACT_ADDRESS;
    } catch (error) {
        console.error('Error checking approval:', error);
        throw error;
    }
}

module.exports = {
    mintNftToBuyer,
    transferNft,
    getBrandDetails,
    getTokenURI,
    ownerOf,
    balanceOf,
    exists,
    totalSupply,
    tokenByIndex,
    tokenOfOwnerByIndex,
    getTokensOfOwner,
    approveMarketplace,
    isApprovedForMarketplace
};