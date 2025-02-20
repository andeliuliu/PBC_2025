require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { uploadMetadata } = require('../ipfsService');

async function testIpfsUpload() {
    try {
        // 1. Check if file exists and log the full path
        const imagePath = path.join(__dirname, './sample-nft.png');
        console.log('Looking for image at:', imagePath);
        
        try {
            await fs.access(imagePath);
            console.log('✅ Image file exists');
        } catch (e) {
            console.error('❌ Image file not found!');
            throw new Error(`Image file not found at ${imagePath}`);
        }

        // 2. Read the image file
        console.log('Reading image file...');
        const imageBuffer = await fs.readFile(imagePath);
        console.log('✅ Image loaded, size:', imageBuffer.length, 'bytes');

        // 3. Create sample metadata
        const metadata = {
            name: "Test NFT",
            description: "This is a test NFT upload",
            attributes: [
                {
                    trait_type: "Test Trait",
                    value: "Test Value"
                }
            ]
        };
        console.log('Metadata prepared:', metadata);

        // 4. Upload to IPFS
        console.log('Attempting IPFS upload...');
        const ipfsUrl = await uploadMetadata(metadata, imageBuffer);
        console.log('✅ Successfully uploaded to IPFS!');
        console.log('IPFS URL:', ipfsUrl);
        
        return ipfsUrl;
    } catch (error) {
        console.error('❌ Error during test:', error.message);
        console.error('Stack trace:', error.stack);
        throw error;
    }
}

// Run the test
console.log('Starting IPFS upload test...');
testIpfsUpload()
    .then(() => console.log('Test completed successfully'))
    .catch(error => {
        console.error('Test failed:', error);
        process.exit(1);
    });