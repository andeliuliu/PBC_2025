// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title BrandMembership
 * @dev An ERC721 contract that allows any brand/designer/influencer to mint
 *      a membership NFT for their customers. Each NFT can include brand info,
 *      discount codes, and a metadata URI referencing the product image.
 *      The NFT is freely transferable, allowing holders to trade their perks.
 */

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @notice No "Ownable" inheritance is used here because
 *         we want ANY caller (brand, influencer) to mint,
 *         not just the contract deployer.
 */
contract BrandMembership is ERC721URIStorage {
    /**
     * @dev Counter for assigning unique token IDs automatically
     */
    uint256 private _nextTokenId;

    /**
     * @dev Data structure to store brand-specific info for each NFT.
     *      - brandCreator: the address of the brand/influencer that minted the NFT
     *      - brandName:    the name or identifier of the brand
     *      - discountCode: any special perk or code associated with this NFT
     */
    struct NFTData {
        address brandCreator;
        string brandName;
        string discountCode;
    }

    /**
     * @dev Mapping from tokenId => NFTData to store brand details
     *      and membership perks for each NFT.
     */
    mapping(uint256 => NFTData) public nftDetails;

    /**
     * @dev Add the topNft variable
     */
    uint256 public topNft;

    /**
     * @notice Contract constructor
     * @dev Sets the name and symbol of the NFT collection.
     */
    constructor() ERC721("BrandMembership", "BRND") {
        // No owner restriction. Anyone can mint.
    }

    /**
     * @notice Mint a new NFT for a given recipient.
     * @param recipient   The wallet address that will receive the newly minted NFT.
     * @param tokenURI    The URI pointing to the metadata (image, product details, etc.).
     * @param brandName   A string identifying the brand (e.g. "Nike", "IndieDesignCo").
     * @param discountCode Any special discount, passcode, or perk string.
     *
     * Requirements:
     * - Anyone can call this function (i.e. any brand, designer, or influencer).
     * - The NFT is given to `recipient` without requiring payment in this contract.
     * - Gas fees can be subsidized externally (e.g., via a Paymaster) to make it free for the user.
     */
    function mintNFT(
        address recipient,
        string memory tokenURI,
        string memory brandName,
        string memory discountCode
    ) public {
        uint256 newItemId = _nextTokenId++;

        // Update topNft with the latest minted NFT ID
        topNft = newItemId;

        // Store brand-specific data for this NFT
        nftDetails[newItemId] = NFTData({
            brandCreator: msg.sender,
            brandName: brandName,
            discountCode: discountCode
        });

        // Mint the NFT to the recipient
        _safeMint(recipient, newItemId);

        // Assign the metadata URI (which should point to an image + JSON)
        _setTokenURI(newItemId, tokenURI);
    }

    /**
     * @notice Get brand details associated with a specific NFT.
     * @param tokenId The ID of the NFT you want info about.
     * @return brandCreator  The address that minted this NFT (the brand).
     * @return brandName     The brand name or identifier stored in the NFT data.
     * @return discountCode  The discount code or perk associated with this NFT.
     *
     * @dev This is purely a convenience function for external apps or UIs.
     */
    function getBrandDetails(uint256 tokenId)
        external
        view
        returns (
            address brandCreator,
            string memory brandName,
            string memory discountCode
        )
    {
        NFTData memory data = nftDetails[tokenId];
        return (data.brandCreator, data.brandName, data.discountCode);
    }

    /**
     * @notice Get all NFT details for a range of NFTs.
     * @param startId The starting token ID of the range.
     * @param endId The ending token ID of the range.
     * @return creators An array of addresses that minted the NFTs.
     * @return brands An array of brand names for the NFTs.
     * @return discounts An array of discount codes for the NFTs.
     * @return owners An array of addresses that own the NFTs.
     *
     * @dev This is purely a convenience function for external apps or UIs.
     */
    function getAllNFTDetails(uint256 startId, uint256 endId) 
        external 
        view 
        returns (
            address[] memory creators,
            string[] memory brands,
            string[] memory discounts,
            address[] memory owners
        ) 
    {
        require(endId >= startId, "Invalid range");
        uint256 size = endId - startId + 1;
        
        creators = new address[](size);
        brands = new string[](size);
        discounts = new string[](size);
        owners = new address[](size);
        
        for(uint256 i = 0; i < size; i++) {
            uint256 tokenId = startId + i;
            try this.ownerOf(tokenId) returns (address owner) {
                NFTData memory data = nftDetails[tokenId];
                creators[i] = data.brandCreator;
                brands[i] = data.brandName;
                discounts[i] = data.discountCode;
                owners[i] = owner;
            } catch {
                // Token doesn't exist, leave default values
                continue;
            }
        }
        
        return (creators, brands, discounts, owners);
    }
}