require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const API_URL = 'http://localhost:3001/api';

async function simulatePurchase() {
    try {
        console.log('💰 Simulating Purchase Actions...\n');

        // 1. Load test data
        const testData = JSON.parse(
            await fs.readFile(path.join(__dirname, 'testData.json'))
        );

        // 2. Create purchase
        console.log('1. Creating purchase...');
        const purchaseData = {
            buyerId: testData.buyer._id,
            designerId: testData.designer._id,
            tokenUri: testData.product.tokenUri,
            amount: testData.product.price
        };

        const purchaseResponse = await axios.post(
            `${API_URL}/purchase/buyProduct`,
            purchaseData
        );
        console.log('✅ Purchase completed:', purchaseResponse.data);

        // 3. Verify NFT ownership
        console.log('\n2. Verifying NFT ownership...');
        const productsResponse = await axios.get(
            `${API_URL}/designer/${testData.designer._id}/products`
        );
        
        const product = productsResponse.data.products.find(
            p => p.tokenUri === testData.product.tokenUri
        );
        
        if (product.nftOwner === testData.buyer.walletAddress) {
            console.log('✅ NFT ownership verified - transferred to buyer');
        } else {
            throw new Error('NFT ownership verification failed');
        }

        // 4. Check purchase history
        console.log('\n3. Checking purchase history...');
        const historyResponse = await axios.get(
            `${API_URL}/purchase/buyer/${testData.buyer._id}`
        );
        console.log('✅ Purchase history:', historyResponse.data);

        // Store final test data
        testData.purchase = purchaseResponse.data.purchase;
        await fs.writeFile(
            path.join(__dirname, 'testData.json'),
            JSON.stringify(testData, null, 2)
        );

        console.log('\n✨ Purchase simulation completed successfully!');

    } catch (error) {
        console.error('❌ Error in purchase simulation:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
}

if (require.main === module) {
    simulatePurchase();
}

module.exports = { simulatePurchase }; 