require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const API_URL = 'http://localhost:3001/api';

async function simulateBuyer() {
    try {
        console.log('👤 Simulating Buyer Actions...\n');

        // 1. Register buyer
        console.log('1. Registering buyer...');
        const buyerData = {
            name: "Alice",
            walletAddress: "0xd33dE88B94a56544034bc8c829078eba5DbF68f8"
        };

        const buyerResponse = await axios.post(`${API_URL}/buyer`, buyerData);
        console.log('✅ Buyer registered:', buyerResponse.data);

        // 2. Verify buyer registration
        console.log('\n2. Verifying buyer registration...');
        const verifyResponse = await axios.get(
            `${API_URL}/buyer/${buyerData.walletAddress}`
        );
        console.log('✅ Buyer verified:', verifyResponse.data);

        // Append buyer data to test data file
        const testData = JSON.parse(
            await fs.readFile(path.join(__dirname, 'testData.json'))
        );
        testData.buyer = buyerResponse.data.buyer;
        await fs.writeFile(
            path.join(__dirname, 'testData.json'),
            JSON.stringify(testData, null, 2)
        );

        console.log('\n✨ Buyer simulation completed successfully!');

    } catch (error) {
        console.error('❌ Error in buyer simulation:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
}

if (require.main === module) {
    simulateBuyer();
}

module.exports = { simulateBuyer };