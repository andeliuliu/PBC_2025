require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const API_URL = 'http://localhost:3001/api';

async function simulateDesigner() {
    try {
        console.log('🎨 Simulating Designer Actions...\n');

        // 1. Register designer
        console.log('1. Registering designer...');
        const designerData = {
            name: "Luxury Brand",
            walletAddress: "0x33606f5fDA618630f5B297EE84Cce30732dAd48a",
            brandName: "LuxuryNFT"
        };

        const designerResponse = await axios.post(`${API_URL}/designer`, designerData);
        console.log('✅ Designer registered:', designerResponse.data);

        // 2. Create a product and mint NFT
        console.log('\n2. Creating product and minting NFT...');
        const productData = {
            name: "Luxury Collection #1",
            price: 0.1, // ETH
            discountCode: "LUXURY2024",
            imageData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" // Example base64 image
        };

        const productResponse = await axios.post(
            `${API_URL}/designer/${designerResponse.data.designer._id}/products`,
            productData
        );
        console.log('✅ Product created:', productResponse.data);

        // 3. Verify product creation
        console.log('\n3. Verifying product creation...');
        const productsResponse = await axios.get(
            `${API_URL}/designer/${designerResponse.data.designer._id}/products`
        );
        console.log('✅ Products verified:', productsResponse.data);

        // Store data for other tests
        await fs.writeFile(
            path.join(__dirname, 'testData.json'), 
            JSON.stringify({ 
                designer: designerResponse.data.designer,
                product: productResponse.data.product
            }, null, 2)
        );

        console.log('\n✨ Designer simulation completed successfully!');

    } catch (error) {
        console.error('❌ Error in designer simulation:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
}

if (require.main === module) {
    simulateDesigner();
}

module.exports = { simulateDesigner };