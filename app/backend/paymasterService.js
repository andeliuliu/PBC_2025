const { ethers } = require('ethers');
require('dotenv').config();

class PaymasterService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    }

    async sponsorTransaction(userAddress, transactionData) {
        try {
            // Basic gas sponsorship logic
            return {
                sponsored: true,
                gasLimit: '300000'
            };
        } catch (error) {
            console.error('Error sponsoring transaction:', error);
            throw error;
        }
    }
}

module.exports = new PaymasterService();