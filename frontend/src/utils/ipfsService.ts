export const uploadMetadata = async (metadata: any) => {
  try {
    // First, upload the image to Pinata
    const imageResponse = await fetch(metadata.image);
    const imageBlob = await imageResponse.blob();
    const imageFile = new File([imageBlob], 'nft-image.png', { type: 'image/png' });

    const imageFormData = new FormData();
    imageFormData.append('file', imageFile);

    const imageUploadRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
      },
      body: imageFormData
    });

    const imageData = await imageUploadRes.json();
    
    if (!imageData.IpfsHash) {
      throw new Error('Failed to upload image to IPFS');
    }

    // Update metadata with IPFS image URL
    const updatedMetadata = {
      ...metadata,
      image: `ipfs://${imageData.IpfsHash}`
    };

    // Upload metadata JSON to Pinata
    const metadataBlob = new Blob([JSON.stringify(updatedMetadata)], { type: 'application/json' });
    const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });

    const metadataFormData = new FormData();
    metadataFormData.append('file', metadataFile);

    const metadataUploadRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
      },
      body: metadataFormData
    });

    const metadataData = await metadataUploadRes.json();

    if (!metadataData.IpfsHash) {
      throw new Error('Failed to upload metadata to IPFS');
    }

    return `ipfs://${metadataData.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}; 