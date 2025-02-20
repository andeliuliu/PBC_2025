const pinataSDK = require('@pinata/sdk');
const { Readable } = require('stream');

async function uploadMetadata(metadata, imageBuffer, brandName, discountCode) {
    try {
        // Validate API keys are present
        if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
            throw new Error('Pinata API keys are not set in environment variables');
        }

        const pinata = new pinataSDK(
            process.env.PINATA_API_KEY,
            process.env.PINATA_SECRET_KEY
        );

        // Convert buffer to readable stream
        const stream = Readable.from(imageBuffer);
        const imageOptions = {
            pinataMetadata: {
                name: `${metadata.name}-image`
            }
        };

        console.log('Uploading image to Pinata...');
        const imageResult = await pinata.pinFileToIPFS(stream, imageOptions);
        console.log('Image uploaded:', imageResult);

        // Create metadata with IPFS image URL and brand details
        const metadataWithDetails = {
            ...metadata,
            image: `ipfs://${imageResult.IpfsHash}`,
            attributes: [
                ...(metadata.attributes || []),
                {
                    trait_type: "Brand",
                    value: brandName
                },
                {
                    trait_type: "Type",
                    value: "Membership"
                },
                {
                    trait_type: "Discount Code",
                    value: discountCode
                }
            ]
        };

        // Upload metadata
        const metadataOptions = {
            pinataMetadata: {
                name: `${metadata.name}-metadata`
            }
        };

        console.log('Uploading metadata to Pinata...');
        const metadataResult = await pinata.pinJSONToIPFS(metadataWithDetails, metadataOptions);
        console.log('Metadata uploaded:', metadataResult);

        return `ipfs://${metadataResult.IpfsHash}`;
    } catch (error) {
        console.error('Pinata error details:', error);
        throw error;
    }
}

module.exports = { uploadMetadata };