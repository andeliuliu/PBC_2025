require('dotenv').config();
const pinataSDK = require('@pinata/sdk');

async function testPinata() {
    try {
        console.log('Testing Pinata connection...');
        
        const pinata = new pinataSDK(
            process.env.PINATA_API_KEY,
            process.env.PINATA_SECRET_KEY
        );

        // Test authentication
        const auth = await pinata.testAuthentication();
        console.log('Authentication successful:', auth);
        
        // Create a simple test JSON
        const testJSON = {
            name: "Test NFT",
            description: "Testing Pinata connection",
            image: "test image",
            attributes: []
        };
        
        console.log('Attempting to pin JSON...');
        const result = await pinata.pinJSONToIPFS(testJSON, {
            pinataMetadata: {
                name: 'test-nft-metadata'
            }
        });
        
        console.log('Success! Result:', result);
        return result;
    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        throw error;
    }
}

testPinata()
    .then(console.log)
    .catch(console.error);