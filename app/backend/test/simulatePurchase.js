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

        // 2. Create initial purchase from designer
        console.log('1. Creating purchase from designer...');
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
        console.log('✅ Initial purchase completed:', purchaseResponse.data);

        // 3. Create marketplace listing
        console.log('\n2. Creating marketplace listing...');
        const listingData = {
            tokenId: purchaseResponse.data.purchase.tokenId,
            tokenUri: testData.product.tokenUri,
            price: testData.product.price,
            designerId: testData.designer._id,
            sellerId: testData.buyer._id
        };

        const listingResponse = await axios.post(
            `${API_URL}/marketplace/list`,
            listingData
        );
        console.log('✅ Listing created:', listingResponse.data);

        // 4. Create second buyer
        console.log('\n3. Creating second buyer...');
        const buyer2Data = {
            name: 'Second Buyer',
            walletAddress: '0xc96a4D66Dc669799c042b5D6CC94e907CEea1aF1'
        };

        const buyer2Response = await axios.post(
            `${API_URL}/buyer`,
            buyer2Data
        );
        console.log('✅ Second buyer created:', buyer2Response.data);

        // 5. Purchase from marketplace
        console.log('\n4. Purchasing from marketplace...');
        const marketplacePurchaseData = {
            buyerId: buyer2Response.data.buyer._id
        };

        const marketplacePurchaseResponse = await axios.post(
            `${API_URL}/marketplace/buy/${listingResponse.data.listing._id}`,
            marketplacePurchaseData
        );
        console.log('✅ Marketplace purchase completed:', marketplacePurchaseResponse.data);

        // Store final test data
        testData.purchase = purchaseResponse.data.purchase;
        testData.marketplace = {
            listing: listingResponse.data.listing,
            secondaryBuyer: buyer2Response.data.buyer,
            secondaryPurchase: marketplacePurchaseResponse.data
        };

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